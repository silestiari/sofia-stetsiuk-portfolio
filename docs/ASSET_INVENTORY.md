# Инвентаризация 3D-ассетов для 3D Showroom

Дата: 2026-10-18. Этап: только поиск и оценка, ничего не конвертировалось и не изменялось.
Геометрия проверена read-only через Blender CLI (`blender -b <file> --python probe.py`, без сохранения).

## Инструменты

| Инструмент | Статус |
|---|---|
| Blender CLI | Есть: `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe` (в PATH нет, вызывать по полному пути) |
| MCP blender | Подключён, addon 1.8, Blender 5.2.2 LTS, протокол актуален. Библиотеки (Poly Haven/Sketchfab/Poly Pizza) и генераторы выключены — не нужны |
| glTF экспорт | Встроенный в Blender (`bpy.ops.export_scene.gltf`), Draco доступен в экспортере |

## Проверенные пути

| Путь | Результат |
|---|---|
| `C:\Users\tolik\Documents\питомцы` | Проверен. Основной источник (blender/) |
| `C:\Users\tolik\Documents\CabinChaos-Codex-Starter` | Проверен (вложенная папка `CabinChaos-Codex-Starter\CabinChaos-Codex-Starter\assets`) |
| `C:\Users\tolik\Documents\PILLARS` | Проверен. 3D-моделей нет |
| `C:\Users\tolik\Documents\woodcutter` | Проверен (`woodcutter\woodcutter\blender`) |
| `C:\Users\tolik\Documents\лесоруб против зомби.rbxl` | Есть, 98 КБ, бинарный Roblox (`<roblox!`) |
| `C:\Users\tolik\Documents\metrocity`, `sakhli` | Проверены. 3D-файлов нет (только скрипты skills) |

Недоступных путей нет. Исключены: node_modules, .git, .next, .venv, .uv-cache, __pycache__, .claude, .agents.

## Сводная таблица

Оценка привлекательности: 1–5 (для шоурума). Все модели без текстур: цвет — материалы или vertex colors, поэтому GLB будет лёгким.

### Build Your Pet / PetForge (`питомцы\blender`)

| Файл | Что это | Размер | Формат | Экспорт в GLB | Оценка |
|---|---|---|---|---|---|
| `assets\petforge_parts_v2.blend` | Все части питомцев v2: 6 стихий (AIR, FIRE, STONE, WATER, WOOD) x 6 слотов (HEAD, BODY, FRONT_PAWS, HIND_PAWS, TAIL, BACK) + 36 орнаментов по редкостям. 67 мешей, 98.5k tris, vertex colors | 2.2 МБ | .blend | Да: Blender CLI, сборка питомца функцией `assemble()` из `generators\build_all.py` по `manifest.json` (сокеты), затем gltf | 5 |
| `assets\petforge_parts.blend` | Части v1 (старее) | 0.4 МБ | .blend | Да, но v2 лучше | 2 |
| `assets\petforge_world.blend` | Мир лобби: 404 меша, 1.25M tris, vertex colors | 17.8 МБ | .blend | Только по объектам (целиком слишком тяжело) | 4 |
| `exports\*.fbx / *.obj` (67+66) | Экспорт частей и орнаментов, ~2400 tris на часть | 20–300 КБ | .fbx/.obj | Да (лучше из .blend — сохранятся vertex colors) | 4 |
| `exports\PetAssets_ALL.fbx` | Все части одним файлом | 2.7 МБ | .fbx | Да | 3 |
| `exports\world\*.fbx` (406) | Объекты мира по кускам (`<ASSET>__<piece>`): деревья, порталы, замки, магазины | 15–250 КБ | .fbx | Да, собрать куски в один GLB | 4 |
| `exports\world\WorldAssets_ALL.fbx` | Весь мир | 22.2 МБ | .fbx | Не для веба | 2 |
| `generators\*.py`, `generators\world\*.py`, `scripts\generate_assets.py` | Процедурные генераторы частей и мира (pf_lib, bk_lib, vx_lib, t_*, w_*) + рендер (pf_render, bk_render) | 3–45 КБ | .py | Источник: можно перегенерировать | — |
| `previews\v2\pets\*.png` (22), `previews\v2\ALL_PETS.png`, `RARITY_LINEUP.png`, `previews\world\*_beauty.png` | Готовые рендеры питомцев и объектов мира | 0.3–1.5 МБ | .png | Годятся как постеры/фолбэк после конвертации в webp | 5 |
| `manifest.json`, `world_manifest.json` | Метаданные: bbox, tris, сокеты, палитры, анимации (`anim: wing_flap`) | — | .json | Метаданные для src/content/models | — |

Ключевые объекты мира (tris суммарно): W_CLOUD_GARDENS_CASTLE 35.6k, W_MUSHROOM_MAZE_HOUSE 35.6k, W_STARFALL_SCOOP_OBSERVATORY 29.8k, W_HIDDEN_MEADOW_WINDMILL 29.5k, W_BUBBLE_LAGOON_LIGHTHOUSE 23.4k, W_TREASURE_TRAIL_BLITZ_SHIP 22.0k, TREE_FAIRY_L 13.5k, TREE_BLOSSOM_L 13.8k, TREE_CRYSTAL_L 13.2k, PORTAL_CLOUD_GARDENS 11.2k.

### Cabin Chaos (`CabinChaos-Codex-Starter\CabinChaos-Codex-Starter\assets`)

Все модели — low-poly, сгенерированы скриптами `generate_*.py` (общая библиотека `cc_blender.py`), в каждом .blend есть коллекция `PreviewRig_NOT_EXPORTED` (её не экспортировать). Цвет — материалы, текстур нет.

| Файл | Что это | Размер | Формат | Экспорт в GLB | Оценка |
|---|---|---|---|---|---|
| `special_passengers\SpecialPassengers.blend` | RobotPassenger (робот), SleepyMonster (монстр), PowerPanel. 3.3k tris на всё | 164 КБ | .blend + .fbx + preview.png | Да, Blender CLI по коллекциям | Робот 5, Монстр 5, Панель 2 |
| `prompt27_passengers\Prompt27Passengers.blend` | VampirePassenger, VampireBat, SlimePassenger, MiniSlime, TomatoJuice, TomatoStation. 4.9k tris | 206 КБ | .blend + .fbx + png | Да, по коллекциям | Вампир 4, Слайм 4, Летучая мышь 3, остальное 2 |
| `cabin_extras\CabinExtras.blend` | NormalPassenger, Plane_Wings, CloudPuff, ColaStation, MealStation, ChargingDock, Cabin_Floor, Cabin_WallEnd2. 5.6k tris | 209 КБ | .blend + .fbx + png | Да | Пассажир 3, остальное 2; Plane_Wings 2 (только крылья, не самолёт) |
| `cabin_kit\CabinKit.blend` | Кит салона: кресло, стена с окнами, вставка окна | 112 КБ | .blend + .fbx + previews | Да; можно собрать диораму салона | 3 |
| `service_trolley\ServiceTrolley.blend` | Тележка стюардессы, 1.4k tris | 107 КБ | .blend + .fbx + png | Да | 3 |
| `passenger_seat`, `lobby_gate`, `crew_uniform`, `coffee_cup`, `coffee_station`, `cola`, `meal_tray`, `mop`, `trash_bin` (.blend) | Пропсы игры | 100–233 КБ | .blend (+.fbx) + preview.png | Да | 2–3 |
| `shop_previews\render_shop_previews.py`, `docs\previews\render_passenger_ui.py` | Скрипты рендера иконок | — | .py | Пример настройки рендера | — |
| `marketing\qa\stills\*`, `marketing\gameplay\*` | Кадры/стиллы видео (jpg/png) | — | .jpg/.png | Только как изображения для кейса | — |

Самолёта целиком как модели нет: есть только `Plane_Wings`, кит салона и облака.

### Woodcutter vs Zombies (`woodcutter\woodcutter\blender`)

183 FBX (79 МБ всего), .blend-исходников нет. Генераторы: только `wc_trees.py` (ели) и `wc_shopfix.py`. Происхождение остальных FBX (вручную / через blender-mcp) по файлам не подтверждено. Материалы без текстур, многие объекты тяжёлые (25–125k tris) — нужен decimate.

| Файл | Что это | Размер | Tris | Экспорт в GLB | Оценка |
|---|---|---|---|---|---|
| `dragon.fbx` | Дракон (босс) | 954 КБ | 45.7k | Да: импорт FBX -> decimate ~0.5 -> GLB | 5 |
| `knightBow/knightLongbow/knightCrossbow/knightFire.fbx` | Рыцари-помощники (хром/золото) | 1.5–1.7 МБ | ~79k | Да, decimate 0.3–0.4 | 4 |
| `zombieOutfit/zombieBruteOutfit/skeletonOutfit/jumperOutfit.fbx` | Зомби, громила, скелет-лучник, прыгун | 0.7–0.9 МБ | 27–52k | Да, decimate 0.5 | 4 |
| `gargoyle.fbx`, `angel.fbx`, `fountain2–5.fbx` | Фонтаны и статуи | 0.4–2.6 МБ | 46–125k | Да, сильный decimate | 3 |
| `castle1–7.fbx`, `tower1–4.fbx`, `throne.fbx`, `swordThrone.fbx` | Замок, башни, троны | 0.1–0.6 МБ | castle5 52k, throne 48k | Да | 3 (рендеров-превью нет, кроме loading) |
| `goldAxe/ironAxe/steelAxe/oldAxe/battleAxe/flyingAxe.fbx`, `crossbow`, `sword`, `spear`, `club`, `revolver`, `chainsaw` | Оружие и инструменты | 0.1–0.5 МБ | goldAxe 15.6k, crossbow 10k, chainsaw 21k | Да | goldAxe 4, crossbow 4, остальные 3 |
| `petBat`, `petCrow`, `ghostDog`, `blackCat`, `mimic`, `dragonEgg`, `decorUnicorn` | Питомцы и декор | 0.4–0.95 МБ | 16–42k | Да | 3–4 |
| `spruce1–4.fbx`, `bush1–5.fbx`, `crowTree.fbx` | Ели (из `wc_trees.py`), кусты | 0.3–0.4 МБ | spruce1 1.9k | Да | 3 |
| `decor*`, `grave*`, `bag1–9`, `belt*`, мебель, домики, `*Look.fbx` | Декор, могилы, конвейер, мебель | 40 КБ–1.6 МБ | — | Да | 1–3 |
| `preview_*.png` (8), `loading\*.png` (20), `cloaks\*.png`, `icons\*.png` | Вьюпорт-превью (серый грид Blender), loading-экраны | 0.5–1.6 МБ | — | Превью вьюпорта не годятся как постеры; loading-экраны — для кейса | — |
| `C:\Users\tolik\Documents\лесоруб против зомби.rbxl` | Roblox place (бинарный) | 98 КБ | — | Нет: Blender не читает .rbxl. Только скриншот из Studio с пометкой | 1 |

### PILLARS

| Файл | Что это | Экспорт | Оценка |
|---|---|---|---|
| `tools\map_import\voxels_to_rbxm.py`, `tools\preview\render_map.py` | Конвертер вокселей в rbxm и рендер карты | Моделей нет; карты строятся в Luau (`src\server\Maps\Builder.luau`, `Voxel.luau`) — теоретически воспроизводимы в Blender, но трудоёмко | 1 |
| `assets\promo\*.png`, `assets\shop\*.png` | Промо-иконки, тамбнейлы EN/RU, иконки магазина | Только изображения (постер/карточка проекта) | — |

### Metrocity, Sakhli
3D-ассетов нет. В шоурум не входят.

### Luau-скрипты, строящие модели из Parts
- `питомцы\src\shared\PetModel.luau`, `src\server\World\Kit.luau`, `WorldAssets.luau` — сборка питомцев/мира в Roblox из импортированных MeshPart (источник уже есть в .blend).
- `PILLARS\src\server\Maps\Builder.luau`, `Voxel.luau` — процедурные воксельные карты.
- Woodcutter `src\client\*.client.luau` — эффекты (летучие мыши, вороны, топоры), не модели.
Вывод: воспроизводить из Luau не требуется — для Pets и Cabin Chaos есть Blender-исходники.

## Шорт-лист для шоурума (12)

| # | Модель | Проект | Источник | Tris (сейчас -> цель) | Оценка |
|---|---|---|---|---|---|
| 1 | Питомец AIR (Cotton Cloud), собранный | Build Your Pet | `petforge_parts_v2.blend` + `manifest.json` | ~15k -> как есть | 5 |
| 2 | Гибрид HYBRID_BUNNY_DRAGON | Build Your Pet | то же, комбо из `build_all.py` HYBRIDS | ~15k | 5 |
| 3 | Конфигуратор частей (6 слотов x 5 стихий) — опционально, отдельные GLB частей | Build Your Pet | `petforge_parts_v2.blend` | 2.4k на часть | 5 |
| 4 | W_CLOUD_GARDENS_CASTLE | Build Your Pet | `petforge_world.blend` | 35.6k -> ~20k | 5 |
| 5 | TREE_FAIRY_L (воксельное дерево) | Build Your Pet | `petforge_world.blend` | 13.5k | 4 |
| 6 | RobotPassenger | Cabin Chaos | `SpecialPassengers.blend` | ~1.2k | 5 |
| 7 | SleepyMonster | Cabin Chaos | `SpecialPassengers.blend` | ~1.2k | 5 |
| 8 | VampirePassenger (+ VampireBat) | Cabin Chaos | `Prompt27Passengers.blend` | ~1.5k | 4 |
| 9 | Dragon | Woodcutter | `dragon.fbx` | 45.7k -> ~20k | 5 |
| 10 | Knight (knightFire или knightBow) | Woodcutter | `knightFire.fbx` | ~79k -> ~25k | 4 |
| 11 | Zombie Brute | Woodcutter | `zombieBruteOutfit.fbx` | 51.7k -> ~20k | 4 |
| 12 | Gold Axe | Woodcutter | `goldAxe.fbx` | 15.6k -> ~8k | 4 |

Запас: SlimePassenger, ServiceTrolley (CC), W_STARFALL_SCOOP_OBSERVATORY, TREE_BLOSSOM_L (Pets), crossbow, decorUnicorn, gargoyle (Woodcutter).
Распределение: Build Your Pet 5, Cabin Chaos 3, Woodcutter 4, PILLARS 0 (только постер из `assets\promo`).

## План конвейера

1. **Скрипт** `tools/blender/export_showroom.py` (в папке сайта), запуск: `"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b <src> --python export_showroom.py -- <id>`. Исходники открываются только на чтение, сохранение не вызывается; при необходимости сначала копировать исходник в scratch.
   - .blend (CC): экспорт коллекции по имени, без `PreviewRig_NOT_EXPORTED`.
   - .blend (Pets parts): импорт `build_all.assemble()` или повтор логики сокетов из `manifest.json`; экспорт собранного питомца.
   - .blend (Pets world): объединить куски `<ASSET>__*`.
   - .fbx (Woodcutter): `import_scene.fbx` в пустую сцену.
2. **Нормализация**: apply transforms, origin в низ-центр, масштаб к ~1–2 м по высоте, +Y up (glTF по умолчанию).
3. **Decimate** (Collapse) только если tris > 25k; цель 15–25k на модель; проверить, что мелкие детали (глаза, зубы) не разваливаются — для них ratio выше или исключение.
4. **Материалы**: Principled BSDF с base color/metallic/roughness; vertex colors (Pets) экспортируются как COLOR_0 — в R3F `vertexColors`. Текстур нет, ограничение 1–2K не потребуется. Эмиссивные части (`glow_*`) — emissive.
5. **Экспорт GLB**: `export_scene.gltf(export_format='GLB', export_draco_mesh_compression_enable=True, export_apply=True)`; при проблемах с Draco — `gltf-transform meshopt` (npm, по согласованию). Бюджет: ≤ 1 МБ на модель, жёсткий потолок 2–3 МБ.
6. **Постеры webp**: рендер EEVEE 1024x1024, прозрачный фон, 3/4 ракурс (можно взять `setup_studio` из `pf_render.py` как основу) -> PNG -> webp (ffmpeg установлен: `ffmpeg -i in.png -quality 82 out.webp`). Для Pets можно сконвертировать готовые `previews\v2\pets\*.png` и `previews\world\*_beauty.png`.
7. **Вывод**: `public/models/<id>.glb`, `public/posters/<id>.webp`, метаданные `src/content/models` (id, проект, исходный путь, tris до/после, размер, дата экспорта, способ: CLI/MCP).
8. **Проверка**: повторный импорт GLB в Blender (tris, bbox, материалы), просмотр в R3F, размер файла.

## Ограничения
- `.rbxl` (Woodcutter) и Roblox-сборки (PILLARS карты) не конвертируются в Blender — только скриншоты из Studio с пометкой.
- Woodcutter: нет .blend-исходников, происхождение FBX не подтверждено; превью — скриншоты вьюпорта (не постерного качества), постеры надо рендерить заново.
- Woodcutter: хромированные рыцари выглядят хорошо только с environment map — в шоуруме нужен лёгкий HDRI/Environment preset.
- Анимаций (actions/armatures) нет ни в одном проверенном файле; `anim: wing_flap` в manifest Pets — анимация на стороне Roblox. В шоуруме — только вращение/idle-покачивание кодом.
- Самолёта Cabin Chaos целиком как модели нет.
- В корне сайта пока нет `src/content` и `public/models` — создать на этапе экспорта.
