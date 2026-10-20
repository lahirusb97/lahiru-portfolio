"""Turn the raw Blender bakes into web textures (run with system python + Pillow).

    python3 blender/pack_textures.py a b c

Outputs per stone in public/models/:
  runestone_<tag>_color.jpg   sRGB base colour
  runestone_<tag>_normal.jpg  tangent-space normal (glTF / OpenGL convention)
  runestone_<tag>_orm.jpg     R = ambient occlusion, G = roughness, B = rune glow mask
"""
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
TMP = os.path.join(HERE, "_bake")
PUB = os.path.join(os.path.dirname(HERE), "public", "models")

for tag in sys.argv[1:]:
    t = tag.lower()
    load = lambda n: Image.open(os.path.join(TMP, f"{t}_{n}.png")).convert("RGB")
    color, normal = load("color"), load("normal")
    ao = load("ao").split()[0]
    rough = load("rough").split()[0]
    glow = load("emit").split()[2]  # emission colour is cyan, so blue carries the mask

    orm = Image.merge("RGB", (ao, rough, glow))
    # 4:4:4 JPEG so packed channels do not bleed into each other
    color.save(os.path.join(PUB, f"runestone_{t}_color.jpg"), quality=90, subsampling=0, optimize=True)
    normal.save(os.path.join(PUB, f"runestone_{t}_normal.jpg"), quality=93, subsampling=0, optimize=True)
    orm.save(os.path.join(PUB, f"runestone_{t}_orm.jpg"), quality=93, subsampling=0, optimize=True)
    for n in ("color", "normal", "orm"):
        f = os.path.join(PUB, f"runestone_{t}_{n}.jpg")
        print(f, os.path.getsize(f))
