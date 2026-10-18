"""Re-import every exported GLB and check it; assemble pets from pet-parts.json and render them.

  blender -b --python tools/3d/verify_glb.py

Checks (non-zero exit on failure): showroom models are 1 m tall (or 2 m on the widest side), stand on y=0,
are centred, have materials; an all-AIR pet assembled from the parts matches pet-cotton-cloud.glb in size.
Renders go to %TEMP%/showroom_verify/*.png (front view = looking along -Z of glTF, i.e. at the model's face).
"""
import glob
import json
import math
import os
import sys
import tempfile

import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.normpath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(tempfile.gettempdir(), "showroom_verify")
fails = []


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def load(path, loc=(0, 0, 0)):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    for o in new:
        if o.parent is None:
            o.location = Vector(o.location) + Vector(loc)
    bpy.context.view_layer.update()
    return [o for o in new if o.type == "MESH"]


def bounds(objs):
    ps = [o.matrix_world @ v.co for o in objs for v in o.data.vertices]
    lo = Vector([min(p[i] for p in ps) for i in range(3)])
    hi = Vector([max(p[i] for p in ps) for i in range(3)])
    return lo, hi


def gltf_to_bl(v):
    return Vector((v[0], -v[2], v[1]))


def render(objs, path, direction=(0.0, -1.0, 0.25)):
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = scene.render.resolution_y = 640
    scene.render.film_transparent = False
    w = bpy.data.worlds.new("W")
    w.use_nodes = True
    next(n for n in w.node_tree.nodes if n.type == "BACKGROUND").inputs["Color"].default_value = (0.6, 0.6, 0.65, 1)
    scene.world = w
    sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
    sun.data.energy = 3
    sun.rotation_euler = (0.8, 0.2, 0.4)
    scene.collection.objects.link(sun)
    lo, hi = bounds(objs)
    c, r = (lo + hi) / 2, (hi - lo).length / 2
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    scene.collection.objects.link(cam)
    d = Vector(direction).normalized()
    cam.location = c + d * (r / math.sin(math.atan(18 / 50)) * 1.05)
    cam.rotation_euler = (-d).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def check(cond, msg):
    if not cond:
        fails.append(msg)
        print("@@ FAIL", msg)


os.makedirs(OUT, exist_ok=True)
with open(os.path.join(SITE, "src", "content", "models.json"), encoding="utf-8") as fh:
    models = json.load(fh)
for m in models:
    path = os.path.join(SITE, "public", m["file"].lstrip("/"))
    reset()
    objs = load(path)
    lo, hi = bounds(objs)
    size = hi - lo
    t = sum(len(p.vertices) - 2 for o in objs for p in o.data.polygons)
    mats = {s.material.name for o in objs for s in o.material_slots if s.material}
    vcol = any(o.data.color_attributes for o in objs)
    print("@@ GLB %-22s tris=%6d size(x,depth,h)=(%.2f, %.2f, %.2f) minZ=%.3f centre=(%.3f, %.3f) mats=%d vcol=%s %.0fKB"
          % (m["id"], t, size.x, size.y, size.z, lo.z, (lo.x + hi.x) / 2, (lo.y + hi.y) / 2, len(mats), vcol,
             os.path.getsize(path) / 1024))
    check(abs(size.z - 1) < 0.01 or abs(max(size.x, size.y) - 2) < 0.01, m["id"] + ": not normalised")
    check(abs(lo.z) < 0.005, m["id"] + ": not on the ground")
    check(abs(lo.x + hi.x) < 0.01 and abs(lo.y + hi.y) < 0.01, m["id"] + ": not centred")
    check(len(mats) > 0, m["id"] + ": no materials")
    check(t == m["triangles"], m["id"] + ": triangle count differs from models.json")
    check(os.path.getsize(path) <= 2.5 * 1024 * 1024, m["id"] + ": over 2.5 MB")

with open(os.path.join(SITE, "src", "content", "pet-parts.json"), encoding="utf-8") as fh:
    pp = json.load(fh)
parts = {(p["element"], p["slot"]): p for p in pp["parts"]}
combos = {
    "AIR": {s: "AIR" for s in ("BODY", "HEAD", "FRONT_PAWS", "HIND_PAWS", "TAIL", "BACK")},
    "MIX": {"BODY": "FIRE", "HEAD": "WATER", "FRONT_PAWS": "FIRE", "HIND_PAWS": "AIR", "TAIL": "WATER", "BACK": "AIR"},
    "WATER_ACC": {s: "WATER" for s in ("BODY", "HEAD", "FRONT_PAWS", "HIND_PAWS", "TAIL", "BACK")},
}
for name, combo in combos.items():
    reset()
    objs = []
    for slot, el in combo.items():
        p = parts[(el, slot)]
        objs += load(os.path.join(SITE, "public", p["file"].lstrip("/")), gltf_to_bl(p["socket"]))
    if name == "WATER_ACC":
        head = parts[("WATER", "HEAD")]
        acc = pp["accessories"][-1]
        pos = [a + b for a, b in zip(head["socket"], head["accessoryAnchors"][0])]
        objs += load(os.path.join(SITE, "public", acc["file"].lstrip("/")), gltf_to_bl(pos))
    lo, hi = bounds(objs)
    print("@@ PET %-9s size=(%.3f, %.3f, %.3f) minZ=%.3f" % (name, *(hi - lo), lo.z))
    if name == "AIR":
        check(abs((hi - lo).z - 1) < 0.01 and abs(lo.z) < 0.01, "AIR pet from parts: not 1 m / not on ground")
        air_size = hi - lo
    render(objs, os.path.join(OUT, "pet_%s_front.png" % name))
    render(objs, os.path.join(OUT, "pet_%s_side.png" % name), (1.0, -0.6, 0.3))

reset()
ref = load(os.path.join(SITE, "public", "models", "pet-cotton-cloud.glb"))
rlo, rhi = bounds(ref)
check((air_size - (rhi - rlo)).length < 0.01, "AIR pet from parts differs from pet-cotton-cloud.glb")
print("@@ RESULT", "OK" if not fails else "FAILED: %d" % len(fails))
sys.exit(1 if fails else 0)
