# Headless: blender -b --factory-startup --python hero_poster.py -- <site root> <out.png>
# Renders public/posters/hero-scene.webp source PNG (convert: PIL .save(..., "WEBP", quality=82)). Mirrors ITEMS in src/components/three/HeroScene.tsx.
import bpy, math, sys
root, out = sys.argv[sys.argv.index("--") + 1:]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
FIT = 0.685  # same fit HeroScene computes for the portrait hero slot (aspect ~0.715)
# (url, three.js at, scale, yaw) — mirrors ITEMS in HeroScene.tsx
items = [
    ("models/pet-cotton-cloud.glb", (-1.55, 0.15, 0), 1.25, 0.5),
    ("models/robot-passenger.glb", (1.6, 0.55, -0.6), 1.0, -0.5),
    ("models/sleepy-monster.glb", (0.85, -1.05, 0.5), 0.85, 0.3),
    ("models/pet-parts/acc-head-legendary.glb", (-0.45, 1.25, -0.9), 5.0, 0.6),
]
for url, (x, y, z), s, yaw in items:
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=f"{root}/public/{url}")
    new = [o for o in bpy.data.objects if o not in before]
    pivot = bpy.data.objects.new("pivot", None); sc.collection.objects.link(pivot)
    bpy.context.view_layer.update()
    from mathutils import Vector
    pts = [o.matrix_world @ Vector(c) for o in new if o.type == "MESH" for c in o.bound_box]
    lo = Vector(map(min, zip(*pts))); hi = Vector(map(max, zip(*pts))); ctr = (lo + hi) / 2
    for o in new:
        if o.parent is None: o.parent = pivot; o.location -= ctr
    pivot.scale = (s * FIT,) * 3
    pivot.rotation_euler = (0, 0, yaw)
    pivot.location = (x * FIT, -z * FIT, y * FIT)  # three Y-up -> Blender Z-up

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam)
cam.location = (0, -7, 0); cam.rotation_euler = (math.pi / 2, 0, 0)
cam.data.sensor_fit = "VERTICAL"; cam.data.angle = math.radians(35); sc.camera = cam
def light(kind, loc, energy, color=(1, 1, 1), size=3):
    l = bpy.data.objects.new(kind, bpy.data.lights.new(kind, kind)); sc.collection.objects.link(l)
    l.location = loc; l.data.energy = energy; l.data.color = color
    if kind == "AREA": l.data.size = size
    d = l.constraints.new("TRACK_TO"); tgt = bpy.data.objects.get("origin") or bpy.data.objects.new("origin", None)
    if tgt.name not in sc.collection.objects: sc.collection.objects.link(tgt)
    d.target = tgt; d.track_axis = "TRACK_NEGATIVE_Z"; d.up_axis = "UP_Y"
light("AREA", (3, -4, 5), 900)
light("AREA", (-4, -2, 1), 300, (0.9, 0.9, 1))
light("AREA", (4, 3, 1), 350, (1, 0.48, 0.72))
light("AREA", (-2, 4, 2), 250, (0.62, 0.55, 1))
w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
bg = next(n for n in w.node_tree.nodes if n.type == "BACKGROUND"); bg.inputs[0].default_value = (0.05, 0.05, 0.06, 1); bg.inputs[1].default_value = 0.6
r = sc.render; r.engine = "BLENDER_EEVEE"; r.film_transparent = True
r.resolution_x, r.resolution_y = 1080, 1510
r.image_settings.file_format = "PNG"; r.image_settings.color_mode = "RGBA"
try: sc.view_settings.view_transform = "AgX"
except TypeError: pass
r.filepath = out
bpy.ops.render.render(write_still=True)
print("WROTE", out)
