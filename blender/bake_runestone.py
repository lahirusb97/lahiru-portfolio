"""High-poly -> low-poly PBR bake for the runestones (headless Blender).

    blender -b --factory-startup --python blender/bake_runestone.py -- <seed> <tag>

1. Builds the detailed high-poly stone (runestone.py).
2. Decimates a ~100k tri game-ready copy and UV-unwraps it.
3. Bakes tangent-space normal, colour, roughness, ambient occlusion and the rune glow mask.
4. Exports the low-poly mesh (UVs + tangents, no material) as GLB.
Raw PNG bakes land in blender/_bake/; pack_textures.py turns them into web textures.
"""
import bpy, sys, os, math

HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, "runestone.py")).read())

TMP = os.path.join(HERE, "_bake")
PUB = os.path.join(os.path.dirname(HERE), "public", "models")
os.makedirs(TMP, exist_ok=True)
os.makedirs(PUB, exist_ok=True)


def evaluated_copy(obj, ratio):
    mod = obj.modifiers.new("Decimate", 'DECIMATE')
    mod.ratio = ratio
    dg = bpy.context.evaluated_depsgraph_get()
    mesh = bpy.data.meshes.new_from_object(obj.evaluated_get(dg))
    obj.modifiers.remove(mod)
    return mesh


def bake_stone(seed, tag, res=2048, low_tris=100000, voxel=0.01):
    scene = bpy.context.scene
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.use_denoising = False
    scene.view_settings.view_transform = 'Standard'
    if scene.world is None:
        scene.world = bpy.data.worlds.new("World")

    print(f"[{tag}] building high-poly ...", flush=True)
    hi = build(seed=seed, name="Hi_" + tag, voxel=voxel, target_tris=0, base_details=False)
    hi_tris = sum(len(p.vertices) - 2 for p in hi.data.polygons)

    print(f"[{tag}] decimating {hi_tris} -> {low_tris} tris ...", flush=True)
    lo_mesh = evaluated_copy(hi, low_tris / hi_tris)
    lo_mesh.name = "Lo_" + tag
    lo = bpy.data.objects.new("Lo_" + tag, lo_mesh)
    scene.collection.objects.link(lo)
    for p in lo_mesh.polygons:
        p.use_smooth = True

    print(f"[{tag}] UV box-projection ...", flush=True)
    box_uv(lo_mesh)

    # target material with an image node to receive each bake
    mat = bpy.data.materials.new("Bake_" + tag)
    mat.use_nodes = True
    node = mat.node_tree.nodes.new("ShaderNodeTexImage")
    lo_mesh.materials.clear()
    lo_mesh.materials.append(mat)

    b = scene.render.bake
    b.use_selected_to_active = True
    b.cage_extrusion = 0.06
    b.max_ray_distance = 0.0
    b.margin = 6
    b.margin_type = 'EXTEND'
    b.normal_space = 'TANGENT'
    b.use_pass_direct = False
    b.use_pass_indirect = False
    b.use_pass_color = True
    scene.world.light_settings.distance = 0.7

    def run(kind, suffix, colorspace, samples):
        img = bpy.data.images.new(f"{tag}_{suffix}", res, res, alpha=False)
        img.colorspace_settings.name = colorspace
        node.image = img
        mat.node_tree.nodes.active = node
        scene.cycles.samples = samples
        for o in bpy.context.view_layer.objects:
            o.select_set(False)
        hi.select_set(True)
        lo.select_set(True)
        bpy.context.view_layer.objects.active = lo
        print(f"[{tag}] baking {kind} ...", flush=True)
        bpy.ops.object.bake(type=kind)
        img.filepath_raw = os.path.join(TMP, f"{tag.lower()}_{suffix}.png")
        img.file_format = 'PNG'
        img.save()

    run('NORMAL', 'normal', 'Non-Color', 1)
    run('DIFFUSE', 'color', 'sRGB', 1)
    run('ROUGHNESS', 'rough', 'Non-Color', 1)
    run('EMIT', 'emit', 'Non-Color', 1)
    run('AO', 'ao', 'Non-Color', 48)

    # export: textured stone ("Stone") + vertex-coloured moss/rubble ("Debris")
    for nm in ("Col", "Rough", "Glow"):
        if nm in lo_mesh.attributes:
            lo_mesh.attributes.remove(lo_mesh.attributes[nm])
    lo.name = "Stone"
    debris = make_debris(seed, name="Debris")
    for nm in ("Rough", "Glow"):
        if nm in debris.data.attributes:
            debris.data.attributes.remove(debris.data.attributes[nm])
    for o in bpy.context.view_layer.objects:
        o.select_set(False)
    lo.select_set(True)
    debris.select_set(True)
    bpy.context.view_layer.objects.active = lo
    lo_mesh.materials.clear()
    out = os.path.join(PUB, f"runestone_{tag.lower()}.glb")
    bpy.ops.export_scene.gltf(
        filepath=out, export_format='GLB', use_selection=True, export_apply=True,
        export_yup=True, export_normals=True, export_tangents=True, export_texcoords=True,
        export_materials='NONE', export_vertex_color='ACTIVE',
    )
    print(f"[{tag}] done: {out} ({os.path.getsize(out)} bytes)", flush=True)


if "--" in sys.argv:
    a = sys.argv[sys.argv.index("--") + 1:]
    bake_stone(int(a[0]), a[1], res=int(a[2]) if len(a) > 2 else 2048)
