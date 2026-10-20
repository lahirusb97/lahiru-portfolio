"""Combine a Mixamo character FBX and animation FBXs into one animated GLB (headless Blender).

    blender -b --factory-startup --python blender/convert_mixamo.py -- \
        <character.fbx> <out.glb> Walk=<walking.fbx> Run=<running.fbx> [Idle=<idle.fbx>] [tex=1024]

Each animation FBX is imported, its action is renamed and parked on an NLA track of the
character's armature, then the helper armatures are deleted and everything is exported.
"""
import bpy, sys, os

argv = sys.argv[sys.argv.index("--") + 1:]
char_fbx, out_glb = argv[0], argv[1]
anims, tex_size = [], 1024
for a in argv[2:]:
    k, v = a.split("=", 1)
    if k == "tex":
        tex_size = int(v)
    else:
        anims.append((k, v))

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)

bpy.ops.import_scene.fbx(filepath=char_fbx)
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
print("CHAR armature", arm.name, "scale", tuple(arm.scale), "meshes", [m.name for m in meshes])
for m in meshes:
    print("  mesh", m.name, "dims", tuple(round(d, 3) for d in m.dimensions), "tris", sum(len(p.vertices) - 2 for p in m.data.polygons))
print("  bones", len(arm.data.bones), [b.name for b in arm.data.bones][:6])

# drop any action that came with the character itself
if arm.animation_data:
    arm.animation_data.action = None
arm.animation_data_create()

for name, path in anims:
    before_objs = set(bpy.data.objects)
    before_acts = set(bpy.data.actions)
    bpy.ops.import_scene.fbx(filepath=path)
    new_acts = [a for a in bpy.data.actions if a not in before_acts]
    if not new_acts:
        print("!! no action found in", path)
        continue
    act = new_acts[0]
    act.name = name
    act.use_fake_user = True
    track = arm.animation_data.nla_tracks.new()
    track.name = name
    strip = track.strips.new(name, int(act.frame_range[0]), act)
    strip.name = name
    print("ANIM", name, "frames", tuple(act.frame_range), "fcurves", len(list(act.fcurves)) if hasattr(act, "fcurves") else "n/a")
    for o in [o for o in bpy.data.objects if o not in before_objs]:
        bpy.data.objects.remove(o, do_unlink=True)

# shrink textures for the web
for img in bpy.data.images:
    if img.size[0] > tex_size and img.users:
        try:
            img.scale(tex_size, tex_size)
        except Exception as e:
            print("scale fail", img.name, e)
print("IMAGES", [(i.name, tuple(i.size)) for i in bpy.data.images])

# select character + meshes only and export
for o in bpy.data.objects:
    o.select_set(False)
arm.select_set(True)
for m in meshes:
    m.select_set(True)
bpy.context.view_layer.objects.active = arm

props = bpy.ops.export_scene.gltf.get_rna_type().properties
modes = [i.identifier for i in props["export_animation_mode"].enum_items]
print("export_animation_mode options", modes)
bpy.ops.export_scene.gltf(
    filepath=out_glb, export_format='GLB', use_selection=True, export_apply=False,
    export_animations=True, export_animation_mode='NLA_TRACKS' if 'NLA_TRACKS' in modes else modes[0],
    export_yup=True, export_image_format='AUTO',
)
print("DONE", out_glb, os.path.getsize(out_glb))
