# 3D pipeline (Blender 5.2, background)

Sources are only read: the scripts never save a `.blend`. Output goes only to `public/models`,
`public/models/pet-parts`, `public/posters`, `src/content/models.json`, `src/content/pet-parts.json`.

```powershell
$B = "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"
& $B -b --python tools/3d/export_showroom.py -- all              # every model + pet parts
& $B -b --python tools/3d/export_showroom.py -- dragon gold-axe  # selected model ids
& $B -b --python tools/3d/export_showroom.py -- parts            # pet parts only
& $B -b --python tools/3d/verify_glb.py                          # re-import checks + pet assembly renders
```

ffmpeg must be on PATH, because the posters are converted to webp with libwebp.

## What export_showroom.py does
1. Opens the source: a `.blend` (collection / name prefix / pet assembled by `manifest.json` sockets) or an imported `.fbx`.
2. Bakes the transforms. Roblox-derived Pets sources face +Y in Blender and get rotated 180 degrees, so every GLB faces +Z (glTF).
3. Drops the magenta `Marker` meshes, which are Roblox attachment helpers inside the Woodcutter FBX files.
4. Clips stray vertices only where a model opts in with `outliers=True` (`zombieBruteOutfit.fbx` has leg vertices at y=-180).
5. Decimates (Collapse) only when the model has more than 25k triangles and a `target` is set. Pieces under 1500 triangles (eyes, teeth) are left alone.
6. Joins everything into one mesh, scales it to 1 m height (capped at 2 m on the widest side) and puts the base centre at the origin.
7. Exports a GLB with no Draco, no textures, vertex colours as `COLOR_0` and PBR material factors. three.js `GLTFLoader` picks up `COLOR_0` by itself.
8. Renders a 1024x1024 EEVEE poster on a transparent background and saves it as webp at 150 KB or less.

## Pet parts (`src/content/pet-parts.json`)
- glTF space: metres, +Y up, the pet faces +Z, ground at y=0. `scale` = metres per Roblox stud. The all-AIR pet is 1 m tall.
- A part GLB has its origin at its pivot. Place it at `socket`.
- An accessory goes at `part.socket + part.accessoryAnchors[0]` of the HEAD part.
- The sockets come from `питомцы/blender/manifest.json` and use the same math as `build_all.assemble()`. `verify_glb.py` checks that the all-AIR pet assembled from the parts matches `pet-cotton-cloud.glb`.

## Adding a model
Add a dict to `MODELS` in `export_showroom.py` (fields: id, project, kind, src, title, desc, plus optional target / rot / view / outliers), run it with that id, then run `verify_glb.py`.

Hero poster (`public/posters/hero-scene.webp`, fallback of `src/components/three/HeroScene.tsx`):

```powershell
& $B -b --factory-startup --python tools/3d/hero_poster.py -- "$PWD" hero.png   # then PIL: save as WEBP q82
```
