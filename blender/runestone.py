"""Procedural carved runestone for the portfolio scene.

Run inside Blender (e.g. via the Blender MCP):
    exec(open(".../blender/runestone.py").read()); build(seed=1)
Front of the stone faces -Y (becomes +Z in glTF). Origin: bottom centre.
"""
import bpy, bmesh, math
import numpy as np
from mathutils import noise, Vector

W0, W1, H, D = 3.6, 2.9, 5.4, 0.75   # bottom width, top width, height, depth
CX, CZ, R = 0.10, 2.60, 1.18          # medallion centre (x, z) and recess radius


def sstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return np.array([((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c])


# (dark, light, moss_dark, moss_light) per variant: slate-blue, green granite, violet basalt
PALETTES = [
    ("#161b29", "#4b5673", "#13241a", "#33512a"),
    ("#151f1c", "#51615a", "#17261a", "#3f5c2c"),
    ("#201a29", "#5d5170", "#13241a", "#33512a"),
]

GLYPHS = [
    [[(.45, .1), (.45, .9)], [(.45, .4), (.75, .2)], [(.45, .65), (.75, .45)]],
    [[(.3, .9), (.3, .1), (.7, .3), (.7, .9)]],
    [[(.4, .1), (.4, .9)], [(.4, .3), (.7, .5), (.4, .7)]],
    [[(.4, .1), (.4, .9)], [(.4, .1), (.72, .3)], [(.4, .38), (.72, .58)]],
    [[(.35, .1), (.35, .9)], [(.35, .1), (.7, .3), (.35, .5), (.72, .9)]],
    [[(.5, .1), (.75, .35), (.5, .6), (.25, .35), (.5, .1)], [(.5, .6), (.25, .9)], [(.5, .6), (.75, .9)]],
    [[(.25, .15), (.75, .85)], [(.75, .15), (.25, .85)]],
    [[(.7, .2), (.35, .5), (.7, .8)]],
    [[(.5, .1), (.5, .9)], [(.25, .25), (.5, .5), (.75, .25)]],
    [[(.5, .1), (.5, .9)], [(.25, .1), (.75, .9)]],
]


def _seg_dist(px, pz, a, b):
    ax, az = a
    bx, bz = b
    dx, dz = bx - ax, bz - az
    t = np.clip(((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz + 1e-12), 0, 1)
    return np.hypot(px - (ax + t * dx), pz - (az + t * dz))


def _glyph_row(x, z, zc, count, size, gap, rng, x_off):
    dmin = np.full(len(x), 9.0)
    x0 = x_off - (count * size + (count - 1) * gap) / 2
    for k in range(count):
        g = GLYPHS[rng.randint(len(GLYPHS))]
        gx = x0 + k * (size + gap)
        for stroke in g:
            pts = [(gx + u * size, zc + (v - 0.5) * size * 1.5) for (u, v) in stroke]
            for a, b in zip(pts[:-1], pts[1:]):
                dmin = np.minimum(dmin, _seg_dist(x, z, a, b))
    return dmin


def _groove(d, width, depth):
    return -depth * (1 - sstep(width * 0.72, width, d))   # flat floor, crisp walls


def _lin(c1, c2, t):
    return tuple(float(v) for v in (c1 * (1 - t) + c2 * t)) + (1.0,)


def _add_base_details(obj, rng, off, blob_subs):
    """Fallen rubble and moss clumps around the foot of the stone (merged into the mesh)."""
    me = obj.data
    bm = bmesh.new()
    bm.from_mesh(me)
    lay = bm.verts.layers.float_color.get("Col") or bm.verts.layers.float_color.new("Col")
    lay_r = bm.verts.layers.float.get("Rough") or bm.verts.layers.float.new("Rough")
    lay_g = bm.verts.layers.float.get("Glow") or bm.verts.layers.float.new("Glow")

    def blob(c, size, rot, col_a, col_b, freq, amp, subs, sink, rough_val=0.9):
        verts = bmesh.ops.create_icosphere(bm, subdivisions=subs, radius=1.0)["verts"]
        cs, sn = math.cos(rot), math.sin(rot)
        seed = Vector((rng.rand() * 50, rng.rand() * 50, rng.rand() * 50))
        for v in verts:
            q = v.co.copy()
            n = noise.fractal(q * freq + seed + off, 0.5, 2.0, 3)
            q *= 1 + amp * n
            q.z = max(q.z, -sink)
            q = Vector((q.x * size[0], q.y * size[1], q.z * size[2]))
            v.co = Vector((c[0] + q.x * cs - q.y * sn, c[1] + q.x * sn + q.y * cs, c[2] + q.z))
            t = 0.5 + 0.5 * noise.noise(q * freq * 2.3 + seed)
            v[lay] = _lin(col_a, col_b, t)
            v[lay_r] = rough_val
            v[lay_g] = 0.0

    stone_a, stone_b = srgb("#1a1e2b"), srgb("#363f54")
    moss_a, moss_b = srgb("#13241a"), srgb("#33512a")  # (blobs use the same moss tones)
    # rubble: broken pieces that fell off the stone
    for _ in range(11):
        s_ = 0.06 + 0.24 * rng.rand() ** 2
        x_ = rng.uniform(-2.5, 2.5)
        y_ = rng.choice([-1, 1]) * rng.uniform(0.5, 1.1) if abs(x_) < 1.85 else rng.uniform(-0.9, 0.9)
        size = (s_ * (1 + 0.6 * rng.rand()), s_ * (1 + 0.4 * rng.rand()), s_ * (0.5 + 0.4 * rng.rand()))
        blob((x_, y_, size[2] * 0.25), size, rng.uniform(0, 3.14), stone_a, stone_b, 1.6, 0.28, blob_subs[0], 0.4, 0.82)
    # moss clumps hugging the base: lumpy cushions, several per spot
    for _ in range(10):
        cx0 = rng.uniform(-2.0, 2.0)
        cy0 = rng.choice([-1, 1]) * rng.uniform(0.30, 0.50)
        for _k in range(rng.randint(2, 5)):
            sx, sy, sz = rng.uniform(0.07, 0.22), rng.uniform(0.06, 0.14), rng.uniform(0.05, 0.13)
            blob((cx0 + rng.normal(0, 0.14), cy0 + rng.normal(0, 0.05), sz * 0.15), (sx, sy, sz),
                 rng.uniform(0, 3.14), moss_a, moss_b, 5.0, 0.55, blob_subs[1], 0.25, 0.97)

    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    me.update()


def make_debris(seed=1, name="Debris", blob_subs=(2, 3)):
    """Rubble + moss clumps as their own vertex-coloured mesh around the stone's foot."""
    rng = np.random.RandomState(seed + 1000)
    off = Vector((seed * 17.3, seed * 5.1, seed * 9.7))
    me = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    _add_base_details(obj, rng, off, blob_subs)
    return obj


def box_uv(mesh):
    """Clean box-projected UV atlas (front gets the lion's share of the texels).

    Smart UV Project shreds a noisy sculpted surface into thousands of islands; projecting
    by position onto the stone's own box keeps big contiguous islands.
    """
    uv = mesh.uv_layers.new(name="UVMap")
    S = 0.15   # u/v per metre
    verts = mesh.vertices
    for poly in mesh.polygons:
        c = poly.center
        hw = (W0 + (W1 - W0) * min(max(c.z / H, 0), 1)) / 2
        rx = abs(c.x - 0.05) / (hw + 0.02)
        ry = abs(c.y) / (D / 2 + 0.03)
        rt = max(0.0, (c.z - (H - 0.9)) / 0.9)
        rb = max(0.0, (0.35 - c.z) / 0.35) * 2
        m = max(rx, ry, rt, rb)
        if m == rb:
            region = "bottom"
        elif m == rt:
            region = "top"
        elif m == ry:
            region = "front" if c.y < 0 else "back"
        else:
            region = "left" if c.x < 0.05 else "right"
        # steep facets (chips, bevels) would smear across the wrong plane: follow the normal instead
        n = poly.normal
        axis = {"front": 1, "back": 1, "left": 0, "right": 0, "top": 2, "bottom": 2}[region]
        if abs(n[axis]) < 0.5:
            ax = max(range(3), key=lambda i: abs(n[i]))
            if ax == 1:
                region = "front" if n.y < 0 else "back"
            elif ax == 0:
                region = "left" if n.x < 0 else "right"
            else:
                region = "top" if n.z > 0 else "bottom"
        for li in poly.loop_indices:
            v = verts[mesh.loops[li].vertex_index].co
            if region == "front":
                u_, w_ = 0.005 + (v.x + 2.0) * S, 0.005 + v.z * S
            elif region == "top":
                u_, w_ = 0.005 + (v.x + 2.0) * S, 0.848 + (v.y + 0.5) * S
            elif region == "left":
                u_, w_ = 0.62 + (v.y + 0.5) * S, 0.005 + v.z * S
            elif region == "right":
                u_, w_ = 0.775 + (v.y + 0.5) * S, 0.005 + v.z * S
            elif region == "back":
                u_, w_ = 0.885 + (v.x + 2.0) * 0.028, 0.005 + v.z * 0.028
            else:  # bottom (buried)
                u_, w_ = 0.885 + (v.x + 2.0) * 0.028, 0.25 + (v.y + 0.5) * 0.028
            uv.data[li].uv = (u_, w_)


def build(seed=1, name="RuneStone", voxel=0.03, target_tris=75000, blob_subs=(2, 3), base_details=True):
    rng = np.random.RandomState(seed)
    off = Vector((seed * 17.3, seed * 5.1, seed * 9.7))

    for o in list(bpy.data.objects):
        if o.name.startswith(name):
            bpy.data.objects.remove(o, do_unlink=True)

    # ---- 1. blocked-out silhouette -------------------------------------------------
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=14, use_grid_fill=True)
    slant = 0.25 + 0.15 * rng.rand()
    lean = (rng.rand() - 0.5) * 0.3
    for v in bm.verts:
        t = v.co.z + 0.5
        hw = (W0 + (W1 - W0) * t) / 2
        x, y, z = v.co.x * 2 * hw, v.co.y * D, t * H
        xn = x / hw
        x += lean * math.sin(t * math.pi * 0.9)
        w = t ** 7
        z -= w * (slant * max(0.0, xn + 0.15) + 0.14 * noise.noise(Vector((x * 1.3, 3.1, 0)) + off))
        p = Vector((x * 0.7, y * 0.7, z * 0.7)) + off
        x += 0.05 * noise.noise(p + Vector((10, 0, 0)))
        y += 0.03 * noise.noise(p + Vector((0, 20, 0)))
        z += 0.04 * noise.noise(p + Vector((0, 0, 30)))
        v.co = Vector((x, y, z))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj

    # ---- 2. even, dense topology via voxel remesh ----------------------------------
    mod = obj.modifiers.new("Remesh", 'REMESH')
    mod.mode = 'VOXEL'
    mod.voxel_size = voxel
    dg = bpy.context.evaluated_depsgraph_get()
    new_me = bpy.data.meshes.new_from_object(obj.evaluated_get(dg))
    obj.modifiers.remove(mod)
    old = obj.data
    obj.data = new_me
    bpy.data.meshes.remove(old)
    me = new_me
    me.name = name
    for p in me.polygons:
        p.use_smooth = True
    me.update()

    N = len(me.vertices)
    co = np.empty(N * 3); me.vertices.foreach_get("co", co); co = co.reshape(N, 3)
    nr = np.empty(N * 3); me.vertex_normals.foreach_get("vector", nr); nr = nr.reshape(N, 3)
    # relax the voxel staircase so the carving sits on a clean, dressed surface
    ne0 = len(me.edges)
    ev0 = np.empty(ne0 * 2, dtype=np.int32); me.edges.foreach_get("vertices", ev0); ev0 = ev0.reshape(ne0, 2)
    cnt0 = np.bincount(ev0.ravel(), minlength=N).astype(float) + 1e-9
    for _ in range(3):
        acc = np.stack([np.bincount(ev0[:, 0], weights=co[ev0[:, 1], k], minlength=N) +
                        np.bincount(ev0[:, 1], weights=co[ev0[:, 0], k], minlength=N) for k in range(3)], axis=1)
        co = co + 0.5 * (acc / cnt0[:, None] - co)
    me.vertices.foreach_set("co", co.ravel())
    me.update()
    nr = np.empty(N * 3); me.vertex_normals.foreach_get("vector", nr); nr = nr.reshape(N, 3)
    x, y, z = co[:, 0], co[:, 1], co[:, 2]
    front = sstep(-0.35, -0.75, nr[:, 1])

    # ---- 3. weathering ---------------------------------------------------------------
    big = np.zeros(N); fine = np.zeros(N); crack = np.zeros(N); cellh = np.zeros(N); mossn = np.zeros(N)
    for i in range(N):
        p = Vector((x[i], y[i], z[i]))
        big[i] = noise.fractal(p * 0.9 + off, 0.5, 2.0, 3)
        fine[i] = noise.noise(p * 11.0 + off)
        d4, pts = noise.voronoi(p * 0.8 + off)
        crack[i] = d4[1] - d4[0]
        c = pts[0]
        cellh[i] = (math.sin(c[0] * 12.9898 + c[1] * 78.233 + c[2] * 37.719) * 43758.5453) % 1.0
        mossn[i] = noise.fractal(p * 2.2 + off + Vector((50, 0, 0)), 0.5, 2.0, 3)

    crack_m = (1 - sstep(0.0, 0.05, crack)) * sstep(0.0, 0.3, np.array([noise.noise(Vector((x[i] * .5, y[i] * .5, z[i] * .5)) + off) for i in range(N)]))

    # chips near silhouette edges: faceted, stepped bites
    hw = (W0 + (W1 - W0) * np.clip(z / H, 0, 1)) / 2
    edge = np.maximum.reduce([
        sstep(hw - 0.45, hw - 0.05, np.abs(x - 0.05)),
        sstep(H - 1.0, H - 0.1, z),
    ])
    chips = -0.07 * edge * sstep(0.55, 0.85, cellh) * (1 - front * 0.5)

    strata = 0.0025 * np.sin(z * 38 + 5.0 * big)
    r = np.hypot(x - CX, z - CZ)
    th = np.arctan2(z - CZ, x - CX)
    calm = 1 - 0.97 * (1 - sstep(R - 0.02, R + 0.18, r))   # keep the glow surface clean
    flat = 1 - 0.75 * front                              # front face is dressed, flatter
    nat = (0.03 * big + 0.002 * fine + 0.5 * strata) * flat * calm + chips - 0.012 * crack_m * calm

    # ---- 4. carving (front face) ------------------------------------------------------
    carve = np.zeros(N)
    carve += -0.095 * (1 - sstep(R - 0.035, R, r))                      # recessed medallion
    carve += 0.045 * np.exp(-((r - (R + 0.07)) / 0.05) ** 2)            # raised rim
    c0 = carve.copy()                                                   # medallion + rim only
    seg = 2 * np.pi / 16
    ang = np.abs((th % seg) - seg / 2)
    tick_r = sstep(1.33, 1.37, r) * (1 - sstep(1.50, 1.54, r))
    tick_a = 1 - sstep(0.035 / np.maximum(r, .1), 0.075 / np.maximum(r, .1), ang)
    carve += -0.05 * tick_r * tick_a                                    # notch ring
    carve += -0.03 * np.exp(-((r - 1.64) / 0.025) ** 2) * (r < 1.8)     # outer hairline
    top = _glyph_row(x, z, 4.72, 5, 0.40, 0.16, rng, 0.10)
    bot = _glyph_row(x, z, 0.62, 5, 0.40, 0.16, rng, 0.12)
    carve += _groove(top, 0.058, 0.05) + _groove(bot, 0.058, 0.05)
    for zc in (4.72, 0.62):
        for zz in (zc - 0.42, zc + 0.42):
            carve += -0.02 * np.exp(-((z - zz) / 0.018) ** 2) * (np.abs(x - 0.1) < 1.2)

    # ---- 4b. small-scale realism: pits, hairline cracks --------------------------------
    pit = np.zeros(N); pit_mask = np.zeros(N)
    for ci in rng.choice(N, 140, replace=False):
        rad = 0.012 + 0.032 * rng.rand() ** 2
        d = np.linalg.norm(co - co[ci], axis=1)
        m = d < rad
        w = 1 - (d[m] / rad) ** 2
        pit[m] += -(0.45 * rad) * w
        pit_mask[m] = np.maximum(pit_mask[m], w)
    crack_d = np.full(N, 9.0)

    def walk(px, pz, a, steps, depth):
        nonlocal crack_d
        pts = [(px, pz)]
        for _ in range(steps):
            a += rng.normal(0, 0.45)
            px += math.cos(a) * 0.11
            pz += math.sin(a) * 0.11
            pts.append((px, pz))
            if depth < 2 and rng.rand() < 0.12:
                walk(px, pz, a + rng.choice([-1, 1]) * rng.uniform(0.5, 1.2), rng.randint(3, 8), depth + 1)
        for a_, b_ in zip(pts[:-1], pts[1:]):
            crack_d = np.minimum(crack_d, _seg_dist(x, z, a_, b_))

    for _ in range(4):
        walk(rng.uniform(-1.4, 1.4), rng.uniform(0.2, 5.0), rng.uniform(0, 2 * math.pi), rng.randint(10, 22), 0)
    crack_groove = -0.010 * (1 - sstep(0.006, 0.02, crack_d))
    detail = (pit * (0.6 + 0.4 * (1 - front)) + crack_groove) * calm

    deco = carve - c0                                                   # runes, ticks, hairlines
    total = nat + carve * front + detail
    me.vertices.foreach_set("co", (co + nr * total[:, None]).ravel())
    me.update()

    # ---- 5. baked colour: stone, edge wear, cavity, moss, dark grooves ---------------
    co2 = np.empty(N * 3); me.vertices.foreach_get("co", co2); co2 = co2.reshape(N, 3)
    nr2 = np.empty(N * 3); me.vertex_normals.foreach_get("vector", nr2); nr2 = nr2.reshape(N, 3)
    ne = len(me.edges)
    ev = np.empty(ne * 2, dtype=np.int32); me.edges.foreach_get("vertices", ev); ev = ev.reshape(ne, 2)
    cnt = np.bincount(ev.ravel(), minlength=N).astype(float) + 1e-9

    def nb_mean(a):
        s = np.zeros_like(a)
        for k in range(a.shape[1] if a.ndim > 1 else 1):
            col = a[:, k] if a.ndim > 1 else a
            acc = np.bincount(ev[:, 0], weights=col[ev[:, 1]], minlength=N) + np.bincount(ev[:, 1], weights=col[ev[:, 0]], minlength=N)
            if a.ndim > 1:
                s[:, k] = acc / cnt
            else:
                s = acc / cnt
        return s

    lap = nb_mean(co2) - co2
    cav = np.einsum("ij,ij->i", lap, nr2)
    for _ in range(6):
        cav = nb_mean(cav)
    cav = np.clip(cav / 0.0035, -1, 1)           # +1 concave pit, -1 convex edge

    pal = PALETTES[(seed - 1) % len(PALETTES)]
    c_dark, c_light = srgb(pal[0]), srgb(pal[1])
    base_t = np.clip(0.40 + 0.7 * big + 0.12 * fine, 0, 1)
    col = c_dark[None] * (1 - base_t[:, None]) + c_light[None] * base_t[:, None]
    col += (np.clip(-cav, 0, 1) * 0.14)[:, None]                       # worn edges catch light
    col *= (1 - 0.5 * np.clip(cav, 0, 1))[:, None]                     # crevices darker
    moss = (0.95 * sstep(1.3, 0.0, co2[:, 2]) + 0.8 * sstep(0.3, 0.85, nr2[:, 2]) + 0.45 * np.clip(cav, 0, 1))
    moss = np.clip(moss * sstep(-0.15, 0.35, mossn) * (1 - 0.6 * front), 0, 1)
    m_dark, m_light = srgb(pal[2]), srgb(pal[3])
    mc = m_dark[None] * (1 - sstep(0.2, 0.7, mossn)[:, None]) + m_light[None] * sstep(0.2, 0.7, mossn)[:, None]
    col = col * (1 - 0.88 * moss[:, None]) + mc * (0.88 * moss[:, None])
    # ---- 5b. colour detail: grain, veins, streaks, lichen, fresh breaks, dirt ----------
    def fbm_col(fn):
        return np.array([fn(Vector((co2[i, 0], co2[i, 1], co2[i, 2]))) for i in range(N)])
    grain = fbm_col(lambda p: noise.noise(p * 40 + off))
    col *= (1 + 0.10 * grain)[:, None]
    vein_n = fbm_col(lambda p: noise.noise(Vector((p.x * 0.9, p.y * 0.9, p.z * 1.4)) + off + Vector((70, 0, 0))))
    vein = 1 - sstep(0.0, 0.02, np.abs(vein_n))
    col = col * (1 - 0.55 * vein[:, None]) + srgb("#8f9ab5")[None] * (0.55 * vein[:, None])
    streak_n = fbm_col(lambda p: noise.fractal(Vector((p.x * 7, p.y * 7, p.z * 0.45)) + off + Vector((90, 0, 0)), 0.5, 2.0, 3))
    streak = sstep(0.05, 0.35, streak_n) * sstep(5.2, 1.2, co2[:, 2])
    col *= (1 - 0.30 * streak)[:, None]
    lichen = np.zeros(N)
    for _ in range(16):
        ci = rng.randint(N)
        rad = 0.10 + 0.30 * rng.rand()
        d = np.linalg.norm(co2 - co2[ci], axis=1)
        dw = d + rad * 0.9 * mossn                       # noise-warped so patches are ragged, not discs
        patch = (1 - sstep(rad * 0.45, rad, dw)) * (0.75 + 0.25 * sstep(-0.2, 0.4, grain))
        lichen = np.maximum(lichen, patch)
    lichen *= calm
    lc = srgb("#7a866c")[None] * (1 - sstep(0.4, 0.7, mossn)[:, None]) + srgb("#8d8a62")[None] * sstep(0.4, 0.7, mossn)[:, None]
    col = col * (1 - 0.5 * lichen[:, None]) + lc * (0.5 * lichen[:, None])
    col += (sstep(-0.015, -0.07, chips) * 0.10)[:, None]               # fresh breaks are paler
    col *= (1 - 0.35 * pit_mask)[:, None]
    col *= (1 - 0.6 * (1 - sstep(0.006, 0.02, crack_d)))[:, None]      # hairline cracks
    dirt = sstep(0.55, 0.0, co2[:, 2])
    col = col * (1 - 0.6 * dirt[:, None]) + srgb("#2b2218")[None] * (0.6 * dirt[:, None])
    cv = carve * front
    col *= (1 - 0.55 * sstep(-0.012, -0.045, cv))[:, None]              # grooves
    col = col * (1 - 0.8 * sstep(-0.06, -0.09, cv)[:, None]) + srgb("#05070d")[None] * (0.8 * sstep(-0.06, -0.09, cv)[:, None])  # recess floor
    # warm iron stains in the streaks
    stain = 0.14 * streak * (1 - sstep(-0.05, -0.085, cv))     # not on the dark medallion
    col = col * (1 - stain[:, None]) + srgb("#6a4a2a")[None] * stain[:, None]
    floor_m = sstep(-0.06, -0.09, cv)
    rough = (0.80 + 0.10 * grain
             - 0.20 * np.clip(-cav, 0, 1)             # worn edges are polished
             + 0.10 * np.clip(cav, 0, 1)
             - 0.15 * streak                           # wet-looking streaks
             - 0.30 * vein)                            # quartz veins are glossy
    rough = rough * (1 - 0.9 * lichen) + 0.92 * 0.9 * lichen
    rough = rough * (1 - 0.8 * moss) + 0.96 * 0.8 * moss
    rough = rough * (1 - floor_m) + 0.42 * floor_m   # dark polished medallion
    rough = np.where(sstep(-0.012, -0.045, cv) > 0.5, np.maximum(rough, 0.93), rough)  # grooves
    rough = np.clip(rough, 0.3, 1.0)
    glow = sstep(0.018, 0.045, -(deco * front))

    rgba = np.concatenate([np.clip(col, 0, 1), np.ones((N, 1))], axis=1)
    ca = me.color_attributes.new("Col", 'FLOAT_COLOR', 'POINT')
    ca.data.foreach_set("color", rgba.ravel())
    me.color_attributes.active_color = ca
    me.color_attributes.render_color_index = 0
    for nm, arr in (("Rough", rough), ("Glow", glow)):
        a = me.attributes.new(nm, 'FLOAT', 'POINT')
        a.data.foreach_set("value", arr.astype(np.float32))

    # ---- 6. material -----------------------------------------------------------------
    mat = bpy.data.materials.get(name + "_Mat") or bpy.data.materials.new(name + "_Mat")
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    attr = nt.nodes.new("ShaderNodeVertexColor")
    attr.layer_name = "Col"
    bsdf.inputs["Roughness"].default_value = 0.88
    nt.links.new(attr.outputs["Color"], bsdf.inputs["Base Color"])
    ar = nt.nodes.new("ShaderNodeAttribute"); ar.attribute_name = "Rough"
    ag = nt.nodes.new("ShaderNodeAttribute"); ag.attribute_name = "Glow"
    nt.links.new(ar.outputs["Fac"], bsdf.inputs["Roughness"])
    bsdf.inputs["Emission Color"].default_value = (0.30, 0.85, 1.0, 1.0)
    nt.links.new(ag.outputs["Fac"], bsdf.inputs["Emission Strength"])
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    me.materials.clear()
    me.materials.append(mat)

    # ---- 7. reduce triangle count for the web ----------------------------------------
    tris = sum(len(p.vertices) - 2 for p in me.polygons)
    if target_tris and tris > target_tris:
        dec = obj.modifiers.new("Decimate", 'DECIMATE')
        dec.ratio = target_tris / tris
        dg = bpy.context.evaluated_depsgraph_get()
        low = bpy.data.meshes.new_from_object(obj.evaluated_get(dg))
        obj.modifiers.remove(dec)
        old = obj.data
        obj.data = low
        bpy.data.meshes.remove(old)
        low.name = name
        for p in low.polygons:
            p.use_smooth = True
        if not low.materials:
            low.materials.append(mat)
    if base_details:
        _add_base_details(obj, rng, off, blob_subs)
    obj.select_set(True)
    print(name, "verts", len(obj.data.vertices), "tris", sum(len(p.vertices) - 2 for p in obj.data.polygons),
          "dims", tuple(round(d, 2) for d in obj.dimensions))
    return obj
