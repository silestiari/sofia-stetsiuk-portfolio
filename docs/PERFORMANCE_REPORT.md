# Аудит производительности — этап 1 (только измерения)

Дата: 2026-10-18. Сборка: `next build` (Next 16.4.2, Turbopack), сервер `next start -p 3303`, локально (TTFB ≈ 5–10 мс, поэтому реальный TTFB хостинга в цифры не входит).
Код не менялся. Исходные JSON Lighthouse и скрипты замеров лежат в scratchpad сессии, в репозиторий не добавлялись.

Инструменты:
- **Lighthouse 12.8.2**, только категория performance. Mobile = профиль по умолчанию (Moto G Power, 412×823, DPR 1.75, simulated throttling: 150 мс RTT, 1.6 Мбит/с, CPU ×4). Desktop = `--preset=desktop`. По 3 прогона, в таблице медиана.
- Дополнительно Lighthouse с `--throttling-method=devtools` (реальное, а не симулированное замедление) для /en и кейса, по 2 прогона.
- Playwright + Chrome, свои скрипты: PerformanceObserver (LCP, layout-shift, longtask, event), CDP-троттлинг (150 мс / 1.6 Мбит/с / CPU ×4), лог сети по фазам «до скролла / во время скролла», счётчик WebGL draw calls по каждому canvas, `performance.memory`.

Во время первой серии Lighthouse другой агент пересобрал `.next` (BUILD_ID 16:50:38). Чанки по размеру не изменились (поменялись имена у двух мелких). Таблица ниже построена по второй, чистой серии.

---

## 1. Сводка метрик

### Lighthouse, simulated throttling (медиана из 3)

| Страница | Профиль | Perf | FCP | LCP | TBT | CLS | Speed Index | Вес страницы | LCP-элемент |
|---|---|---|---|---|---|---|---|---|---|
| /en | mobile | **86** (86/86/84) | 1.11 s | **4.22 s** | 33 ms | 0.000 | 1.29 s | 620 KB | `img` hero-scene.webp (постер hero) |
| /ru | mobile | **85** (85/85/77) | 1.49 s | **4.36 s** | 36 ms | 0.000 | 1.63 s | 630 KB | `img` hero-scene.webp |
| /en/projects/cabin-chaos | mobile | **86** | 0.91 s | **4.16 s** | 24 ms | 0.000 | 0.91 s | 598 KB | первый скриншот кейса (next/image) |
| /en | desktop | **97** | 0.30 s | 1.28 s | 0 ms | 0.000 | 0.46 s | 931 KB | `img` hero-scene.webp |
| /ru | desktop | **99** | 0.35 s | 0.89 s | 0 ms | 0.000 | 0.42 s | 942 KB | — |
| /en/projects/cabin-chaos | desktop | **99** | 0.27 s | 0.87 s | 0 ms | 0.000 | 0.29 s | 600 KB | скриншот кейса |

Разбивка LCP на mobile (Lighthouse): TTFB 454 мс, задержка загрузки ≈ 0–150 мс, загрузка 90–260 мс, **render delay 3.0–3.6 с**. Сам ресурс LCP приходит быстро (постер предзагружен, `prioritize-lcp-image` и `lcp-lazy-loaded` проходят). Время уходит на то, что до LCP в очереди стоят около 500 KB шрифтов и JS, плюс CSS-анимация появления (см. P1-1).

### Lighthouse, devtools throttling (реальное замедление сети и CPU), mobile

| Страница | Perf | FCP | LCP | TBT | CLS | Самая длинная задача |
|---|---|---|---|---|---|---|
| /en | 77–79 | 2.67–2.76 s | 2.67–2.76 s (span имени) | **393–445 ms** | 0.001 | 885–973 ms |
| /en/projects/cabin-chaos | 80–84 | 2.06–2.22 s | 2.28–2.86 s | 97–126 ms | **0.238** | 396–505 ms |

### Playwright, mobile 412×823, CDP-троттлинг (150 мс, 1.6 Мбит/с, CPU ×4), по 3 прогона

| Страница | Анимации | FCP | LCP |
|---|---|---|---|
| /en | обычные (`no-preference`) | 2.05–2.30 s | **3.48–3.85 s** (img постера) |
| /en | `prefers-reduced-motion: reduce` | 1.80–2.68 s | **1.80–2.68 s** (span имени) |
| /en/projects/cabin-chaos | обычные | 1.65–2.04 s | 1.76–2.23 s |
| /en/projects/cabin-chaos | reduce | 1.12–1.14 s | 1.75–1.76 s |

### INP (прокси: максимальная длительность события на клик или тап, PerformanceObserver `event`)

| Условие | Projects-фильтр | Showroom (проект / пасс) | QA Playground | Pet builder |
|---|---|---|---|---|
| Desktop, аппаратный GPU (RTX, D3D11) | ≤ 16 ms | ≤ 16 ms | ≤ 16 ms | ≤ 16 ms |
| Mobile 412px, CPU ×4, аппаратный GPU | 40–64 ms | 24–40 ms | 24–56 ms | 24 ms |
| Desktop, программный WebGL (SwiftShader, условно слабый GPU) | 24–32 ms | **808–1032 ms** (смена пасса Wire/Clay/Shaded/Final) | 32 ms | 32–112 ms |
| Mobile, CPU ×4, SwiftShader | 56–120 ms | 56 ms (только постеры) | 64–72 ms | **1152 ms** (первый тап), 152–240 ms |

Полевых данных INP (CrUX / RUM) нет: сайт не опубликован. Значения выше лабораторные.

---

## 2. Бандл

Turbopack не выводит в `next build` колонку First Load JS, поэтому размеры посчитаны по `.next/static/chunks` (gzip -9) и по тегам `<script>` в отданном HTML.

| Чанк | raw | gzip | Содержимое | Где грузится |
|---|---|---|---|---|
| `0342slbbtfc0n.js` | 1066 KB | **289 KB** | three + @react-three/fiber + drei (основное) | только динамически: desktop при появлении hero, mobile у Pet builder |
| `2gvu8dyrhibpa.js` | 230 KB | 72 KB | react-dom | все страницы |
| `0qt4ngr5cra_4.js` | 181 KB | **59 KB** | данные `src/content` (проекты, модели, pet-parts, QA-сценарии, обе локали) и клиентские секции | главная (51 KB из них Lighthouse считает неиспользуемыми) |
| `0huitrha_yv5s.js` | 144 KB | **49 KB** | `motion` (полный `motion.*`, без LazyMotion) | все страницы (из-за LanguageSwitcher в шапке); 29–31 KB не используются |
| `2e268anpfvdoc.js` | 168 KB | 46 KB | Next App Router runtime | все |
| `0er9dc_qscrpf.js` | 40 KB | 12 KB | intl-messageformat (next-intl) | все |
| `0cz1d0mv5g_q7.js` | 113 KB | 39 KB | полифиллы `noModule` | современные браузеры его **не скачивают** (проверено по сети) |
| `0y-9dymqaph5s.js`, `2np7bp7yukgbj.js` | 21 + 29 KB | 7 + 9 KB | drei OrbitControls и др. для Showroom/PetStage | динамически |

**Начальный JS (по `<script>` в HTML, без noModule):**
- главная `/en`: **837 KB raw / 262 KB gzip**, 11 скриптов;
- кейс `/en/projects/cabin-chaos`: **659 KB raw / 204 KB gzip**. На кейсе нет чанка с данными, но есть motion.

**three/R3F в начальный чанк не попадают.** На mobile `0342…js` запрашивается только при скролле до Game Playground (scrollY ≈ 22 000 px). На desktop он грузится сразу после загрузки страницы, потому что hero-слот виден на первом экране (LazyMount, rootMargin 400px). Это поведение задумано, но 285 KB JS и 287 KB GLB конкурируют с LCP (P2-5).

**HTML:** `/en` 261 KB raw / 39 KB gzip, `/ru` 290 KB / 45 KB, кейс 73 KB / 15 KB. Не меньше 94 KB HTML главной составляет inline RSC-payload (`self.__next_f.push`). `NextIntlClientProvider` получает все сообщения (в layout.tsx стоит комментарий `ponytail`), а данные контента дублируются: они есть и в RSC, и в клиентском чанке.

---

## 3. Сеть: что грузится до скролла

### /en mobile (CDP-троттлинг, кеш выключен), 577 KB до скролла

| Тип | Объём | Детали |
|---|---|---|
| Документ | 39 KB | |
| Шрифты | **160 KB** | 6 preload-файлов woff2 (latin + cyrillic × 3 семейства) |
| JS | 268 KB | 11 чанков |
| CSS | 13 KB | один файл, render-blocking (Lighthouse оценивает потерю в 154 мс) |
| Изображения | 62 KB | `hero-scene.webp` 23 KB (LCP), **`pet-cotton-cloud.webp` 31 KB**: постер Showroom на y ≈ 6200 px, но в `<head>` для него стоит `<link rel=preload as=image>`; первый скриншот Projects 7 KB |
| RSC prefetch | 21 KB | |
| GLB / three | **0** | ✓ |

### /en desktop 1440×900, 1155 KB до скролла
То же самое плюс `0342…js` 285 KB и четыре GLB для hero общим весом 287 KB: `pet-cotton-cloud.glb` 248 KB (gzip, raw 395 KB), `robot-passenger` 13, `sleepy-monster` 16, `acc-head-legendary` 10.

### GLB во время скролла
- **Showroom:** новых GLB при прокрутке нет, потому что первая модель `pet-cotton-cloud.glb` уже в кеше `useGLTF` после hero. Остальные модели грузятся только по клику. ✓
- **Game Playground:** 6 GLB pet-parts (258 KB) запрашиваются на scrollY 14 400 (desktop) и 24 000 (mobile), когда секция начинается на 14 094 и 21 766 соответственно. То есть загрузка начинается при подходе к секции. ✓
- На mobile ни hero, ни Showroom canvas не создают, показывают постеры. ✓ Pet builder на mobile **рендерит живой 3D** (P2-8).

### Видео
На кейсе Cabin Chaos оба `<video>` с `preload="none"`, mp4 не скачиваются. ✓ Постеры видео (42 + 35 KB) грузятся сразу при открытии страницы, хотя видео ниже первого экрана.

### Изображения: размер файла и отображаемый размер
- Скриншоты в next/image: на mobile отдаётся `w=750` при нужных 632–670 физ. px, на desktop `w=1080` при нужных 745–864 px. Подбор адекватный. ✓
- **Миниатюры Showroom 48×48 (84 физ. px на mobile)** берутся из постеров 1024×1024. `cloud-gardens-castle.webp` 43 KB, `fairy-tree.webp` 47 KB и `pet-bunny-dragon.webp` 32 KB качаются только ради миниатюр, это 122 KB.
- `hero-scene.webp` имеет 1080 px при нужных 663 (mobile), файл всего 23 KB, некритично.
- **CLS-риск:** все `MediaItem` (next/image) до загрузки имеют размер **0×0**, проверено с заблокированными изображениями. Причина в классах `w-auto h-auto`: они отменяют aspect-ratio из атрибутов width/height. Lighthouse с devtools-троттлингом зафиксировал на кейсе **CLS 0.238**, источник `img` в `ul.grid` («Media element lacking an explicit size»).

### Кеширование
`/models/*`, `/posters/*`, `/media/*` отдаются с `Cache-Control: public, max-age=0`, то есть при каждом визите идёт ревалидация. `/_next/static` имеет immutable. ✓ GLB сжимаются gzip. ✓

---

## 4. WebGL

| Параметр | Desktop | Mobile |
|---|---|---|
| Canvas одновременно живых после полной прокрутки | **3** (hero 720×1007, showroom 985×615, pet 617×617) | 1 (pet 634×634 при CSS 363 px, то есть DPR 1.75) |
| Draw calls за 2 с, все canvas вне viewport | **0 / 0 / 0** ✓ (`frameloop="never"` вне экрана работает) | 0 |
| Draw calls за 2 с, canvas в центре экрана (GPU) | hero 4716 (≈ 39/кадр), showroom 3883 (≈ 32/кадр, autoRotate), pet **7990 (≈ 66/кадр)** | pet 578 (SwiftShader) |
| DPR | `[1, 1.75]` во всех canvas ✓ | 1.75 |
| frameloop | hero `always`, showroom `always` при autoRotate, иначе `demand`; pet `always` (кроме reduced motion) | pet `always` |
| JS heap после прокрутки всех 3D-секций | 17–19 MB used / 19–22 MB total | 15 / 18 MB |
| GPU-память | через API браузера не измеряется. Текстур в GLB нет (проверены все 11 моделей и pet-parts: images = 0, цвет из материалов), поэтому основной расход приходится на геометрию: 1.2–31.7 тыс. треугольников на модель | |

Контексты WebGL после монтирования не освобождаются: `LazyMount` монтирует один раз и больше не размонтирует. `ContactShadows` в `ShowroomStage.tsx:196` и `PetStage.tsx:97` вызывается без `frames`, поэтому каждый кадр сцена дополнительно рендерится в карту теней и проходит blur. Отсюда 66 draw calls на кадр у pet.

GLB не сжаты (нет meshopt/Draco). Крупнейшие файлы: knight-bow 964 KB, fairy-tree 927 KB, castle и zombie-brute по 755 KB, dragon 701 KB.

---

## 5. Шрифты

- `next/font/google`, 3 семейства: Unbounded (variable 200–900), Manrope (variable 200–800), JetBrains Mono (400, 500 — один и тот же variable-файл). `display: "swap"` ✓, subsets `latin` и `cyrillic` ✓, fallback с `size-adjust`/`ascent-override` генерируется ✓.
- В сборке 17 woff2-файлов, 404 KB. На страницу скачиваются **6 preload-файлов, 160 KB**: Unbounded latin 50 + cyr 31, Manrope 24 + 14, JetBrains 31 + 9.
- **На /en кириллица не нужна:** в видимом тексте /en 0 кириллических слов, но 3 cyrillic-файла (54 KB) всё равно предзагружаются. Для /ru latin нужна (имена, цифры).
- Unbounded используется как `font-display` с весами medium и semibold. Variable-ось 200–900 при этом тянется целиком.

---

## 6. Проблемы и рекомендации

### P1 — сильнее всего влияют на mobile LCP и CLS

**P1-1. Анимация появления hero откладывает LCP примерно на 1.4 с.**
Файл `src/app/globals.css` (строки около 423–428): `#hero [data-hero-scene] { animation: intro-fade 500ms 700ms backwards }`, а также `.hero-name-line` (clip-path, 300 мс задержки) и `.intro-rise` (opacity 0, 360 мс задержки). LCP-кандидатом становится постер, и засчитывается он только после того, как проявится.
Замер: обычный режим даёт LCP 3.48–3.85 с, reduced motion даёт 1.80–2.68 с (Playwright, CPU ×4, 1.6 Мбит/с).
Что сделать: не анимировать opacity у `[data-hero-scene]` хотя бы на mobile (где там статичный постер) или начинать анимацию с первого кадра без delay. Для имени оставить clip, но убрать задержку 300 мс.
Ожидаемый эффект: mobile LCP /en и /ru примерно −1.2…−1.5 с (лабораторно до ≈ 2.1–2.5 с).

**P1-2. next/image в `MediaItem` занимают 0×0 до загрузки, отсюда CLS 0.238 на кейсе.**
Файлы: `src/components/project/MediaItem.tsx` (`cls = "block h-auto max-w-full ..."`), `src/components/project/ProjectInspector.tsx:117` (`className="mx-auto max-h-[80svh] w-auto"`), `src/app/[locale]/projects/[slug]/page.tsx:145`.
Что сделать: зарезервировать место. Например, `style={{ aspectRatio: \`${width}/${height}\` }}` на `<Image>` (и на `<video>`) или заменить `w-auto` на `w-full` с `object-contain` внутри контейнера с `aspect-ratio`. Ограничение `max-h-[80svh]` при этом сохранить.
Ожидаемый эффект: CLS → 0 на всех кейсах и в Projects Inspector, в том числе при медленной сети и быстрой прокрутке.

**P1-3. Слишком много байт до LCP на mobile.** Simulated LCP 4.2 с почти целиком состоит из скачивания шрифтов (160 KB) и JS (262 KB) по каналу 1.6 Мбит/с. По пунктам:
- a) `src/components/sections/Showroom.tsx` (компонент `Poster`) и постер в `src/components/sections/GamePlayground.tsx`: у `<img>` нет `loading="lazy"`, поэтому React 19 сам вставляет в `<head>` `<link rel=preload as=image>` для `pet-cotton-cloud.webp` (31 KB, секция на y ≈ 6000 px). Добавить `loading="lazy"` и `decoding="async"`. Эффект: −31 KB из критического пути.
- b) Шрифты, `src/app/[locale]/layout.tsx`: у JetBrains Mono поставить `preload: false` (−40 KB preload), у Unbounded указать нужные веса (`weight: ["500","600"]`) вместо всей оси. Если важно, разделить preload кириллицы по локали. Самый простой вариант: `preload: false` для второстепенных семейств, а unicode-range сам подгрузит cyrillic только на /ru. Эффект: preload 160 → ≈ 75–105 KB.
- c) `motion` в шапке: `src/components/layout/LanguageSwitcher.tsx` импортирует полный `motion`, это 49 KB gzip на каждой странице. Перевести на CSS-transition или на `LazyMotion` + `m` + `domAnimation`. `useScroll` в `HeroSceneSlot.tsx` нужен только на desktop, его можно заменить нативным scroll-listener или переместить внутрь dynamic-чанка HeroScene. Эффект: −30…−49 KB gzip начального JS на всех страницах.
- d) `src/content/*` целиком в клиентском чанке (59 KB gzip, из них 51 KB не используется). Клиентские секции (Showroom, GamePlayground, ProjectFilter, Playground) импортируют модули данных напрямую. Резолвить локаль и передавать в клиентские компоненты только нужные поля из серверных компонентов. Эффект: до −40…−50 KB gzip JS главной и меньше работы при гидратации.

Суммарный ожидаемый эффект P1-3 на simulated mobile LCP примерно −1…−1.5 с (оценка по доле байт; после правок нужен повторный замер).

### P2

**P2-4. Длинная задача гидратации главной: 885–973 мс (Lighthouse devtools, CPU ×4) и до 1520 мс (Playwright, кеш выключен). TBT 393–445 мс.**
Причины: 28 клиентских компонентов, все сообщения next-intl передаются на клиент (`layout.tsx`), 94+ KB inline RSC. Что сделать: `NextIntlClientProvider messages={pick(...)}` только с namespace клиентских компонентов, плюс P1-3d. Тяжёлые интерактивные секции ниже первого экрана (QA Playground, Pet builder) гидратировать лениво, через `next/dynamic` и `LazyMount`, как уже сделано для 3D. Эффект: TBT при devtools-троттлинге ниже 200 мс, лучше INP на слабых устройствах.

**P2-5. Desktop: three (285 KB gzip) и 4 GLB (287 KB) стартуют вместе с загрузкой страницы.**
`HeroSceneSlot.tsx`: слот виден сразу, поэтому LazyMount срабатывает мгновенно. Сейчас desktop LCP 1.28 с, вес 931 KB против 620 KB на mobile. Что сделать: монтировать `LiveScene` после `load` и `requestIdleCallback` (постер уже показан). Эффект: desktop LCP/TTI не зависят от 570 KB 3D. Дополнительно сжать GLB через `gltfpack -cc` (meshopt), декодер `three/examples/jsm/libs/meshopt_decoder` бандлить локально, без CDN. Ожидаемый размер в 3–5 раз меньше, но это нужно проверить на копиях моделей и согласовать с 3D-артистом.

**P2-6. `ContactShadows` перерисовывается каждый кадр.** `src/components/showroom/ShowroomStage.tsx:196`, `src/components/pet-builder/PetStage.tsx:97`.
Что сделать: в Showroom `frames={1}` и пересоздание (через `key`) при смене модели. Если при autoRotate вращается модель, а не камера, то в Showroom оставить live, но с `resolution={256}`. В Pet builder `frames={1}` и обновление при смене детали. Эффект: примерно −30–50 % draw calls у pet (сейчас ≈ 66 на кадр), меньше нагрузка на GPU и батарею.

**P2-7. Смена render-pass на слабом или программном GPU блокирует поток на 0.8–1.0 с.** Это компиляция шейдеров при подмене материалов (`passes.ts`, `applyPass`). Что сделать: после загрузки модели прогреть все 4 материала через `gl.compileAsync(scene, camera)` или один невидимый рендер каждого пасса. Эффект: INP при смене пасса в пределах кадра даже без нормального GPU.

**P2-8. Mobile: Pet builder рендерит живой 3D** (`GamePlayground.tsx`: `show3D = webgl === true && !lost` не учитывает `coarse`). Он тянет three (285 KB) и GLB (258 KB), при этом `frameloop="always"`, DPR 1.75. Hero и Showroom на mobile при этом показывают постеры. Решение принимают дизайн/PM (DESIGN_SYSTEM 5.8). Если 3D на mobile остаётся, то нужны `frameloop="demand"` с invalidate на смену детали или drag и `dpr={[1, 1.5]}` для coarse-указателя (`ThreeCanvas.tsx`).

**P2-9. Кеш статики `max-age=0`** для `/models`, `/posters`, `/media`. В `next.config.ts` добавить `headers()`, например `public, max-age=604800, stale-while-revalidate=86400`. `immutable` ставить только если имена файлов версионируются. Эффект: повторные визиты без ревалидации примерно 30 запросов.

### P3

**P3-10. Миниатюры 48 px из постеров 1024 px** (`Showroom.tsx`, список моделей). Сгенерировать 96 px webp (около 2–4 KB) или использовать `next/image` с `sizes="48px"`. Эффект: −≈ 115 KB при прокрутке до Showroom.

**P3-11. Три WebGL-контекста живут одновременно** (desktop), GPU-память не освобождается. Вне экрана рендер не идёт, это проверено. Если появятся жалобы на мобильных или iGPU, размонтировать canvas, когда он дальше 2 экранов от viewport, или перейти на один общий canvas (`drei/View`).

**P3-12. Постеры видео на кейсах** (77 KB на Cabin Chaos) грузятся сразу. Можно отложить через IntersectionObserver. Эффект небольшой.

**P3-13. `images.formats: ['image/avif','image/webp']`** в `next.config.ts` уменьшит скриншоты ещё на 20–30 %. Оценка, не измерено.

---

## 7. Что проверено и работает как задумано

- three/R3F/drei только в dynamic-чанках (`ssr:false`), в начальном JS их нет.
- На mobile hero и Showroom canvas не создают, используют только постеры.
- GLB Pet builder запрашиваются при подходе к секции (rootMargin 400px), до этого не грузятся.
- Вне viewport draw calls = 0 у всех трёх canvas (`frameloop → "never"`).
- DPR ограничен значением 1.75.
- `<video preload="none">`, mp4 до клика не скачиваются.
- next/image подбирает разумные ширины srcset. LCP-изображение кейса `loading="eager"` с preload.
- Шрифты через next/font с `display: swap`, fallback-метриками и subsets.
- CLS при обычной прокрутке 0.000. Проблема из P1-2 проявляется при медленной сети и быстрой прокрутке, Lighthouse devtools её поймал.

## 8. Ограничения замеров

- Сервер локальный: TTFB около 10 мс, сеть эмулирована. На реальном хостинге TTFB добавится к FCP и LCP.
- INP измерен лабораторно (длительность события на клик/тап), полевых данных нет.
- GPU-память не измеряется через web API; `performance.memory` показывает только JS heap.
- Режим SwiftShader использован как приближение к слабому GPU, на реальных бюджетных Android-устройствах не проверялось.
- Simulated throttling Lighthouse (Lantern) моделирует LCP по графу зависимостей, поэтому mobile LCP 4.2 с — оценка модели. Наблюдаемый LCP при реальном CDP-троттлинге составил 3.5–3.9 с.
