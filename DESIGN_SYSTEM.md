# DESIGN SYSTEM — Sofia Stetsiuk Portfolio

> Концепция: **TWO WORLDS, ONE MIND**. Разделы 2+ (токены компонентов, UI-паттерны, a11y) дописывает UX/UI-дизайнер.

> **Редизайн «Mono Editorial / Pink Signal» внедрён.** Палитра, типографика, радиусы, кнопки, теги, сегменты,
> карточки проектов, Showroom, Pet Builder и motion теперь описаны в `docs/REDESIGN_ART_DIRECTION.md`,
> `docs/REDESIGN_UX_SPEC.md`, `docs/REDESIGN_MOTION_SPEC.md`; при расхождении с разделами 1.2–1.4, 1.6, 4.4–4.9 ниже
> действуют они. Итоговые решения владельца: primary-CTA розовый; лайм `#C5F25A` — только сигнал состояния (пойманный
> баг, точка «open to», статус released); форма: прямоугольник = контент, таблетка = действие/тег/навигация,
> круг = персона/иконка; Pet Builder перекрашен в тёмную тему (пастельный остров убран); glitch — только BugHunt
> «all fixed» и 404; одна marquee-лента между Showroom и About. Токены — в `src/app/globals.css`.

---

## 1. Art Direction

### 1.1 Рассмотренные направления

| | A. Spec Sheet → Toybox | B. RENDER PASS (выбрано) | C. Editorial Duotone |
|---|---|---|---|
| Идея | Сайт как инженерный чертёж (размерные линии, штампы, листы A-формата), который к низу «оживает» в глиняные игрушки | Сайт как окно игрового движка. Скролл = прогон рендер-пассов: **wireframe → debug/gizmos → clay → shaded → beauty**. QA-мир — это debug-слой, Game-мир — финальный кадр. Один и тот же объект проходит оба состояния | Журнальная вёрстка: крупный антиква, разворот «левая полоса QA / правая полоса Game», дуотон-фото |
| Палитра | `#101114` / `#E9E7E1` бумага-линии / `#7B6CFF` / клей `#FF8FB1` `#7CC6FF` | `#0D0E11` графит / `#ECEEF2` серебро / `#9D8CFF` фиолет / `#FF7AB8` розовый / `#6FC9FF` голубой | `#0E0E0E` / `#F2EFE9` / `#8B7CFF` / `#FF6FA8` |
| Шрифты | IBM Plex Sans + IBM Plex Mono | **Unbounded + Manrope + JetBrains Mono** | Lora + Golos Text |
| Приём | Размерные линии и выноски вокруг проектов | Переключение render-mode у одного и того же 3D-объекта; HUD-аннотации, bounding boxes, которые «отпускают» объект | Типографика как главный герой, асимметричные развороты |
| Риск | Уходит в «архитектурное бюро», игровой мир слабее; чертёж на тёмном легко превращается в «blueprint-клише» | Можно скатиться в «sci-fi HUD» и неон; 3D дорогой по перфомансу | Красиво, но статично: 3D и игры выглядят чужеродно; QA-характер теряется |

**Почему B.** Это единственное направление, где метафора *буквальна и правдива для героини*: QA и геймдизайнер работают в одном движке — один смотрит debug-оверлей, другая — финальный кадр. «Two worlds, one mind» становится не делением страницы на две половины, а **двумя режимами взгляда на один объект**. Это даёт естественный, не декоративный переход при скролле (пассы сменяют друг друга), оправдывает 3D (оно здесь — сюжет, а не украшение) и сразу объясняет QA Playground (debug-режим включён) и Pet Builder (beauty-режим + уютный «пауза-экран»). От A берём размерные линии и выноски как часть debug-слоя; от C — дисциплину крупной типографики.

Риск «sci-fi HUD» гасим правилами: HUD — тонкий, серый, моноширинный, *служебный*; цвет появляется только там, где есть смысл (выделение, severity, игровой мир).

---

### 1.2 Палитра (токены)

Все пары текст/фон проверены по WCAG 2.1 (значения — коэффициент контраста).

**База (оба мира)**

| Токен | Hex | Назначение |
|---|---|---|
| `--bg` | `#0D0E11` | Фон страницы, почти чёрный графит |
| `--surface-1` | `#15171C` | Панели, карточки проектов |
| `--surface-2` | `#1D2027` | Поднятые элементы, инпуты, тултипы |
| `--line` | `#2A2E37` | Разделители, рамки |
| `--grid` | `rgba(236,238,242,0.06)` | Сетка/направляющие QA-мира |
| `--grid-strong` | `rgba(236,238,242,0.14)` | Мажорные линии сетки, размерные линии |
| `--text` | `#ECEEF2` | Основной текст (16.6 на bg / 14.0 на surface-2) |
| `--text-2` | `#A4AAB5` | Вторичный текст (8.3 / 7.0) |
| `--text-3` | `#7D8390` | Подписи, HUD-метки (5.1 на bg / 4.7 на surface-1). **Не использовать на surface-2** (4.29) |

**Мир Precision / QA**

| Токен | Hex | Назначение |
|---|---|---|
| `--qa-accent` | `#9D8CFF` | Фиолет: выделение, курсор, активная направляющая, ссылки (7.0 на bg) |
| `--qa-accent-fill` | `#6E5CF0` | Заливка кнопок под белый текст (4.7 с `#FFFFFF`) |
| `--qa-measure` | `#A4AAB5` | Размерные линии, координаты (= text-2) |

QA-мир почти монохромный: фиолет — единственный «живой» цвет, появляется точечно (≤ 5% площади экрана).

**Мир Imagination / Game**

| Токен | Hex | Назначение |
|---|---|---|
| `--game-pink` | `#FF7AB8` | Основной игровой акцент (8.0 на bg) |
| `--game-sky` | `#6FC9FF` | Второй акцент (10.6 на bg) |
| `--game-violet` | `#9D8CFF` | Мост между мирами — тот же фиолет |
| `--iridescent` | шейдер thin-film: `#9D8CFF → #FF7AB8 → #6FC9FF` | **Только на материалах 3D-объектов** и 1px-обводке активного объекта. Никогда — как фон секции или текст |

**Build Your Pet — пастельный «остров» (светлая тема внутри тёмного сайта)**

| Токен | Hex | Назначение |
|---|---|---|
| `--pet-bg` | `#FFF7EF` | Кремовый фон |
| `--pet-surface` | `#FFE8DA` | Персиковые панели |
| `--pet-ink` | `#3A2E40` | Текст (12.0 / 10.8) |
| `--pet-ink-2` | `#6B5A6E` | Вторичный текст (6.0 / 5.4) |
| `--pet-mint` | `#BDEBD6` | Декор, чипы |
| `--pet-lilac` | `#D9CCFF` | Декор, выбранный слот |
| `--pet-butter` | `#FFE7A3` | Декор, подсветка |
| `--pet-sky` | `#CDE8FF` | Декор |
| `--pet-accent-text` | `#74489F` | Если нужен цветной текст/ссылка в Pet (≥ 4.5 на обоих фонах) |

Пастели — только заливки и формы, текст на них всегда `--pet-ink`.

**Severity (QA Playground, bug reports)** — на `--bg`/`--surface-1`, всегда *цвет + текстовая метка + иконка/форма*, не только цвет.

| Токен | Hex | Контраст на bg / surface-1 | Метка |
|---|---|---|---|
| `--sev-critical` | `#FF5D6C` | 6.5 / 6.0 | `S1 CRITICAL` |
| `--sev-major` | `#FF9F45` | 9.5 / 8.8 | `S2 MAJOR` |
| `--sev-minor` | `#F2D04B` | 12.8 / 11.9 | `S3 MINOR` |
| `--sev-trivial` | `#8FA3B8` | 7.4 / 6.9 | `S4 TRIVIAL` |
| `--status-pass` | `#5ED39A` | 10.4 / 9.6 | `PASS` / `FIXED` |

---

### 1.3 Типографика

Все шрифты — Google Fonts с подмножеством `cyrillic`, подключаются через `next/font/google` (`subsets: ['latin', 'cyrillic']`, `display: 'swap'`, variable).

| Роль | Шрифт | Где |
|---|---|---|
| Display | **Unbounded** (variable 300–800) | Имя в Hero, заголовки секций Game-мира, Pet (вес 500, мягче) |
| Text / UI | **Manrope** (variable 300–800) | Весь основной текст, кнопки, навигация, заголовки QA-мира (600–700) |
| Mono | **JetBrains Mono** (400/500) | HUD, метки, координаты, ID багов, шаги воспроизведения, схема агентов, код |

Логика: QA-заголовки — Manrope (точный гротеск), Game-заголовки — Unbounded (широкий, мягкий, «игровой»). Переход между мирами виден и в шрифте. Имя в Hero — Unbounded, т.к. Hero сразу заявляет оба мира.

**Шкала (fluid, 360 → 1440px)**

| Токен | Значение | Применение |
|---|---|---|
| `--fs-hero` | `clamp(3rem, 1.2rem + 8vw, 9rem)` | SOFIA STETSIUK |
| `--fs-h1` | `clamp(2.25rem, 1.4rem + 3.6vw, 4.5rem)` | Заголовок секции |
| `--fs-h2` | `clamp(1.625rem, 1.2rem + 1.8vw, 2.75rem)` | Название проекта |
| `--fs-h3` | `clamp(1.25rem, 1.05rem + 0.8vw, 1.75rem)` | Подзаголовки |
| `--fs-lead` | `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` | Лид, слоган Hero |
| `--fs-body` | `1rem` (16px), line-height 1.6 | Текст |
| `--fs-small` | `0.875rem`, lh 1.5 | Подписи |
| `--fs-mono` | `0.75rem`–`0.8125rem`, lh 1.4 | HUD-метки |

**Трекинг**
- Hero (Unbounded, uppercase): `-0.03em`; h1: `-0.02em`; h2/h3: `-0.01em`.
- Manrope body: `0`.
- Mono-метки uppercase: `+0.08em`; mono в тексте/коде: `0`.
- Кириллица в Unbounded шире латиницы: проверять RU-версию заголовков на переносы; при необходимости `--fs-hero` для RU уменьшать на ~8%.

**Когда моноширинный** — только для того, что в реальном инструменте было бы машинным: HUD/координаты/размеры, ID и поля bug report, severity-метки, шаги воспроизведения, названия агентов и стрелки в AI Workflow Lab, теги стека, номера секций (`01 / PROJECTS`). Никогда — для абзацев и заголовков.

---

### 1.4 Композиция

**Сетка.** 12 колонок, max-width 1440px, поля `clamp(16px, 4vw, 64px)`, гаттер 24px. Базовый шаг отступов — 8px; вертикальный ритм секций `clamp(96px, 14vw, 200px)`. В QA-мире сетка **видима** (тонкие `--grid` линии по колонкам + baseline 8px пунктиром на отдельных участках); в Game-мире она та же, но невидима — объекты свободно её пересекают.

**Асимметрия.** Контент держится колонок 1–7 или 6–12, 3D и медиа занимают противоположную сторону и выходят за поле. Не центрировать всё подряд; центр — только Hero-имя и Contact.

**Разделы — каждый по-своему**
- **Hero** — Wireframe-пасс: имя огромным Unbounded, поверх — bounding box с размерами и курсор-перекрестие; за ним 3D-объект в wireframe, который начинает «заливаться» по скроллу.
- **Projects / Web** (Grand Mall Batumi, Metrocity, Sakhli) — QA-мир: каждая работа как «инспектор объекта» — скриншот в рамке с выносками (stack, роль, что тестировалось), мелкий моно-лог справа. Не карточная сетка: вертикальный список с разной высотой рядов.
- **Projects / Roblox** (Woodcutter vs Zombies, Cabin Chaos, Pillars) — переход в Clay/Shaded: крупные стилизованные превью, сдвинутые по сетке, акцент pink/sky на каждой работе свой.
- **Build Your Pet** (внутри Projects) — «пауза-экран»: секция переключается на светлую пастельную тему с закруглёнными формами (radius 28–40px), мягкими тенями; единственное место без сетки и HUD.
- **3D Showroom** — одна сцена, один объект в фокусе; переключатель пассов (Wire / Clay / Final) — главная интеракция, буквально показывает концепцию.
- **About (интерактивный путь)** — горизонтальная/диагональная траектория-сплайн, по которой идёт точка; узлы — реальные этапы (только подтверждённые факты), подпись в моно.
- **Skills** — не прогресс-бары: матрица «навык × проект», где ячейка подсвечивает, в каком реальном проекте навык применён.
- **AI Workflow Lab** — схема агентов как node-graph редактора движка (моно-ноды, тонкие связи, фиолетовый поток данных), фон — видимая сетка.
- **QA Playground** — debug-режим «включён»: мини-интерфейс с подложенным багом, справа форма bug report с severity-токенами.
- **Game Design Playground (Pet Builder)** — второй пастельный остров, связанный с Build Your Pet: слоты-кружки, предмет «плюхается» на место.
- **Contact** — Beauty-пасс: весь HUD снят, на графите один финальный объект в иридесцентном материале и крупно «Let's build something remarkable.»

**Переход QA → Game.** Не резкая граница, а смена пассов по прогрессу скролла:
1. Hero → Web Projects: wireframe + gizmos, сетка видна, фиолет.
2. Roblox Projects → Showroom: сетка гаснет до 0, появляется clay-заливка, затем цвет (pink/sky).
3. About / Skills / AI Lab — смешанная зона (сетка тоньше, цвет точечно) — «one mind».
4. QA Playground снова включает debug-слой (осознанный возврат), Pet Builder — beauty + пастель.
5. Contact — финальный кадр.
HUD-элементы (метки, размерные линии) не исчезают «фейдом в никуда» — они отпускают объект: линии стягиваются в точку/уезжают к краю.

**Роль 3D.** 3D — носитель сюжета, а не фон. Один «сквозной» объект (Hero → Showroom → Contact) + превью Roblox-проектов. Стилизация: мягкие формы, toon/clay-шейдинг, ограниченная палитра материалов; иридесценция только у героя-объекта. На мобильных и при `prefers-reduced-motion` — статичные постеры тех же пассов. Если реальных 3D-ассетов проекта нет — не подменять «случайными» моделями из стоков без пометки.

---

### 1.5 Motion

**Характер.** QA-мир движется *точно*: короткие линейные/ease-out движения, привязка к сетке (snap), появление «отрисовкой» линии (stroke-dashoffset), курсор-сканирование. Game-мир — *упруго*: лёгкий overshoot, squash & stretch у Pet, плавное парение 3D. Ничего не движется без причины: каждое движение либо показывает состояние, либо ведёт взгляд.

**Easing**
| Токен | Значение | Для |
|---|---|---|
| `--ease-precise` | `cubic-bezier(0.2, 0, 0, 1)` | QA: линии, HUD, панели |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Общие появления |
| `--ease-soft` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Game/Pet: overshoot, «плюх» |
| spring (R3F/framer) | stiffness 170, damping 22 | 3D-объекты, Pet-слоты |

**Длительности**
- Микро (hover, фокус, тоггл): 120–180ms.
- Компоненты (панель, тултип, bug report): 240–360ms.
- Секционные смены пассов: привязаны к скроллу (scrub), не по таймеру.
- Hero-интро: ≤ 1200ms суммарно, контент доступен сразу.
- Stagger: 40–60ms, не более 6 элементов в цепочке.

**Правила**
- Анимируем `transform`/`opacity`/`clip-path`; не layout.
- `prefers-reduced-motion`: scrub-переходы → мгновенная смена состояний, 3D → постер, парение отключено.
- Без бесконечных декоративных лупов, кроме очень медленного (≥ 8s) idle 3D-объекта в кадре.
- Hover у QA-элементов — появление выноски/размерной линии; у Game — лёгкий подъём + наклон 2–4°.

---

### 1.6 Запреты

- Фиолетово-синие градиенты как фон секций/кнопок; градиентный текст.
- Glassmorphism, blur-карточки, одинаковые сетки карточек 3×N.
- Неон, glow-тени, «киберпанк»-HUD с бегущими цифрами ради цифр.
- Иридесценция вне 3D-материалов; более двух акцентных цветов на одном экране (кроме severity-легенды).
- Прогресс-бары и «проценты владения» навыками; облака тегов.
- Стоковые иллюстрации, 3D-эмодзи, «AI-абстракции» (мозги, нейро-сферы, роботы).
- Bootstrap-подобные шаблоны: hero с кнопкой по центру + три иконки-фичи.
- Анимации без смысла: parallax всего подряд, typewriter-эффект на каждом заголовке, бесконечные лупы.
- Severity, переданный только цветом.
- Mono для длинного текста; Unbounded для абзацев.
- Тексты в компонентах (только `src/content`); выдуманные метрики, компании, стаж, статусы — неизвестное помечается «не подтверждено».
- Тёмная тема в Build Your Pet / Pet Builder; HUD и сетка на пастельных островах.

---

## 2. Information Architecture

### 2.1 Карта маршрутов

```
/                         → redirect на /en (или по Accept-Language: ru → /ru)
/[locale]                 → главная, одна страница с якорями
/[locale]/projects/[slug] → страница кейса
  slugs: grand-mall-batumi · metrocity · sakhli            (Web)
         woodcutter-vs-zombies · cabin-chaos · pillars     (Roblox)
         build-your-pet                                    (отдельный «пастельный» кейс)
/[locale]/not-found       → 404 в стиле «MISSING ASSET» (debug-пасс)
locale ∈ { en, ru }; <html lang> = locale; hreflang-пары на каждой странице.
```

Платформа/статус Build Your Pet в IA не фиксируются — берутся из аудита. Если платформа не подтверждена, кейс показывается без платформенной метки.

### 2.2 Порядок секций главной и задача для рекрутера

| # | Якорь | Render-пасс | Вопрос рекрутера, на который отвечает секция | Главное действие |
|---|---|---|---|---|
| 00 | `#hero` | wireframe | «Кто это и чем она полезна?» — имя, двойная роль QA × Game Design, одна строка позиционирования | `Смотреть проекты` (→ #projects), `Связаться` (→ #contact) |
| 01 | `#projects` | debug → clay | «Что она реально сделала?» — 7 проектов: Web (QA-взгляд), Roblox (геймдизайн), Build Your Pet | Открыть кейс |
| 02 | `#showroom` | shaded (переключаемый) | «Это настоящие игровые работы?» — модели/сцены проектов в 3D, переключение пассов | Выбрать модель, крутить |
| 03 | `#about` | смешанный | «Какой путь и мотивация?» — интерактивная траектория из подтверждённых этапов | Пройти по узлам |
| 04 | `#skills` | смешанный | «Где доказательства навыков?» — матрица «навык × проект», без процентов | Кликнуть навык → подсветка проектов |
| 05 | `#ai-lab` | debug-light | «Как она работает с AI-инструментами?» — node-graph реального процесса | Выбрать ноду → описание шага |
| 06 | `#qa-playground` | debug | «Умеет ли она находить и описывать баги?» — мини-интерфейс с подложенными багами + bug report | Найти баг, открыть отчёт |
| 07 | `#game-playground` | beauty / pastel | «Чувствует ли она игровой фан и UX?» — Pet Builder | Собрать питомца |
| 08 | `#contact` | beauty | «Как связаться за 1 клик?» | Email / копировать / GitHub / телефон |

Логика порядка: доказательства (Projects, Showroom) идут раньше биографии — рекрутер решает за 30–60 секунд. Интерактивы (Playgrounds) — после фактов, как «глубина» для заинтересованных. Contact доступен из Header в любой момент.

### 2.3 Навигация

- **Desktop (≥1024)**: `Projects · Showroom · About · Skills · Labs` (Labs → `#ai-lab`, внутри секции видны соседние playground-секции) + кнопка `Contact` (primary-small) + EN/RU.
- **Mobile (<1024)**: логотип-инициалы, EN/RU, бургер → полноэкранное меню со всеми 9 якорями (нумерация 00–08).
- Skip-link «Skip to content / К содержимому» — первый фокусируемый элемент.
- Активная секция подсвечивается в навигации (`aria-current="true"`) через IntersectionObserver (порог 40% высоты вьюпорта).
- Страница кейса: Header тот же; пункты навигации ведут на `/[locale]#anchor`; вверху — `← All projects / ← Все проекты` (→ `/[locale]#projects`), внизу — prev/next кейс.

### 2.4 Структура страницы кейса

```
1. Back link
2. Case Hero — Project Inspector (variant по миру): название, платформа, статус, роль, стек, ссылки
3. Overview — что за проект (1 абзац)
4. My role — зона ответственности (только подтверждённое)
5. Process — QA: что/как тестировалось; Game: механики, лупы, итерации
6. Media — скриншоты/видео/3D (если есть)
7. Outcomes — только подтверждённые результаты
8. Prev / Next project
```
Правило пустых данных: обязательные поля карточки (статус, роль, платформа) при отсутствии данных показывают «Not confirmed / Не подтверждено»; необязательные блоки (Media, Outcomes, Process) **скрываются целиком**, без заглушек «coming soon».

---

## 3. Design Tokens

Вставляется в `src/app/globals.css`. Цвета — из 1.2 без изменений. `@theme` генерирует утилиты Tailwind v4 (`bg-surface-1`, `text-text-2`, `font-display`, `text-h1`, `rounded-qa`, `md:` и т.д.); то, что не является namespace Tailwind (z-index, служебные), — в `:root`.

```css
@import "tailwindcss";

@theme {
  /* ---------- Colors ---------- */
  --color-*: initial;                 /* убираем дефолтную палитру: только наши цвета */
  --color-bg: #0D0E11;
  --color-surface-1: #15171C;
  --color-surface-2: #1D2027;
  --color-line: #2A2E37;
  --color-grid: rgb(236 238 242 / 0.06);
  --color-grid-strong: rgb(236 238 242 / 0.14);
  --color-text: #ECEEF2;
  --color-text-2: #A4AAB5;
  --color-text-3: #7D8390;            /* не на surface-2 */
  --color-white: #FFFFFF;
  --color-transparent: transparent;
  --color-current: currentColor;

  --color-qa-accent: #9D8CFF;
  --color-qa-accent-fill: #6E5CF0;
  --color-qa-accent-fill-hover: #5B48E0; /* темнее fill → контраст с белым растёт (> 4.7) */
  --color-qa-measure: #A4AAB5;

  --color-game-pink: #FF7AB8;
  --color-game-sky: #6FC9FF;
  --color-game-violet: #9D8CFF;

  --color-pet-bg: #FFF7EF;
  --color-pet-surface: #FFE8DA;
  --color-pet-ink: #3A2E40;
  --color-pet-ink-2: #6B5A6E;
  --color-pet-mint: #BDEBD6;
  --color-pet-lilac: #D9CCFF;
  --color-pet-butter: #FFE7A3;
  --color-pet-sky: #CDE8FF;
  --color-pet-accent-text: #74489F;

  --color-sev-critical: #FF5D6C;
  --color-sev-major: #FF9F45;
  --color-sev-minor: #F2D04B;
  --color-sev-trivial: #8FA3B8;
  --color-status-pass: #5ED39A;

  /* ---------- Fonts (переменные из next/font) ---------- */
  --font-display: var(--font-unbounded), system-ui, sans-serif;
  --font-sans: var(--font-manrope), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;

  /* ---------- Type scale (из 1.3) ---------- */
  --text-hero: clamp(3rem, 1.2rem + 8vw, 9rem);
  --text-hero--line-height: 0.92;
  --text-hero--letter-spacing: -0.03em;
  --text-h1: clamp(2.25rem, 1.4rem + 3.6vw, 4.5rem);
  --text-h1--line-height: 1.02;
  --text-h1--letter-spacing: -0.02em;
  --text-h2: clamp(1.625rem, 1.2rem + 1.8vw, 2.75rem);
  --text-h2--line-height: 1.1;
  --text-h2--letter-spacing: -0.01em;
  --text-h3: clamp(1.25rem, 1.05rem + 0.8vw, 1.75rem);
  --text-h3--line-height: 1.2;
  --text-h3--letter-spacing: -0.01em;
  --text-lead: clamp(1.125rem, 1rem + 0.5vw, 1.375rem);
  --text-lead--line-height: 1.5;
  --text-body: 1rem;
  --text-body--line-height: 1.6;
  --text-small: 0.875rem;
  --text-small--line-height: 1.5;
  --text-mono: 0.8125rem;
  --text-mono--line-height: 1.4;
  --text-mono-xs: 0.75rem;            /* минимум; меньше не делать */
  --text-mono-xs--line-height: 1.4;

  /* ---------- Spacing ---------- */
  --spacing: 0.25rem;                 /* Tailwind-база 4px; в макетах — только чётные шаги: 2,4,6,8… = 8,16,24,32px */

  /* ---------- Radius ---------- */
  --radius-none: 0;
  --radius-qa: 2px;                   /* QA: HUD, чипы, инпуты — почти острые */
  --radius-qa-panel: 4px;             /* QA-панели, кнопки */
  --radius-game: 16px;                /* Roblox-превью, Showroom */
  --radius-pet: 28px;                 /* Pet-панели */
  --radius-pet-lg: 40px;              /* Pet-сцена, большие формы */
  --radius-full: 9999px;

  /* ---------- Shadows (без glow — см. 1.6) ---------- */
  --shadow-none: none;
  --shadow-game: 0 16px 40px -16px rgb(0 0 0 / 0.7);
  --shadow-pet: 0 10px 24px -10px rgb(58 46 64 / 0.22);
  --shadow-pet-lift: 0 18px 32px -12px rgb(58 46 64 / 0.28);
  --shadow-popover: 0 8px 24px -8px rgb(0 0 0 / 0.6);  /* тултип, тост */

  /* ---------- Easing (из 1.5) ---------- */
  --ease-precise: cubic-bezier(0.2, 0, 0, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-soft: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ---------- Breakpoints (mobile-first) ---------- */
  --breakpoint-*: initial;
  --breakpoint-xs: 22.5rem;           /* 360 */
  --breakpoint-md: 48rem;             /* 768 */
  --breakpoint-lg: 64rem;             /* 1024 */
  --breakpoint-xl: 90rem;             /* 1440 */

  /* ---------- Containers ---------- */
  --container-page: 90rem;            /* 1440 */
  --container-prose: 42rem;           /* ~68ch текста */
}

:root {
  /* Layout */
  --page-margin: clamp(16px, 4vw, 64px);
  --gutter: 24px;                     /* mobile: 16px, см. ниже */
  --section-y: clamp(96px, 14vw, 200px);
  --header-h: 56px;

  /* Duration */
  --dur-micro: 150ms;
  --dur-comp: 300ms;
  --dur-page: 480ms;

  /* Focus & outlines («свечения» здесь — только обводки 1–2px, не blur) */
  --ring: 2px solid var(--color-qa-accent);   /* 7.0:1 на bg */
  --ring-offset: 3px;
  --ring-pet: 2px solid var(--color-pet-accent-text);
  --outline-active: 1px solid var(--color-qa-accent);  /* активный объект/слот */

  /* Z-index */
  --z-base: 0;
  --z-raised: 1;
  --z-hud: 10;          /* HUD-оверлеи над 3D */
  --z-header: 50;
  --z-menu: 60;         /* мобильное меню */
  --z-toast: 70;
  --z-tooltip: 80;
  --z-skip: 90;

  /* Render-pass, управляется скроллом (см. 8.3) */
  --grid-opacity: 1;
  --hud-opacity: 1;
}
@media (min-width: 64rem) { :root { --header-h: 64px; } }
@media (max-width: 47.99rem) { :root { --gutter: 16px; } }

/* RU: Unbounded-кириллица шире — hero на ~8% меньше (см. 1.3) */
:lang(ru) { --text-hero: clamp(2.75rem, 1.1rem + 7.4vw, 8.25rem); }
```

Сетка: `max-w-page mx-auto px-[var(--page-margin)] grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-[var(--gutter)]`.

---

## 4. Components

Общие правила состояний (применяются ко всем интерактивным компонентам, если ниже не сказано иначе):

| Состояние | Правило |
|---|---|
| default | Интерактивный элемент всегда отличим от текста: рамка, заливка или подчёркивание + `cursor: pointer` |
| hover | Только на устройствах с `@media (hover: hover)`; QA — выноска/размерная линия, Game — подъём `translateY(-2px)` + наклон 2°, Pet — `scale(1.03)` |
| focus-visible | `outline: var(--ring); outline-offset: var(--ring-offset)`; на Pet — `var(--ring-pet)`. Никогда `outline: none` без замены |
| active | `scale(0.98)` / смещение 1px вниз, 80ms |
| disabled | **Не выглядит кликабельным**: нет рамки-акцента, нет hover, `cursor: default`, текст `--text-3`, рамка пунктир `--line`. Рядом — причина текстом («Demo link not available / Ссылка не подтверждена»). Если действие недоступно всегда (нет данных) — элемент **не рендерится как кнопка**, а показывается как HUD-label со статусом |
| loading | `aria-busy="true"`, текст не меняет ширину кнопки (спиннер — 3 моно-точки `···` слева), повторный клик игнорируется |
| error | Цвет `--sev-critical` + иконка + текст ошибки; сообщение связано через `aria-describedby` |

### 4.1 Header
- Высота `--header-h`; `position: sticky; top: 0; z: --z-header`.
- Над Hero — фон прозрачный; после скролла > 8px — `--bg` 100% + нижняя линия `--line` (без blur — см. 1.6). Переход 150ms `--ease-precise`.
- Слева: моно-логотип `SS_` (ссылка на `#hero`, `aria-label` из контента). Центр/право: nav (≥1024), `Contact`, EN/RU; <1024 — EN/RU + бургер.
- Nav-ссылка: Manrope 600 `--text-small`, `--text-2`; hover — `--text` + под ссылкой рисуется 1px линия `--qa-accent` слева направо (`scaleX 0→1`, origin left, 180ms); active-секция — линия видна постоянно + моно-номер `01` перед текстом становится `--qa-accent`.

### 4.2 Language switcher EN/RU
**Вид.** Сегмент из двух моно-меток `EN` `RU` (JetBrains Mono 500, `--text-mono`, uppercase, `+0.08em`) внутри рамки 1px `--line`, radius `--radius-qa`. Активный язык обрамлён **selection gizmo** — прямоугольник 1px `--qa-accent` с четырьмя угловыми «ручками» 3×3px (как выделение объекта в редакторе). Неактивный — `--text-3`, активный — `--text`. Высота 32px, хит-зона каждой метки ≥ 44×44 (через padding/псевдоэлемент).

**Анимация.** При переключении gizmo «переезжает» на другую метку: `transform: translateX()` + подгонка ширины, 180ms `--ease-precise`, ручки на 60ms чуть отстают (stagger) — эффект перетаскивания выделения. После навигации на новую локаль заголовки в вьюпорте получают однократный «re-render»: `clip-path: inset(0 100% 0 0) → inset(0 0 0 0)`, 240ms `--ease-precise`, stagger 40ms (≤ 6). Reduced-motion: gizmo мгновенно, re-render отключён.

**Разметка.** Это **ссылки**, а не кнопки (смена URL `/en/...` ↔ `/ru/...` с сохранением текущего пути и якоря):
```html
<nav aria-label="Language / Язык">
  <a href="/en/..." lang="en" hreflang="en" aria-label="English" aria-current="true">EN</a>
  <a href="/ru/..." lang="ru" hreflang="ru" aria-label="Русский">RU</a>
</nav>
```
Состояния: hover на неактивной — `--text-2` + пунктирный контур будущего gizmo; focus-visible — `--ring`; активная ссылка некликабельна визуально (`cursor: default`, без hover), но остаётся в DOM с `aria-current`.

### 4.3 Mobile menu
- Открывается бургером (`<button aria-expanded aria-controls="mobile-menu" aria-label>`; иконка: две линии → крест, 180ms).
- Полноэкранный `role="dialog" aria-modal="true" aria-labelledby`, фон `--bg`, видимая QA-сетка (`--grid`), z `--z-menu`.
- Содержимое: список 9 якорей `00 HERO … 08 CONTACT` — моно-номер `--text-3` + название Manrope 700 `--text-h3`, строка ≥ 56px высотой; внизу — EN/RU и contact actions (email, GitHub).
- Поведение: **focus trap** (Tab/Shift+Tab циклично внутри), первый фокус — на кнопку закрытия; `Esc` и повторный тап по кнопке закрывают; фокус возвращается на бургер; `overflow: hidden` на `body`; клик по пункту — закрыть, затем плавный скролл к якорю, фокус на заголовок секции (`tabindex="-1"`).
- Анимация: открытие — `clip-path: inset(0 0 100% 0) → inset(0)` от верха 320ms `--ease-precise`; пункты — `translateY(8px)+opacity` stagger 40ms группами (первые 6, остальные вместе с 6-м). Закрытие — 200ms без stagger.

### 4.4 Button
Высота 48px (md) / 40px (sm, только desktop-header); padding-x 24/16px; **ширина только по содержимому**, `min-width` не задаётся. Manrope 700 `--text-small`, без uppercase. Radius `--radius-qa-panel`. Иконка 16px, gap 8px.

| Вариант | default | hover | active | focus-visible | disabled | loading |
|---|---|---|---|---|---|---|
| **primary** | bg `--qa-accent-fill`, текст `#FFF` (4.7) | bg `--qa-accent-fill-hover`, угловые HUD-скобки 6px появляются снаружи (150ms) | `scale(.98)` | `--ring` | bg `--surface-2`, текст `--text-3`, без скобок | `···` + текст, `aria-busy` |
| **secondary** | рамка 1px `--line`, текст `--text` | рамка `--qa-accent`, текст `--text` | фон `--surface-1` | `--ring` | рамка пунктир `--line`, текст `--text-3` | как primary |
| **ghost** | текст `--qa-accent`, подчёркивание 1px offset 4px | подчёркивание → 2px | — | `--ring` | текст `--text-3`, без подчёркивания | — |

На Pet-острове: primary — bg `--pet-ink`, текст `--pet-bg` (12.0), radius `--radius-full`; secondary — bg `--pet-surface`, текст `--pet-ink`; hover — `scale(1.03)` `--ease-soft`.
Внешние ссылки-кнопки: иконка `↗` + визуально скрытый текст «(opens in new tab / откроется в новой вкладке)».

### 4.5 HUD-label
Неинтерактивная служебная метка. JetBrains Mono `--text-mono-xs`/`--text-mono`, uppercase, `+0.08em`, цвет `--text-3` (на bg/surface-1) или `--text-2` (на surface-2). Формы:
- `01 / PROJECTS` — номер секции;
- `[ W 1280 × H 720 ]` — размер/координаты (только реальные значения или декоративно-нейтральные, без «фейковых метрик» о проектах);
- Callout: метка + 1px линия `--grid-strong` с точкой 3px на конце, указывающая на элемент.
Не имеет hover/focus. `--hud-opacity` из скролла управляет видимостью. На Pet-острове не используется.

### 4.6 Project Inspector
Карточка-презентация проекта. **Не одинаковая сетка**: 3 варианта и 2 ориентации, высоты рядов разные.

| Вариант | Мир | Композиция |
|---|---|---|
| `web` | QA | Слева медиа 7 колонок в рамке 1px с callout-выносками; справа «Properties panel» 5 колонок — моно-ключи (`ROLE`, `PLATFORM`, `STACK`, `STATUS`, `TESTED`) и значения Manrope; сверху моно-лог `> inspect grand-mall-batumi` |
| `roblox` | Game | Крупное превью 8 колонок, radius `--radius-game`, `--shadow-game`, сдвинуто по сетке (`col-start` чередуется 1/5); текстовый блок перекрывает край превью на 1 колонку; акцент (pink или sky) задаётся в данных проекта |
| `pet` | Pastel | Полноширинный остров `--pet-bg`, radius `--radius-pet-lg`, без HUD |

`orientation: left | right` чередуется в списке. Слоты: title (h3, ссылка на кейс), status badge, platform, role, tech chips (≤ 6 видимых, остальные `+N` → раскрывается кнопкой), 1–2 строки описания, actions (`Open case`, внешние ссылки только если подтверждены).

Состояния:
- **default** — как выше; вся карточка не является одной большой ссылкой: главная ссылка — заголовок (stretched-link через `::after` на медиа-область), вторичные ссылки поверх `z: --z-raised`.
- **hover** — `web`: callout-линии дорисовываются (stroke-dashoffset 300ms), рамка медиа → `--qa-accent`; `roblox`: превью `translateY(-4px) rotate(-2deg)`; `pet`: `--shadow-pet-lift`.
- **focus-visible** (заголовок-ссылка) — `--ring` вокруг заголовка + рамка медиа `--qa-accent` (через `:focus-within`).
- **loading** (медиа) — wireframe-скелет: пунктирный bounding box `--grid-strong` с моно-подписью `LOADING ASSET`; без shimmer.
- **error/нет медиа** — постер-плейсхолдер `--surface-1` + моно `PREVIEW NOT AVAILABLE / ПРЕВЬЮ НЕДОСТУПНО`; никаких стоковых заменителей.
- **данные не подтверждены** — значение поля `Not confirmed / Не подтверждено` в `--text-3`, моно, с префиксом `—` (без курсива).

### 4.7 Status badge
Неинтерактивный (без hover/cursor). Высота 24px, padding-x 8px, рамка 1px, radius `--radius-qa`, моно `--text-mono-xs` uppercase. Цвет + форма + текст:

| Статус | Иконка | Цвет текста/рамки |
|---|---|---|
| `Released / Выпущен` | ● заполненный круг | `--status-pass` |
| `In Development / В разработке` | ◐ полукруг | `--game-sky` |
| `Not confirmed / Не подтверждено` | ○ пунктирное кольцо, рамка пунктиром | `--text-3` |

Статус берётся только из `src/content`; отсутствие → третий вариант. На Pet-острове: фон `--pet-mint`/`--pet-sky`, текст `--pet-ink`.

### 4.8 Tech chip
Моно `--text-mono-xs`, рамка 1px `--line`, radius `--radius-qa`, высота 24px, текст `--text-2`. **По умолчанию неинтерактивный** — без hover и pointer. В Skills-матрице чип становится фильтром: `<button aria-pressed>`; тогда default — рамка `--grid-strong`; hover — рамка `--qa-accent`; pressed — bg `--surface-2`, рамка `--qa-accent`, текст `--text`, префикс `✓`; focus-visible — `--ring`.

### 4.9 Showroom UI
```
┌ stage (canvas) ─────────────────────────────┐ ┌ list ───────────┐
│  HUD: model name · project      [W][C][F]   │ │ ○ Model A        │
│                                              │ │ ● Model B (sel)  │
│               [ 3D object ]                  │ │ ○ Model C        │
│  floor grid fading                           │ └──────────────────┘
│  [⟲][⟳] [−][+] [Reset] [❚❚ Auto]             │
└──────────────────────────────────────────────┘
caption: название, проект, источник модели (если подтверждён)
```
- **Фон**: `--bg` + радиальное затемнение к краям (не градиент цвета), пол — сетка `--grid`, гаснущая к горизонту.
- **Список моделей**: `role="radiogroup"` из кнопок-карточек (миниатюра 48px + название + проект); выбранная — `--outline-active` + `●`; стрелки ↑/↓ переключают. Mobile — горизонтальный скролл-снэп под сценой.
- **Pass switcher** `Wire / Clay / Final`: `role="radiogroup"`, сегмент как EN/RU (тот же selection gizmo — визуальная рифма).
- **Контролы**: кнопки 44×44, иконка + `aria-label` («Rotate left / Повернуть влево» и т.д.), tooltip с клавишей. Rotate ±15° за нажатие, зум 3 шага, Reset, Pause/Play auto-rotate (`aria-pressed`).
- **Caption**: h3 название + моно-строка проекта; поля, которых нет в данных, не показываются.
- Состояния: **loading** — wireframe-силуэт bbox + моно `LOADING MESH 0–100%` (реальный прогресс useProgress, иначе без процентов); **error** — постер + `MODEL FAILED TO LOAD` + secondary-кнопка `Retry`; **no-WebGL / reduced-motion** — постер текущего пасса (`<img>` с alt), pass switcher меняет постеры, контролы вращения скрыты (а не disabled).

### 4.10 Bug report card (QA Playground)
Поверхность `--surface-1`, рамка 1px `--line`, слева — полоса 3px цвета severity. Моно-поля:
```
BUG-003                         [▲ S2 MAJOR]   [OPEN]
Title (Manrope 700)
ENV     Chrome · 1440×900 (значения демо-сцены)
STEPS   1. …  2. …  3. …
EXPECTED  …
ACTUAL    …
```
Severity — **цвет + форма + текст**: S1 `⬢` (октагон, `--sev-critical`) · S2 `▲` (`--sev-major`) · S3 `◆` (`--sev-minor`) · S4 `●` (`--sev-trivial`). Статус `FIXED` — `--status-pass` + `✓`.
Состояния: **collapsed** (title + severity, кнопка `Expand` с `aria-expanded`) → **expanded** (высота через `grid-template-rows 0fr→1fr`, 300ms `--ease-precise`); **hover** (на expand-кнопке) — рамка `--grid-strong`; **focus-visible** — `--ring`; **new** (только что найден) — полоса severity «отрисовывается» сверху вниз 240ms + `aria-live="polite"` объявляет «Bug found: S2 Major»; форма отчёта (если пользователь заполняет): **error** — поле с рамкой `--sev-critical`, текст ошибки под полем.
Тексты багов — из `src/content` (их проектирует QA-агент), это демо-баги сайта, не реальные баги проектов, что явно подписано.

### 4.11 Agent node (AI Workflow Lab)
Нода: `--surface-1`, рамка 1px `--line`, radius `--radius-qa-panel`, ширина 200–240px, заголовок — моно uppercase (имя агента/шага из контента), под ним 1 строка Manrope `--text-small` `--text-2`, порты 6px на рамке. Связи — SVG 1px `--grid-strong`, поток данных — пунктир `--qa-accent` с `stroke-dashoffset` анимацией (только когда нода активна).
Состояния: **idle** — как выше; **hover/focus-visible** — рамка `--qa-accent`, входящие/исходящие связи подсвечиваются; **active/selected** — `--outline-active` + панель деталей справа (mobile — снизу); **done** — моно-метка `✓ DONE` `--status-pass`; **error** — `✕ FAILED` `--sev-critical` (только если это часть реального описанного процесса).
Ноды — `<button aria-pressed>` в логическом порядке графа; ←/→ переходят по потоку. Mobile: граф превращается в вертикальный список с линией-стволом слева (не масштабированная мелкая схема).

### 4.12 Pet Builder controls
Только на пастельном острове (`--pet-bg`), без HUD.
- **Сцена**: круг/«подушка» radius `--radius-pet-lg`, `--pet-surface`, питомец по центру.
- **Категории** (из контента): `role="tablist"`, таб — пилюля `--radius-full`, inactive bg `--pet-bg` рамка `--pet-lilac`, selected bg `--pet-lilac` текст `--pet-ink`.
- **Опции**: `role="radiogroup"`, слоты-кружки 64px (mobile 56px, хит-зона ≥ 44), фон пастель, выбранный — рамка 2px `--pet-ink` + `✓`-бейдж; hover `scale(1.06)` `--ease-soft`; focus-visible `--ring-pet`; заблокированная опция (если такая есть в механике) — без hover, иконка замка, текст причины в `aria-describedby`.
- **Действия**: `Randomize` (secondary pet), `Reset` (ghost), `Save image`/`Share` — только если реализовано.
- Выбор опции: предмет «плюхается» (см. 8.2) + `aria-live="polite"`: «Ears: Bunny / Уши: Кролик».

### 4.13 Contact actions
Горизонтальный ряд (mobile — вертикальный стек на всю ширину), каждый элемент рендерится **только если значение есть в контенте**:
- `Email` — primary-кнопка-ссылка `mailto:`.
- `Copy email` — secondary `<button>`; Clipboard API → toast «Email copied / Email скопирован»; иконка на 1.5s меняется на `✓`; при отказе API — выделить текст адреса и тост «Press Ctrl+C / Нажмите Ctrl+C» (error-вариант не нужен — fallback всегда работает).
- `Phone` — ghost-ссылка `tel:` (номер в `href` без пробелов, в тексте — форматированный).
- `GitHub` — ghost-ссылка ↗, `rel="noopener noreferrer"`, `target="_blank"` с пометкой для скринридера.
Адрес email виден текстом (моно, `--text-2`, `user-select: all`) — рекрутер может скопировать вручную.

### 4.14 Toast
Один тост за раз (новый заменяет старый). Позиция: mobile — снизу по центру с отступом 16px + safe-area; desktop — снизу справа 24px. `--surface-2`, рамка 1px `--line`, `--shadow-popover`, radius `--radius-qa-panel`, max-width 360px, текст `--text` `--text-small`, иконка слева (`✓` `--status-pass` / `!` `--sev-major`). Контейнер `role="status" aria-live="polite"` существует в DOM всегда. Автоскрытие 4s; пауза на hover/focus; закрывается `Esc` и кнопкой `✕` (44×44). Фокус тостом не перехватывается.

### 4.15 Tooltip
Для подсказок к иконкам и клавиатурных сочетаний. Появление: hover с задержкой 400ms, focus — сразу; `Esc` скрывает; связь `aria-describedby`. `--surface-2`, текст `--text` (14.0), моно `--text-mono-xs` для клавиш (`[R]`), radius `--radius-qa`, стрелка-«выноска» 1px линией (QA-стиль). Не используется на touch как единственный носитель информации — у иконок всегда есть `aria-label`, а значимая информация дублируется в тексте.

---

## 5. Section Wireframes

Обозначения: `▒` медиа/3D, `[ ]` кнопка, `┊` видимая сетка, `·HUD·` служебная метка. Desktop — 12 колонок (1440), mobile — 4 колонки (360).

### 5.0 Header
```
DESKTOP
┌──────────────────────────────────────────────────────────────────────┐
│ SS_        01 Projects  02 Showroom  03 About  04 Skills  05 Labs    │
│                                              [Contact]  ⌜EN⌟ RU      │
└──────────────────────────────────────────────────────────────────────┘
MOBILE                                    MENU (open)
┌────────────────────────────┐            ┌────────────────────────────┐
│ SS_          ⌜EN⌟ RU   [≡] │            │ SS_                    [✕] │
└────────────────────────────┘            │ 00 Hero                    │
                                          │ 01 Projects                │
                                          │ …                          │
                                          │ 08 Contact                 │
                                          │ ───────────────            │
                                          │ ⌜EN⌟ RU   email  GitHub ↗  │
                                          └────────────────────────────┘
```

### 5.1 Hero (wireframe-пасс)
```
DESKTOP
┊ ·00 / HERO·                                       ·[ X 0.00 Y 0.00 ]· ┊
┊ ┌─ bbox ───────────────────────────────┐                              ┊
┊ │ SOFIA                                │      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒          ┊
┊ │ STETSIUK                             │     ▒ 3D object wire ▒       ┊
┊ └──────────────────────────────────────┘      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒          ┊
┊ QA Engineer × Game Designer   (lead, из контента)                      ┊
┊ [View projects]  [Contact]                                             ┊
┊ ·scroll ↓ to render·                                                   ┊
MOBILE
┊ ·00 / HERO·             ┊
┊ ┌ bbox ───────────────┐ ┊
┊ │ SOFIA               │ ┊
┊ │ STETSIUK            │ ┊
┊ └─────────────────────┘ ┊
┊ QA Engineer ×           ┊
┊ Game Designer           ┊
┊   ▒▒▒ 3D (poster) ▒▒▒   ┊
┊ [View projects]         ┊
┊ [Contact]               ┊
```
Имя — h1. 3D-объект справа (desktop, колонки 8–12, выходит за поле); mobile — под текстом, высота ≤ 40vh, постер.

### 5.2 Projects
```
DESKTOP
┊ ·01 / PROJECTS·   h1 Projects          filter: (All) Web  Roblox     ┊
┊ ── WEB · QA view ────────────────────────────────────────────────────┊
┊ ┌──────────── media 7col ──────────┐ ┌ properties 5col ───────────┐ ┊
┊ │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ├─│ > inspect grand-mall-batumi│ ┊
┊ │ ▒▒▒▒▒ screenshot ▒▒▒▒▒▒▒▒▒▒▒▒▒  │ │ h3 Title       [● STATUS]  │ ┊
┊ └──────────────────────────────────┘ │ ROLE … STACK [chip][chip]  │ ┊
┊                                      │ [Open case →]               │ ┊
┊ ┌ properties 5col ──┐ ┌──────── media 7col (taller) ──────────────┐ ┊
┊ │ … (mirrored)      │ │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │ ┊
┊ └───────────────────┘ └───────────────────────────────────────────┘ ┊
  ── ROBLOX · Game view (сетка гаснет) ─────────────────────────────────
      ╭──────── preview 8col, tilt ─────────╮
      │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
      ╰─────────────────────────╮ text 4col ╰──╮ h3 · status · [Open]
                    ╭──────── preview 8col (offset right) ──────╮
                    │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
  ╭───────────────── BUILD YOUR PET · pastel island ───────────────────╮
  │  (pet-bg, radius 40)   ◯ pet preview      h3 · description · [Open]│
  ╰────────────────────────────────────────────────────────────────────╯
MOBILE
┊ ·01 / PROJECTS·          ┊
┊ h1 Projects              ┊
┊ (All) Web Roblox  → scroll┊
┊ ┌──────────────────────┐ ┊
┊ │ ▒▒▒ screenshot ▒▒▒▒▒ │ ┊
┊ └──────────────────────┘ ┊
┊ h3 Title                 ┊
┊ [● STATUS] platform      ┊
┊ ROLE  …                  ┊
┊ [chip][chip][+3]         ┊
┊ [Open case →]            ┊
  ╭──────────────────────╮
  │ ▒ roblox preview ▒   │   (наклон 2°, без смещения колонок)
  ╰──────────────────────╯
```
Фильтр — `role="radiogroup"`, скрывает группы (не перестраивает сетку анимацией layout). Без JS — все проекты видимы.

### 5.3 3D Showroom
```
DESKTOP
  ·02 / SHOWROOM·   h1 Showroom
  ╭──────────── stage 9col ─────────────────────╮ ┌ models 3col ─┐
  │ model · project            ⌜Wire⌟ Clay Final│ │ ● Model A    │
  │                                              │ │ ○ Model B    │
  │                ▒▒▒ 3D ▒▒▒                    │ │ ○ Model C    │
  │  [⟲][⟳] [−][+] [Reset] [❚❚]                 │ └──────────────┘
  ╰──────────────────────────────────────────────╯
  caption: h3 + mono source
MOBILE
  ·02 / SHOWROOM·
  ╭──────────────────────╮
  │ ⌜Wire⌟ Clay Final    │
  │      ▒▒ 3D ▒▒        │  (aspect 4:5, touch-action: pan-y вне drag-зоны)
  │ [⟲][⟳][Reset][❚❚]    │
  ╰──────────────────────╯
  [A][B][C] → scroll-snap
  caption
```

### 5.4 About (интерактивная траектория)
```
DESKTOP
  ·03 / ABOUT·  h1 About
  ●───────────╮                       ╭──────────●
  node 1      ╰───────●───────────────╯   node 4
              (mono date/label)  node 2 ── node 3
  ┌ detail panel 5col ───────────┐
  │ h3 этап · текст (из контента) │   [← prev] [next →]
  └───────────────────────────────┘
MOBILE  (сплайн → вертикальная линия)
  ·03 / ABOUT·
  │● node 1  — h3 + текст
  │
  │● node 2
  │
  │● node 3
```
Узлы — `<button aria-pressed>`; на mobile всё раскрыто сразу (без скрытого контента).

### 5.5 Skills (матрица навык × проект)
```
DESKTOP
  ·04 / SKILLS·  h1 Skills (proven by projects)
              │ GMB │ Metro │ Sakhli │ WvZ │ Cabin │ Pillars │ Pet │
  ────────────┼─────┼───────┼────────┼─────┼───────┼─────────┼─────┤
  Skill A  [▸]│  ■  │   ■   │        │     │       │         │     │
  Skill B  [▸]│     │       │        │  ■  │   ■   │    ■    │  ■  │
  ...
  (выбор навыка → строка подсвечена, под таблицей: где и как применён)
MOBILE  (таблица → список карточек навыков)
  ·04 / SKILLS·
  [chip filter → scroll]
  ┌ Skill A ─────────────┐
  │ used in: GMB · Metro │  (ссылки на кейсы)
  │ how: 1 строка        │
  └──────────────────────┘
```
Desktop — настоящая `<table>` с `<th scope>`; ячейка: `■` + `<span class="sr-only">used / применён</span>`, пустая — `<span class="sr-only">not used</span>`. Данные «навык × проект» только из аудита.

### 5.6 AI Workflow Lab
```
DESKTOP
┊ ·05 / AI WORKFLOW LAB·  h1                                            ┊
┊ ┌node┐────▶┌node┐────▶┌node┐                ┌ details 4col ─────────┐ ┊
┊ └────┘     └─┬──┘     └────┘                │ NODE NAME (mono)      │ ┊
┊              ▼                              │ что делает, вход/выход │ ┊
┊            ┌node┐────▶┌node┐                └───────────────────────┘ ┊
MOBILE
┊ ·05 / AI LAB·            ┊
┊ │┌ NODE 1 ─────────────┐ ┊
┊ ││ desc                │ ┊
┊ ▼└─────────────────────┘ ┊
┊ │┌ NODE 2 (expanded) ──┐ ┊
┊ ││ details             │ ┊
```

### 5.7 QA Playground
```
DESKTOP
┊ ·06 / QA PLAYGROUND·  h1   ·DEBUG MODE: ON·                          ┊
┊ ┌ demo UI (sandbox) 7col ──────────┐ ┌ bug reports 5col ───────────┐ ┊
┊ │ мини-форма/корзина с багами      │ │ found 1 / N (из контента)   │ ┊
┊ │ [inspect mode ⌜on⌟]              │ │ ┌ BUG-001 ▲ S2 MAJOR ─────┐ │ ┊
┊ │  ⌜ callout на найденный баг ⌟    │ │ └─────────────────────────┘ │ ┊
┊ └──────────────────────────────────┘ │ ┌ BUG-002 ◆ S3 ··· locked ┐ │ ┊
┊                                      └─────────────────────────────┘ ┊
┊ [Reveal all bugs] (ghost)  [Reset]                                    ┊
MOBILE
┊ ·06 / QA PLAYGROUND·     ┊
┊ ┌ demo UI ─────────────┐ ┊
┊ └──────────────────────┘ ┊
┊ found 1 / N              ┊
┊ ┌ BUG-001 ▲ S2 ────────┐ ┊
┊ └──────────────────────┘ ┊
┊ [Reveal all] [Reset]     ┊
```
Ненайденные баги показываются как плейсхолдер `??? — not found yet` без кнопок (не выглядят кликабельными). Кнопка `Reveal all` — альтернатива для тех, кто не хочет играть (и для клавиатуры/скринридера).

### 5.8 Game Design Playground (Pet Builder)
```
DESKTOP  (pastel island, radius 40, без сетки/HUD)
  ╭────────────────────────────────────────────────────────────────╮
  │ h1 (Unbounded 500) Build a pet                                 │
  │ ╭──────── stage ────────╮   (Body) (Ears) (Eyes) (Extra)       │
  │ │        ◯ pet          │   ◯ ◯ ◯ ◯ ◯                          │
  │ │                       │   ◯ ◯ ◯                              │
  │ ╰───────────────────────╯   [Randomize]  Reset                 │
  │ design note: 1–2 строки, почему так устроено (из контента)      │
  ╰────────────────────────────────────────────────────────────────╯
MOBILE
  ╭──────────────────────╮
  │ h1 Build a pet        │
  │ ╭ stage ───────────╮ │  (sticky top внутри секции при прокрутке опций)
  │ │     ◯ pet        │ │
  │ ╰──────────────────╯ │
  │ (Body)(Ears)(Eyes)→  │
  │ ◯ ◯ ◯ ◯              │
  │ [Randomize] Reset    │
  ╰──────────────────────╯
```

### 5.9 Contact (beauty-пасс)
```
DESKTOP
                       ▒▒ final iridescent object ▒▒
              Let's build something remarkable.   (Unbounded, center)
                     sofia@… (mono, selectable)
           [Email]  [Copy email]   Phone   GitHub ↗
MOBILE
     ▒ object (poster) ▒
  Let's build
  something remarkable.
  sofia@…
  [Email            ]
  [Copy email       ]
  Phone · GitHub ↗
```
Мобильные кнопки здесь на всю ширину контейнера — это допустимо (ширина по контейнеру, а не фиксированная px).

### 5.10 Страница кейса
```
DESKTOP
  ← All projects                                       ·CASE 02 / 07·
  ┌──────────── media 7col ──────────┐ ┌ inspector 5col ────────────┐
  │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  │ │ h1 Project title            │
  │                                  │ │ [● STATUS] platform         │
  └──────────────────────────────────┘ │ ROLE · STACK chips          │
                                       │ [Live ↗] [Repo ↗] (if any)  │
                                       └─────────────────────────────┘
  ·OVERVIEW·      текст prose 7col (колонки 1–7)
  ·MY ROLE·       текст
  ·PROCESS·       шаги / список (QA: что тестировалось; Game: механики)
  ·MEDIA·         галерея: 1 крупное + 2 мелких, разной высоты
  ·OUTCOMES·      (только подтверждённое; блок скрыт если нет)
  ─────────────────────────────────────────────────────────────────
  ← Prev: Metrocity                               Next: Sakhli →
MOBILE
  ← All projects
  ▒▒▒ media ▒▒▒
  h1 Title
  [● STATUS] platform
  ROLE …
  [chips]
  [Live ↗]
  [Repo ↗]
  ·OVERVIEW· …
  ·PROCESS· …
  ·MEDIA· (1 колонка, swipe не нужен)
  ← Prev
  Next →
```
Для `build-your-pet` кейс целиком в пастельной теме (Inspector variant `pet`), для Roblox — game-вариант с `--radius-game`.

---

## 6. Responsive & Localization rules

RU-тексты длиннее EN на 15–30%, Unbounded-кириллица шире. Вёрстка проектируется **под RU**, EN проверяется вторым.

1. **Никаких фиксированных ширин у текстовых контейнеров**: кнопки, чипы, табы, бейджи, пункты меню — ширина по содержимому + padding; запрещены `width: Npx`, `min-width` на кнопках, `text-overflow: ellipsis` и `line-clamp` для заголовков, названий, CTA и навыков. Обрезка допустима только для превью-описаний в карточках при наличии полного текста на странице кейса.
2. **Ряды действий** — `display: flex; flex-wrap: wrap; gap: 8px 16px`. На <480px кнопки складываются в столбец; текст кнопки `white-space: nowrap` (если CTA в RU не помещается в 328px — это ошибка контента, а не повод сжимать шрифт).
3. **Заголовки**: `text-wrap: balance`; `hyphens: manual`; переносы только по пробелам; для длинных составных слов автор контента может вставить `&shy;`. Hero-имя — каждое слово на своей строке, `white-space: nowrap` на слово; проверка на 360px: `STETSIUK` / `СТЕЦЮК` в `--text-hero` должно помещаться в 328px (иначе — RU/EN-override min-значения clamp).
4. **Абзацы**: `hyphens: auto` (работает, т.к. `<html lang>` = локаль), `overflow-wrap: break-word`, `text-wrap: pretty`, ширина ≤ `--container-prose`.
5. **Mono uppercase-метки** (`+0.08em`): разрешён перенос на 2 строки; в RU длина HUD-метки ≤ 24 символов — ограничение для контента.
6. **Навигация**: пункты desktop-nav ≤ 12 символов RU (например «Навыки», «Лаборатории» — на грани, проверять на 1024px); если RU-nav не помещается на 1024 — переключать на бургер до 1280 для обеих локалей (одно правило, без условной логики по языку).
7. **Grid-колонки в инспекторах**: `grid-template-columns: max-content 1fr` для пар «ключ–значение», ключ ≤ 12 символов, значения переносятся. На <768 — ключ над значением.
8. **Таблица Skills**: `min-width: 0` у ячеек, заголовки проектов — сокращения из контента (`short` поле) + полное имя в `<abbr title>`/sr-only; <1024 таблица превращается в список, горизонтальный скролл страницы недопустим.
9. **Брейкпоинты**: 360 (минимум, тестовая база) · 768 (2 колонки, инспектор ещё стопкой) · 1024 (desktop-nav, асимметричные композиции, Showroom list справа) · 1440 (max-width, дальше только поля растут). Ничего не ломается между ними: проверка на 360/390/768/1024/1280/1440/1920.
10. **Числа/даты/телефоны** — через `Intl` по локали; телефон в тексте не переносится (`white-space: nowrap`).
11. **Тексты в изображениях запрещены** (кроме реальных скриншотов проектов) — всё локализуемое живёт в `src/content/{en,ru}`.
12. Ключи контента одинаковы для обеих локалей; отсутствующий RU-перевод — fallback на EN с `lang="en"` на элементе (не пустая строка).

---

## 7. Accessibility

Цель — WCAG 2.1 AA.

**Фокус и клавиатура**
- Видимый фокус у всего интерактивного: `:focus-visible { outline: var(--ring); outline-offset: var(--ring-offset) }` (фиолет 7.0:1 на bg; на Pet — `--pet-accent-text` ≥ 4.5 на pet-bg/pet-surface). Фокус не перекрывается sticky-header: `scroll-margin-top: calc(var(--header-h) + 16px)` на секциях и фокусируемых элементах.
- Порядок Tab = визуальный порядок; асимметричные раскладки делаются CSS-порядком колонок, а не `order`, ломающим DOM-последовательность.
- Skip-link → `<main id="content">`. Каждая секция — `<section aria-labelledby>` с h2 (h1 — только имя в Hero; на странице кейса h1 — название проекта).
- Составные виджеты (radiogroup, tablist): roving tabindex — один Tab-стоп на группу, стрелки внутри, Home/End.
- Хит-зоны ≥ 44×44 на touch (24×24 минимум на desktop для плотных HUD-контролов, с отступами).

**3D (Showroom, Hero, Contact)**
- Canvas — `role="img"` с `aria-label` из контента (что за модель) **или** `aria-hidden="true"`, если рядом есть текстовая подпись; canvas не фокусируется.
- Drag-вращение всегда дублируется кнопками: `Rotate left/right` (±15°), `Zoom in/out`, `Reset view`, `Pause/Play auto-rotate`. Горячие клавиши, когда фокус внутри Showroom: ←/→ вращение, +/− зум, R — сброс, Space — пауза (описаны в tooltip и визуально скрытой инструкции `aria-describedby`).
- Колесо мыши **не** зумит без фокуса/клика на сцене (не перехватывает скролл страницы); на touch одиночный палец скроллит страницу, вращение — внутри явной drag-зоны или кнопками.
- Смена модели/пасса объявляется `aria-live="polite"`: «Clay pass / Пасс: глина».

**Переключатель языка** — см. 4.2: ссылки с `lang`, `hreflang`, `aria-label` на родном языке, `aria-current="true"` у активной; группа `<nav aria-label>`. После смены языка фокус остаётся на переключателе (новая страница — фокус на него же через query-параметр не нужен: достаточно, что он первый в шапке после skip-link и логотипа).

**Reduced motion** (`@media (prefers-reduced-motion: reduce)`)
- Scroll-scrub пассов → дискретная смена состояния секции без перехода.
- 3D → статичный постер текущего пасса; idle-вращение и парение отключены; Showroom-кнопки меняют постер (а при наличии WebGL — мгновенные повороты без интерполяции).
- Stagger, clip-path re-render, overshoot `--ease-soft` → простая смена opacity ≤ 150ms или мгновенно.
- `scroll-behavior: auto` вместо smooth.
- Пользовательский тоггл не нужен (YAGNI) — системной настройки достаточно.

**No-WebGL / ошибка контекста**
- Проверка `WebGL2RenderingContext` + обработка `webglcontextlost`; при отсутствии — `<picture>` постеры (wire/clay/final) того же объекта, Showroom превращается в галерею постеров с тем же pass switcher и списком моделей; контролы вращения не рендерятся (не disabled).
- Подпись `3D preview unavailable in this browser — showing images / 3D недоступно в этом браузере — показаны изображения` в моно `--text-2`.
- Весь контент сайта доступен без 3D и без JS (кроме интерактивов playground, где без JS показывается статичное описание + скриншот).

**Контраст** (значения из 1.2)
- Основной текст `--text` / вторичный `--text-2` — везде; `--text-3` только на `--bg`/`--surface-1` и только для подписей ≥ 12px.
- Primary-кнопка: белый на `--qa-accent-fill` 4.7:1; hover `--qa-accent-fill-hover` темнее fill, поэтому контраст только растёт.
- Не-текстовые элементы (рамки инпутов, иконки контролов, фокус) ≥ 3:1: рамки интерактивных элементов используют `--text-3`/`--qa-accent`, а не `--line` (`--line` — только декоративные разделители).
- Pet-остров: текст `--pet-ink`/`--pet-ink-2`, ссылки `--pet-accent-text`; пастели — только фоны.
- Severity и статусы — всегда цвет + форма + текст.
- Disabled-элементы освобождены от контраста по WCAG, но их **подпись-причина** — `--text-2` (≥ 4.5).

**Прочее**
- Изображения проектов — `alt` из контента (что изображено), декоративные — `alt=""`.
- Внешние ссылки предупреждают о новой вкладке.
- Формы QA Playground: `<label>` у каждого поля, ошибки через `aria-describedby` + `aria-invalid`.
- Тосты не уводят фокус; модальных окон, кроме мобильного меню, нет.

---

## 8. Motion spec

Значения согласованы с 1.5. Все переходы — только `transform`, `opacity`, `clip-path`, `stroke-dashoffset`.

### 8.1 Токены
| Токен | Значение |
|---|---|
| `--dur-micro` | 150ms (диапазон 120–180) |
| `--dur-comp` | 300ms (диапазон 240–360) |
| `--dur-page` | 480ms (переход страницы/кейса) |
| `--ease-precise` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-soft` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| spring default | `{ stiffness: 170, damping: 22, mass: 1 }` |
| spring pet «плюх» | `{ stiffness: 320, damping: 14, mass: 0.8 }` |
| spring 3D camera | `{ stiffness: 120, damping: 26 }` (без overshoot) |
| stagger | 40ms (QA) / 60ms (Game), ≤ 6 элементов |

### 8.2 По компонентам
| Компонент | Триггер | Анимация | Длит. | Easing |
|---|---|---|---|---|
| Nav link | hover | underline `scaleX 0→1`, origin left | 180ms | precise |
| Header | scroll > 8px | фон transparent→bg, линия opacity 0→1 | 150ms | precise |
| EN/RU gizmo | switch | `translateX` + `scaleX` рамки; ручки +60ms | 180ms | precise |
| Locale re-render | после смены языка | заголовки `clip-path inset(0 100% 0 0)→inset(0)`, stagger 40ms | 240ms | precise |
| Burger icon | toggle | линии → крест (`rotate ±45°`, `translateY`) | 180ms | precise |
| Mobile menu | open / close | `clip-path` сверху вниз; пункты `translateY(8px)→0`+opacity, stagger 40ms | 320ms / 200ms | precise / out |
| Button primary | hover | HUD-скобки `opacity 0→1`, `translate(±2px)→0` | 150ms | precise |
| Button | active | `scale(0.98)` | 80ms | precise |
| Button Pet | hover | `scale(1.03)` | 180ms | soft |
| Project Inspector web | in-view (один раз) | рамка медиа рисуется `stroke-dashoffset 100%→0`, затем callouts | 360ms + 240ms | precise |
| Project Inspector web | hover | callout-линии дорисовываются | 300ms | precise |
| Project Inspector roblox | in-view | `translateY(24px)→0`, opacity 0→1 | 480ms | out |
| Project Inspector roblox | hover | `translateY(-4px) rotate(-2deg)` | 240ms | soft |
| HUD-label / callout | in-view | линия от точки к метке (`scaleX`), метка opacity | 240ms | precise |
| Status badge / chip | — | без анимации | — | — |
| Showroom pass switch | click | материал: crossfade шейдер-юниформом `uMix 0→1` | 400ms | out |
| Showroom model switch | click | текущая модель `scale 1→0.9 + opacity→0` 160ms, новая — spring default | ~500ms | spring |
| Showroom rotate/zoom кнопки | click | spring 3D camera к целевому углу | ~400ms | spring |
| Showroom idle | постоянно | вращение 360° за ≥ 24s, парение ±4px период 8s | ∞ | linear / sine |
| Bug card expand | click | `grid-template-rows 0fr→1fr` + контент opacity +60ms | 300ms | precise |
| Bug found | событие | severity-полоса `scaleY 0→1` origin top; callout в demo UI | 240ms | precise |
| Agent node | select | рамка → accent; поток по связям `stroke-dashoffset` цикл 1.2s (только активная) | 150ms / 1.2s loop | precise / linear |
| About node | select | точка едет по сплайну (`offset-distance`) к узлу | 480ms | out |
| Pet option | select | слот `scale 0.9→1` soft; предмет на питомце: падение `translateY(-24px)→0` + squash `scaleY 0.85 / scaleX 1.1 → 1` | 360ms | spring pet |
| Pet randomize | click | все слоты по очереди, stagger 60ms (≤ 6) | ≤ 700ms | spring pet |
| Toast | in / out | `translateY(16px)→0` + opacity / opacity→0 | 240ms / 160ms | out / precise |
| Tooltip | in / out | opacity + `translateY(4px)→0`, задержка 400ms (hover) / 0 (focus) | 150ms / 100ms | precise |
| Copy email icon | success | `⧉`→`✓` crossfade, возврат через 1.5s | 150ms | precise |
| Page → case | навигация | View Transitions API: медиа инспектора морфится в hero кейса; без поддержки — обычный переход | 480ms | out |

### 8.3 Scroll-переход между стадиями
Каждая секция несёт `data-pass` = `wire | debug | clay | shaded | beauty | pastel`. Карта (из 1.4):

| Секция | data-pass | `--grid-opacity` | `--hud-opacity` | Цвет |
|---|---|---|---|---|
| hero | wire | 1 | 1 | фиолет |
| projects (web) | debug | 1 | 1 | фиолет |
| projects (roblox) | clay → shaded | 1 → 0 | 1 → 0.4 | pink/sky появляются |
| showroom | shaded | 0 | 0.4 | по модели |
| about / skills | debug-light | 0.4 | 0.6 | точечно |
| ai-lab | debug-light | 0.6 | 0.8 | фиолет |
| qa-playground | debug | 1 | 1 | severity |
| game-playground / build-your-pet | pastel | 0 | 0 | пастель |
| contact | beauty | 0 | 0 | iridescent только на 3D |

**Реализация (по возрастанию сложности, брать первое работающее):**
1. **CSS scroll-driven animations** (основной путь): переходная зона — последние 30% секции + первые 30% следующей. `animation-timeline: view(); animation-range: exit 70% exit 100%` для анимации `--grid-opacity`/`--hud-opacity` (зарегистрированных через `@property` как `<number>`), `animation-timing-function: linear` (scrub — плавность даёт сам скролл).
2. **Fallback** (без `animation-timeline`): IntersectionObserver (порог 0.4) ставит `data-active-pass` на `<body>`; переменные меняются через `transition: 600ms var(--ease-out)` — дискретно, но мягко.
3. **3D-объект** читает тот же прогресс (один `useScroll`-подобный хук, нормированный 0–1 на зону) и интерполирует `uMix` между материалами пассов; на мобильных — переключение постеров по IntersectionObserver.

**HUD «отпускает» объект** (не fade в никуда): при уходе `--hud-opacity` к 0 callout-линии `scaleX → 0` к точке привязки, размерные линии bbox стягиваются к углам (`scale` от угла), метки уезжают на 8px к ближайшему краю — всё в той же scrub-зоне.

**Reduced motion:** анимации таймлайна отключены, `data-pass` применяется мгновенно (без transition), 3D — постер.

**Hero-интро** (единственная не-scrub анимация секций, суммарно ≤ 1200ms, контент доступен и кликабелен с 0ms):
0ms — сетка рисуется (`scaleY` колонок, stagger 40ms ×6) 400ms · 200ms — bbox вокруг имени `stroke-dashoffset` 480ms · 300ms — имя `clip-path` reveal 480ms · 600ms — HUD-метки opacity 240ms · 700ms — wireframe-объект fade-in 500ms.
