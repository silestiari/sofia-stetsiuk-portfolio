# REDESIGN UX SPEC — «Editorial Cyber Mono»

Источник стиля: `docs/reference-pinterest.jpg`. Документ — предписание для фронтенда, код не меняет.
Базовые правила `DESIGN_SYSTEM.md` (контент из `src/content` + `src/messages`, WCAG AA, reduced motion,
фолбэк без WebGL, «недоступное не выглядит кликабельным») остаются в силе; здесь — только то, что меняется.

Что берём из референса:

| Черта референса | Как переносим |
|---|---|
| Чёрный монохром, серые плашки | Нейтральная (не синеватая) шкала серых, почти чёрный фон |
| Гигантские extended-капсы («GRAPHICS DESIGN —») | Unbounded 700, uppercase, новый токен `--text-display` |
| Тонкая сетка-перекрестье + крошечные подписи | Компонент `Crosshair` + существующий `HudLabel` |
| Таблетки-обводки (теги, навигация, «MORE UPDATES») | Все кнопки, теги, сегменты → `rounded-full` |
| Одна сплошная салатовая таблетка («Catalog») | Токен `--color-signal`, ровно ОДНА кнопка на сайте (Hero) |
| Круглый аватар с белой обводкой | Компонент `Avatar` в About |
| Bento-сетка медиа без скруглений | Медиа и панели — `rounded-none`; bento на странице кейса |
| Кинетическая лента огромного шрифта («3D TYPE») | Одна `MarqueeBand` между Showroom и About |
| Мелкий светлый body-текст | 14–15px Manrope 300/400, но только с контрастным цветом |

Референс — 16-секундное видео (`docs/reference-pinterest.mp4`, кадры `docs/reference-pinterest-frames.png`).
Верхняя панель прокручивает сайт из 4 экранов, нижняя — статичный bento + лента. Перенос экранов:

| Экран видео (сек) | Что там | Куда у нас |
|---|---|---|
| 0–2, 12–13: hero | ч/б портрет, хайрлайн-перекрестья, крошечные подписи, «CYBER SECURITY», пилюльная nav, салатовая таблетка, круг справа | Hero (4.1) |
| 3–6: services | тонкий заголовок «VigilByte» слева, полоска тонких табов сверху, справа 2 высокие карточки-картинки с номерами 01/02 | Projects: ряд высоких нумерованных карточек (3.7a, 4.2) |
| 7–9: team | крупный светлый (не капс) заголовок по центру, ряд маленьких круглых аватаров с именем/ролью, большой хромированный шар в круге справа | About (4.5) |
| 10: footer | почти пустой: ряд мелких иконок соцсетей, колонки мелкого текста, © | Footer (4.10) |
| 11: переход | RGB-split глитч, возврат к hero | Одноразовый глитч на «release ready» в BugHunt (3.13, P2) |
| нижняя половина | «GRAPHICS DESIGN —», аватар-блок, bento, «3D TYPE» | заголовки секций, Avatar, bento кейса, MarqueeBand |

Вывод для типографики: в референсе ДВА голоса заголовков — гигантский широкий КАПС («CYBER SECURITY», «GRAPHICS DESIGN»)
и крупный тонкий mixed-case («VigilByte», «Safeguarding Your Digital Frontier»). У нас: капс — заголовки секций,
тонкий — лид-высказывания (`--text-statement`, 1.2).

Розовый `#F58FBA` остаётся главным акцентом (фокус, активные состояния, primary-кнопка, баги в игре).
Салатовый — одноразовый «сигнал», не второй акцент.

Не берём: размытые/blur-эффекты, фото-модели, вымышленные подписи референса («Our service», «Instagram account update»).
Все подписи — из messages, факты — только подтверждённые.

---

## 1. Токены (правка `src/app/globals.css`, имена сохраняем — меняем значения)

### 1.1 Цвета

Имена токенов не меняются → компоненты, использующие `bg-bg`, `text-text-2`, `border-line`, перекрашиваются сами.

| Токен | Было | Стало | Контраст / назначение |
|---|---|---|---|
| `--color-bg` | `#0D0E11` | `#0A0A0A` | фон страницы |
| `--color-surface-1` | `#15171C` | `#121212` | плашки, карточки |
| `--color-surface-2` | `#1D2027` | `#1C1C1C` | вложенные плашки, активный сегмент в тёмной теме |
| `--color-line` | `#2A2E37` | `#2B2B2B` | декоративные разделители (не UI-границы) |
| `--color-grid` | `rgb(236 238 242/.06)` | `rgb(255 255 255/.07)` | волосяная сетка |
| `--color-grid-strong` | `.14` | `rgb(255 255 255/.18)` | перекрестья, callout-линии |
| `--color-text` | `#ECEEF2` | `#F2F2F2` | 18.6:1 на bg |
| `--color-text-2` | `#A4AAB5` | `#A6A6A6` | 8.1:1 на bg, 7.5:1 на surface-1 |
| `--color-text-3` | `#7D8390` | `#808080` | 5.0:1 на bg, 4.7:1 на surface-1; **не на surface-2** (4.4:1) |
| `--color-qa-accent` | `#F58FBA` | без изменений | 9.0:1 на bg |
| `--color-on-accent` | `#0D0E11` | `#0A0A0A` | текст на розовом, 9.0:1 |
| **новый** `--color-signal` | — | `#D4FF3A` | салатовая таблетка; 16.7:1 с `on-signal` |
| **новый** `--color-signal-hover` | — | `#E2FF75` | hover сигнала |
| **новый** `--color-on-signal` | — | `#0A0A0A` | текст на салатовом |
| **новый** `--color-ui-border` | — | `#6E6E6E` | обводки интерактивных таблеток: 3.9:1 на bg (≥3:1 non-text, WCAG 1.4.11) |

Правила:
- Салатовый ≠ «pass». `--color-status-pass #5ED39A` (мятный) остаётся для статусов/«fixed ✓» в игре; салатовый никогда не означает статус.
- Цвета `game-*`, `sev-*`, `pet-*` не трогаем.
- Обводка ЛЮБОГО интерактивного контрола — `--color-ui-border` или светлее. `--color-line` (#2B2B2B, 1.4:1) — только для декоративных разделителей и статичных контейнеров.

### 1.2 Типографика

Шрифты не меняем: Unbounded уже широкий (extended) гротеск — это и есть «GRAPHICS DESIGN» из референса. Новых зависимостей нет.

Добавить в `@theme`:

```css
--text-display: clamp(2.5rem, 1rem + 6.5vw, 7.5rem);   /* 40px@360 → 120px@1440: заголовки секций */
--text-display--line-height: 0.95;
--text-display--letter-spacing: -0.01em;               /* Unbounded в капсе не сжимать сильнее */
--text-marquee: clamp(4rem, 2rem + 9vw, 11rem);        /* лента */
--text-marquee--line-height: 1;
--text-statement: clamp(1.75rem, 1.1rem + 2.8vw, 3.5rem); /* «Safeguarding Your Digital Frontier»: тонкий mixed-case */
--text-statement--line-height: 1.15;
```

Высказывание (statement): `font-sans text-statement font-light text-text` (Manrope 300, белый — правило лёгкого веса ниже соблюдено).
Используется максимум 1 раз на секцию: About-лид, Projects-лид, Contact-интро.

| Роль | Класс | Шрифт |
|---|---|---|
| Имя в Hero | `font-display text-hero font-bold uppercase` | Unbounded 700 |
| Заголовок секции (h2) | `font-display text-display font-bold uppercase` | Unbounded 700 |
| Заголовок карточки / кейса | `font-display text-h2 font-semibold uppercase` | Unbounded 600 |
| Подзаголовок h3 | `font-display text-h3 font-medium uppercase` | Unbounded 500 |
| Лид | `text-lead font-light text-text` | Manrope 300 |
| Body | `text-body text-text-2` (400) | Manrope |
| Мелкий «журнальный» текст | `text-small font-light text-text` | Manrope 300 |
| Метки, таблетки, HUD | `hud text-mono-xs` (уже: mono, uppercase, tracking .08em) | JetBrains Mono |

Правило лёгкого веса: `font-light` (300) — только с `text-text` и только ≥14px. Серый `text-2/3` — минимум 400.
Тонкий штрих серым по чёрному визуально проваливает контраст, даже если формула проходит.

RU-правка hero (`:lang(ru)`) удаляется: имя в обеих локалях латиницей (`SOFIA / STETSIUK`), уменьшать нечего.
Для `--text-display` под `:lang(ru)` добавить: `--text-display: clamp(2.25rem, 0.9rem + 6vw, 6.75rem);` (см. 5.5).

### 1.3 Радиусы

| Токен | Значение | Где |
|---|---|---|
| `--radius-none` | 0 | медиа, карточки, панели, диалог, кадры Hero |
| `--radius-full` | 9999px | все кнопки, теги, сегменты, nav, аватар, круглые icon-кнопки |
| `--radius-game`, `--radius-pet*` | без изменений | ТОЛЬКО остров Pet Builder (исключение, см. 3.7) |
| `--radius-qa`, `--radius-qa-panel` | → 0 | перестают использоваться в тёмной части сайта |

Правило формы: **прямоугольник = контент, таблетка = действие или метка, круг = персона или icon-действие.**

---

## 2. Сетка, отступы, брейкпоинты

### 2.1 Сетка (уже в коде — подтверждаем)

| Брейкпоинт | Ширина | Колонки | Гаттер `--gutter` | Поля `--page-margin` |
|---|---|---|---|---|
| base | 360–767 | 4 | 16px | 16px (clamp) |
| `md` | 768–1023 | 8 | 24px | 31–41px |
| `lg` | 1024–1439 | 12 | 24px | 41–58px |
| `xl` | ≥1440 | 12 | 24px | 64px |

- Max width контента: `--container-page: 90rem` (1440) через `.page-container`.
- Тестовые ширины: **360, 390, 768, 1024, 1440** (+ 1920 визуально: контент центрирован, лента и сетка на всю ширину).
- Вертикальные колонны `.pass-section::before` остаются — это и есть волосяная сетка референса. Добавляем горизонтали только внутри `Crosshair`, не глобально.

### 2.2 Шкала отступов

Шаг 8px (Tailwind `--spacing: 4px`, используем только чётные множители).

| Токен-роль | px | Tailwind |
|---|---|---|
| inline в таблетке | 8 | `gap-2` |
| между таблетками | 8 | `gap-2` |
| внутри карточки | 16 / 24 | `p-4` / `p-6` |
| метка → заголовок | 16 | `mt-4` |
| заголовок → лид | 24 | `mt-6` |
| блок → блок внутри секции | 48 / 64 | `mt-12` / `mt-16` |
| между проектами | 80 / 128 | `gap-20` / `lg:gap-32` |
| секция (вертикаль) | `--section-y`: 96→200 | `py-(--section-y)` |

Убрать произвольные `mt-10`, `mt-20`, `mt-28` при переписывании: только 2,4,6,8,12,16,20,24,32.

---

## 3. Компоненты

Общие состояния для всех интерактивных элементов:

| Состояние | Правило |
|---|---|
| default | видимая обводка `ui-border` ИЛИ заливка — у интерактивного всегда есть граница/заливка |
| hover (`@media (hover:hover)`) | меняется 1 свойство: обводка → `text`, или заливка → `*-hover`; 150ms `ease-precise` |
| focus-visible | глобальный `outline: 2px solid qa-accent; outline-offset: 3px` — уже в `globals.css`, работает со скруглением |
| active | `scale: 0.98` (уже `.btn:active`) |
| disabled | `aria-disabled="true"` (не `disabled`, если нужен тултип), пунктирная обводка `line`, текст `text-3`, `cursor-default`, без hover и без стрелки ↗/→ |
| loading | `aria-busy`, «···» перед текстом (уже есть) |

### 3.1 Button (`src/components/ui/Button.tsx` + `.btn*` в `globals.css`)

Все варианты — таблетки, `h-12` (md) / `h-11` (sm). **Размер `h-10` удалить** — он ниже 44px.

| Вариант | Классы (итог) | Когда |
|---|---|---|
| `signal` (новый) | `btn btn-signal h-12 px-6 rounded-full bg-signal text-on-signal` | ровно один раз: Hero «Explore my work» |
| `primary` | `btn btn-primary h-12 px-6 rounded-full bg-qa-accent-fill text-on-accent` | главная кнопка блока (Contact «Email», «Open case») |
| `secondary` | `btn btn-secondary h-12 px-6 rounded-full border border-ui-border text-text` | вторичные действия, внешние ссылки |
| `ghost` | `btn btn-ghost h-11 px-0 text-qa-accent underline underline-offset-4` | inline-ссылки, телефон, GitHub в строке |

Типографика кнопки: `text-small font-semibold uppercase tracking-[0.04em]`. В RU капс шире — проверка 5.5.

Иконка-хвост: `→` для внутренних, `↗` для внешних (внешняя уже добавляет ↗ + sr-only «opens in new tab»).
Hover: хвост `translate-x-0.5` (через `.btn > [aria-hidden]:last-child`), `transition-transform 150ms`.

CSS-изменения:
- `.btn { border-radius: var(--radius-full); text-transform: uppercase; letter-spacing: .04em; }`
- Удалить `.btn-primary::after` (HUD-уголки) — с таблеткой не сочетаются.
- `.btn-signal` по образцу `.btn-primary` (hover → `--color-signal-hover`, disabled → как primary).
- `.btn-secondary:hover { border-color: var(--color-text); }` (было — розовый; розовый оставляем только фокусу и активному).
- Disabled-стили не меняются, только радиус.

### 3.2 Tag / chip (`TechChip.tsx`, `StatusBadge.tsx`)

Статичная метка (не кнопка):
```
hud text-mono-xs inline-flex h-7 items-center gap-1.5 rounded-full border border-line px-3 text-text-2
```
- Статичный тег НЕ получает `ui-border`, hover, cursor-pointer — граница `line` (тусклая) сигнализирует «не кликается».
- `StatusBadge`: та же таблетка, цвет статуса на обводке и тексте (иконка ●◐◇○ остаётся — не только цвет).

Тег-переключатель (`TechChip pressed`, фильтр навыков):
```
default:  h-9 (+ hit-area до 44, см. 3.10) rounded-full border border-ui-border px-3 text-text-2 cursor-pointer
hover:    border-text text-text
pressed:  bg-text text-bg border-text  + «✓»
focus:    глобальное кольцо
```
Pet-вариант без изменений.

Таблетка-примечание (дисклеймер проектов, как «Realizado por…» в референсе):
```
inline-flex gap-2 rounded-3xl border border-line px-4 py-2 text-small text-text-2
```
`rounded-3xl`, а не `full`: при переносе на 2 строки форма не ломается. Без иконки-кнопки, не кликается.

### 3.3 Segmented control (`ProjectFilter.tsx`, `ShowroomControls.tsx → Segmented`, `LanguageSwitcher.tsx`)

Один вид на весь сайт — «пилюли в пилюле», как «ACTUALIZACIONES / DINAMICAS / CLOSET».

```
group:   inline-flex flex-wrap items-center gap-1 rounded-full border border-ui-border p-1
item:    hud text-mono-xs relative h-9 rounded-full px-4 text-text-2
         before:absolute before:-inset-y-1 before:inset-x-0   ← hit-area 44px
hover:   text-text
checked: bg-text text-bg                                     ← сплошная белая таблетка
focus:   глобальное кольцо (на item, roving tabindex уже есть)
```

- Выбранный = белая заливка (не розовая), чтобы не спорить с primary-кнопкой и сигналом.
- `ProjectFilter` переписать на `useRovingRadio` (как `Segmented`) — сейчас там дублирующая логика клавиатуры. Это один компонент: лучше `ProjectFilter` рендерит `Segmented` и только выставляет `data-filter` в `onChange`.
- На 360px группа из 4 фильтров RU («Все / Веб / Roblox / AI») влезает (≈300px); если нет — `flex-wrap` с `rounded-3xl` у группы.
- `LanguageSwitcher`: та же группа, `h-11` общая высота (p-1 + h-9 item).

### 3.4 Header / nav (`Header.tsx`, `MobileMenu.tsx`, `globals.css .site-header/.nav-link`)

Референс: логотип слева, центральная «Home Explore Service», справа таблетка «Catalog» + круглая иконка, бургер из двух линий.

Desktop ≥1024:
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ SS_        ( 01 Projects · 02 3D Showroom · 03 About · 04 Skills · 05 Labs )      │
│                                               [EN|RU]  ( CONTACT )(↗)            │
└──────────────────────────────────────────────────────────────────────────────────┘
 h-16, page-container, hairline снизу после 8px скролла (уже есть)
```
- Nav — `Segmented`-подобная группа, но это ссылки, не radiogroup: `<ul class="flex gap-1 rounded-full border border-line p-1">`, ссылка `h-9 rounded-full px-4 hud text-mono-xs text-text-2`, hit-area через `before:-inset-y-1`.
- Активная секция (`aria-current="true"`): `bg-surface-2 text-text` + индекс `text-qa-accent`. Подчёркивание `.nav-link::after` удалить.
- Обводка группы — `line` (это контейнер, не контрол), у самих ссылок обводки нет, но есть hover `text-text bg-surface-1` — достаточно, т.к. текст ссылки сам по себе аффорданс в навигации.
- «Contact» = связка «Catalog»: `secondary` таблетка `h-11` + примыкающий круг `size-11 rounded-full border border-ui-border` с `↗`. Это ОДНА ссылка: круг — `<span aria-hidden>` внутри той же `<a>`, `gap-1`. Не делать два таба на одно действие.
- Индексы `01…05` показывать только с `xl`; на `lg` — без индексов (RU «Лаборатории» длинная, см. 5.5).

Mobile <1024:
```
┌──────────────────────────────────────┐
│ SS_                  [EN|RU]   (═)   │   h-14
└──────────────────────────────────────┘
```
- Бургер — круг `size-11 rounded-full border border-ui-border`, две линии (как в референсе, уже две).
- Меню (`<dialog>`, уже доступно): пункты — `font-display text-h2 font-bold uppercase`, индекс `hud text-mono-xs` слева, разделители `border-line`. Активный пункт — розовый индекс + `→` справа.
- Низ меню: контакты как `secondary` таблетки в `flex-wrap gap-2` (сейчас ghost-ссылки — сделать таблетками, на тач-экране они понятнее).

### 3.5 Section label (`HudLabel.tsx`, `SectionShell.tsx`)

Формат «01 / PROJECTS» + волосяная линия + счётчик, как служебная строка журнала:

```
01 / PROJECTS ──────────────────────────────────────────── 01—07
```
```tsx
<div class="flex items-center gap-4">
  <HudLabel>01 / {label}</HudLabel>
  <span aria-hidden class="hud-line h-px flex-1 bg-grid-strong opacity-(--hud-opacity)" />
  <HudLabel aria-hidden>{index}—{total}</HudLabel>
</div>
<h2 class="mt-6 font-display text-display font-bold uppercase">…</h2>
```
- Счётчик `total` = `sections.length - 1` (Hero не считается). Индекс берётся из `sections.ts`, не хардкод.
- `SectionShell.headingClassName` по умолчанию → `font-display text-display font-bold uppercase`.
- Разделитель-тире после заголовка («DESIGN —» в референсе): опционально `after:content-['—']` только на `lg+`, aria-hidden по природе псевдоэлемента. P2.

### 3.6 Crosshair overlay (новый `src/components/ui/Crosshair.tsx`)

Волосяная рамка с «+» на пересечениях и крошечными подписями в углах. Декоративный, `aria-hidden`, `pointer-events-none`.

API (минимум):
```ts
Crosshair({
  rows?: number;      // горизонтальные деления внутри, по умолчанию 0
  cols?: number;      // вертикальные деления, по умолчанию 0
  labels?: { tl?: string; tr?: string; bl?: string; br?: string }; // тексты из messages
  className?: string;
})
```
Отрисовка:
- Контейнер `absolute inset-0 pointer-events-none text-grid-strong opacity-(--hud-opacity)`.
- Линии деления — фон через `linear-gradient` (как `.pass-section::before`), 1px `currentColor`.
- «+» — 4 угловых `<span>` 9×9px из двух 1px линий (`before`/`after`), смещение `-4px` наружу.
- Подписи — `HudLabel` в углах, `absolute`, отступ 8px от «+».
- Анимация появления — существующий `DrawFrame` (stroke-dashoffset), не новое.
- На base (<768) показывать только «+» и максимум 2 подписи (tl, br), линии деления скрыть.

Использование: кадр BugHunt в Hero, медиа web-проектов, hero-медиа кейса, сцена диалога Showroom, узлы AI Lab.
Не использовать: Contact, Pet Builder, лента.

### 3.7 Project card (`ProjectInspector.tsx`)

**Web (QA properties panel → editorial row)**
```
lg: 12 колонок, медиа 7 / инфо 5, чередование flip (уже есть)

┌──────────────── media (col 1–7) ───────────────┐  INSPECT / grand-mall-batumi
│+                                              +│
│        screenshot, rounded-none, bg-surface-1  │  GRAND MALL                  ← font-display h2 uppercase
│                                                │  BATUMI
│+                                              +│  subtitle — text-small font-light text-text
└────────────────────────────── [ W 1440 × H 900 ]┘
                                                    STATUS   ( ● Released )   ← StatusBadge-таблетка
                                                    PLATFORM  Web
                                                    STACK    (Next.js)(TS)(Playwright)(+3)
                                                    summary — text-body text-text-2, max-w-prose
                                                    ( OPEN CASE → )  ( Live site ↗ )
```
- Рамка медиа: `Crosshair` вместо `DrawFrame`-цвета на hover. Hover/focus-within карточки: «+» и линии → `text-qa-accent` (300ms).
- Заголовок-ссылка: hover — `underline decoration-1 underline-offset-8`. Это не единственная ссылка: кнопка «Open case» дублирует — оставить, но у ссылки-заголовка `tabindex=-1`? Нет: оставить обе фокусируемыми (две цели одной ссылки допустимы, голосовое управление выигрывает), как сейчас.
- «+N» в стеке — таблетка-`<summary>` с `border-ui-border` (она кликабельна), остальные теги — `border-line`.
- Инфо-колонка: `border-l border-line pl-6` (уже) — оставить, это и есть хайрлайн.

**Roblox (game preview → bento card)**
```
lg: медиа col 1–8, инфо-карта col 8–12, наезжает на медиа снизу (уже -mb-12)

┌──────────────────────── media 16:9, rounded-none ─────────────────┐
│ ( ◐ In development )                                (ROBLOX)      │  ← таблетки поверх медиа: bg-bg/80
│                                                                   │
│                                                     ┌─────────────┴──────────┐
└─────────────────────────────────────────────────────┤ WOODCUTTER             │
                                                      │ VS ZOMBIES             │
                                                      │ summary                │
                                                      │ (Lua)(Roblox Studio)   │
                                                      │ ( OPEN CASE → )        │
                                                      └────────────────────────┘
                                                        bg-surface-1 border border-line rounded-none
                                                        border-t-2 border-t-qa-accent
```
- Убрать `rotate-[-1deg]`, `group-hover:-rotate-2`, `shadow-game`, `rounded-game` — референс прямоугольный. Hover: медиа `scale-[1.02]` внутри `overflow-hidden` (300ms `ease-out`), карта не двигается.
- Акцент верхней кромки — всегда розовый; чередование pink/sky удалить (проп `accent` → удалить).
- Мобильная (<1024) — обе карточки одной колонкой: медиа → метки → заголовок → текст → теги → кнопки; кнопки `w-full` до 480px.

### 3.7a Tall numbered card (экран «services» видео, 3–6 с)

Высокая карточка с номером — для группы Roblox (и AI, если в ней ≥2 проекта). Web остаётся editorial-рядами 3.7:
web-скриншоты широкие, в высокий кадр их пришлось бы кропать.

```
┌──────────────┐
│ 01        ◐  │   номер: hud text-mono-xs text-text (вверху слева), статус-иконка справа
│              │
│   [ media ]  │   aspect-[3/4], object-cover, grayscale-[.6] → hover/focus: grayscale-0, scale-[1.02]
│              │
│              │
│ 01 ──────    │   номер повторно крупно: font-display text-h2 text-text/90 (как «02» в видео), aria-hidden
└──────────────┘
 WOODCUTTER VS ZOMBIES    ← font-display text-h3 uppercase, вне медиа
 (◐ In development)(Roblox)
 summary — text-small text-text-2, line-clamp-3
 ( OPEN CASE → )
```
- Вся карточка — `<article>`; ссылка на кейс — заголовок + кнопка (как в 3.7). Не делать всю карточку `<a>` с вложенными кнопками.
- Медиа: первый `image` проекта или `poster` видео; кроп `object-cover object-center`. Нет медиа → плашка `bg-surface-1` с `HudLabel previewUnavailable`, номер остаётся.
- Grayscale по умолчанию — приём видео (ч/б кадры); цвет возвращается на hover/focus-within. Reduced motion: без scale, grayscale меняется мгновенно. Без hover (тач): карточки в цвете (`@media (hover:hover)` вокруг grayscale).
- Номер — порядковый в группе (`i + 1`), из данных, не хардкод.
- Раскладка: `lg:grid-cols-3`, `md:grid-cols-2`, base — горизонтальный скролл-ряд `flex snap-x snap-mandatory overflow-x-auto gap-2` с карточками `w-[78%] shrink-0 snap-start` (видно край следующей = аффорданс скролла). Скролл-ряд — `role="list"`, фокус по Tab проходит карточки по порядку; полосу прокрутки не скрывать.

### 3.8 Bento media grid (страница кейса, `projects/[slug]/page.tsx`)

12 колонок на `lg`, 2 на `md`, 1 на base. `gap-2` (8px — плотная мозаика как в референсе). Без скруглений, фон `bg-surface-1`.

Спан по пропорции (`width/height` из `media.json`, функция в page.tsx, ~5 строк):

| Медиа | lg span | md span |
|---|---|---|
| первое (hero-кадр) | 12 | 2 |
| видео / `interactive` | 12 | 2 |
| ratio ≥ 1.6 (широкий) | 8 | 2 |
| 1.0 ≤ ratio < 1.6 | 6 | 1 |
| ratio < 1.0 (портрет, мобильные скрины) | 4 | 1 |
| нет размеров | 6 | 1 |

- `grid-flow-row-dense` чтобы закрывать дыры; элементы `self-start`; **картинки не кропать** (`object-contain`, натуральная высота) — на скриншотах QA-кейсов обрезанный UI = потерянный смысл.
- Каждая плитка — `figure` с подписью `HudLabel` под ней (`alt`/caption из media.json, если есть; если нет — подписи нет, не выдумывать).
- Угловые «+» (`Crosshair` без делений) — только у первой плитки.

### 3.9 Showroom card + dialog (`Showroom.tsx`, `ShowroomControls.tsx`)

Карточка:
```
┌+──────────────────+┐
│            (3D ↗)  │  ← таблетка bg-bg/80 border-line; hover/focus: border-qa-accent text-qa-accent
│      [poster]      │  aspect-square, object-contain p-3
│                    │
├────────────────────┤  border-t border-line
│ COTTON CLOUD PET   │  hud text-mono-xs text-text  (uppercase, truncate)
│ Pets               │  text-small font-light text-text-2 → (правило 1.2: font-normal для text-2)
└+──────────────────+┘
rounded-none border border-line bg-[radial-gradient(...surface-2→bg)]
hover: border-text-3, «+» по углам проявляются (opacity 0→1), постер scale-105 (уже)
focus-visible: глобальное кольцо + те же «+»
```
- Карточка — `<button>`, у неё `border-line` (#2B2B2B) недостаточно для non-text-контраста? Карточка распознаётся по постеру + бейджу «3D ↗» (бейдж — индикатор действия); обводку оставить `line`, но бейдж «3D ↗» — `border-ui-border`. Хинт «↗ click to open» над сеткой остаётся.
- Сетка: `grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5` (gap 12→8, плотнее).
- Фильтр групп — `Segmented` из 3.3.

Диалог (chrome):
```
┌──────────────────────────────────────────────────────────────────────┐
│ MODEL / 04 · BUILD YOUR PET                                     (✕)  │  hud-строка + круг size-11
│ COTTON CLOUD PET                                                     │  font-display text-h3 uppercase
│ 12 480 tris · 640 KB · source: pet.glb                               │  hud text-mono-xs text-text-2
├──────────────────────────────────────────────────────────────────────┤
│+                                       ( WIRE | CLAY | SHADED | FINAL)│  Segmented 3.3
│                                                                      │
│                         [ 3D stage / poster ]                        │  Crosshair rows=2 cols=2
│                                                                      │
│ (⟲)(⟳)(−)(+)(⌂)(❚❚)                                   ( GRID | STUDIO )│  IconButton → круги size-11
│+                                                                    +│
├──────────────────────────────────────────────────────────────────────┤
│ description — text-small text-text-2           ( Store ↗ ) ( Case → )│  secondary-таблетки, не ghost
└──────────────────────────────────────────────────────────────────────┘
rounded-none border border-line bg-bg; backdrop:bg-bg/90
```
- `IconButton`: `rounded-full border-ui-border bg-bg/70`, `aria-pressed=true` → `bg-text text-bg`.
- Без WebGL: постер + строка `hud text-sev-minor`? Нет — `text-text-2` с иконкой «◇ 3D unavailable — poster shown». Кнопки вращения/зума/пассов НЕ рендерятся (уже так: `live &&`) — недоступное не показываем.
- Ошибка загрузки: `role="alert"` полоса снизу, кнопка `secondary` «Retry» (уже).

### 3.10 Hit-area helper

Для таблеток с визуальной высотой < 44px (`h-9` сегмент, `h-7` нажимной тег) — расширение зоны нажатия без изменения вида:
```css
@utility hit-44 { position: relative; }
@utility hit-44 { &::before { content:""; position:absolute; inset:50% auto auto 50%; width:max(100%,44px); height:max(100%,44px); translate:-50% -50%; } }
```
(или inline `before:` как в `LanguageSwitcher` — использовать уже существующий приём, новый utility только если повторов ≥3). Соседние hit-area не должны перекрываться: `gap-1` у сегментов + `inset-x-0` по горизонтали.

### 3.11 Avatar (новый `src/components/ui/Avatar.tsx`)

```
   ╭─────────╮
  ╱  ╭─────╮  ╲      внешнее кольцо: 2px solid text (#F2F2F2)
 │   │ img │   │     зазор 4px (padding) цвета bg
  ╲  ╰─────╯  ╱      size: base 112px, lg 144px; rounded-full overflow-hidden
   ╰─────────╯
```
- `<img>` с `alt` из profile; если фото нет — монограмма «SS» `font-display text-h2` на `bg-surface-1` + 4 «+» вокруг (Crosshair-углы).
- **Фото в репозитории нет — не подтверждено.** Нужен файл от владельца → `public/media/profile/avatar.webp` (512×512) и поле `profile.avatar` в `src/content/profile.ts`. До этого — монограмма. Не подставлять сток/AI-портрет.

### 3.12 Marquee band (новый `src/components/ui/MarqueeBand.tsx`)

```
═══════════════════════════════════════════════════════════════════════════ border-y border-line
 QA × GAME DESIGN × 3D × AI × QA × GAME DESIGN × 3D × AI × QA × GAME DES…   ← ряд 1, сплошной text-text
 …N × 3D × AI × QA × GAME DESIGN × 3D × AI × QA × GAME DESIGN × 3D × AI ×   ← ряд 2, контурный, обратное направление
═══════════════════════════════════════════════════════════════════════════
font-display text-marquee font-bold uppercase whitespace-nowrap, full-bleed (вне page-container)
```
- Текст — один ключ `marquee` в `src/messages/{en,ru}.json` (по умолчанию одинаковый латинский «QA × GAME DESIGN × 3D × AI ×» — это термины; RU-версию решает контент-агент). Повтор ×4 в разметке.
- Ряд 2 — контур: `text-transparent [-webkit-text-stroke:1px_var(--color-text-3)]`. Знаки «×» в ряду 1 — `text-qa-accent`.
- **Движение привязано к скроллу, не автоплей**: `animation: marquee linear both; animation-timeline: view(); animation-range: cover;` keyframes `translateX(0 → -25%)` (ряд 2 — наоборот). Двигается только когда пользователь сам скроллит → WCAG 2.2.2 (Pause/Stop/Hide) не срабатывает, кнопка паузы не нужна.
- Нет `animation-timeline` (Firefox без флага) → статичная лента. Reduced motion → статичная (правило уже глобальное, но завернуть keyframes в `@media (prefers-reduced-motion: no-preference)`).
- Целиком `aria-hidden="true"` — дублирует смысл Hero, скринридеру не нужен. Нет фокусируемых элементов внутри.
- Высота ленты ~2 × `--text-marquee` → не ставить её выше первого экрана (CLS не грозит — размер известен).

### 3.13 Glitch (экран 11 с, P2)

RGB-split из видео — только как одноразовое событие, не фоновая анимация:
- Где: кадр Hero в момент «All bugs fixed — release ready ✓» (BugHunt уже знает этот момент — `doneAt`).
- Как: 2 копии слоя со сдвигом ±3px в `#F58FBA` и `#6FC9FF` (`game-sky`), `mix-blend-mode: screen`, 240ms, 1 раз.
- Безопасность: ≤1 вспышки, без яркого белого мигания (WCAG 2.3.1 — ≤3 вспышек/с). Reduced motion — не играть.

### 3.14 Circle row (экран «team», 7–9 с)

Ряд маленьких кругов с подписью — «Meet our team» в видео. У нас команды нет → **не выдумываем людей**.
Используем для этапов Journey (About): круг = этап, подпись = название этапа + роль/год из `src/content/journey.ts`.
```
 (01)      (02)      (03)      (04)
 QA        GAME      3D        AI
 Testing   Design    Showroom  Workflow    ← label / title из journey.ts
```
- Круг `size-14 rounded-full border border-ui-border grid place-items-center hud text-mono-xs` — это кнопка выбора этапа (`JourneyPath` уже интерактивный): выбранный — `bg-text text-bg`, hover — `border-text`.
- Внутри круга — номер; картинок-аватаров нет (у этапов нет фото — не подставлять).

---

## 4. Wireframes по секциям

Обозначения: `( )` таблетка, `(●)` круг-кнопка, `+` перекрестье, `[ ]` медиа/canvas, `── ` хайрлайн, мелкий КАПС = `hud text-mono-xs`.

### 4.1 Hero (`Hero.tsx`, `HeroSceneSlot.tsx`, `BugHunt.tsx`)

Идея референса «CYBER SECURITY поверх кадра»: игра BugHunt — это «кадр», имя лежит поверх него снизу слева, круглая кнопка справа, салатовая таблетка в углу.

Desktop 1440:
```
 SS_          ( Projects · 3D Showroom · About · Skills · Labs )      [EN|RU] (CONTACT)(↗)
────────────────────────────────────────────────────────────────────────────────────────────
 00 / HOME                         BATUMI, GEORGIA                    REMOTE · ON-SITE · HYBRID
┌+──────────────────────────────────┼──────────────────────────────────┼──────────────────+┐
│ ( QA ENGINEER ) ( GAME DESIGNER )  │                                  │      BUGS 2/7    │
│ Testing experiences.               │        ✦ bug     ✦ bug            │                  │
│ Designing worlds.                  │                                  │    ╭────────╮    │
│ Building with AI.                  │              ✦                   │    │  3D    │    │
├────────────────────────────────────┼──────────────────────────────────┤    │GALLERY ↘│   │ ← круг 144px
│                                    │   ✦          BUG-004 · fixed ✓   │    ╰────────╯    │
│ SOFIA                              │                                  │                  │
│ STETSIUK                           │                  ✦               │                  │
│                                    │                                  │ (EXPLORE MY WORK)│ ← signal
+────────────────────────────────────┴──────────────────────────────────┴──────────────────+
 CATCH THE BUGS: CLICK THEM →                                          ( CONTACT ME → )  ← ghost→secondary
```
- Кадр: `relative h-[min(78svh,820px)] border border-line` внутри `page-container`; `Crosshair rows=1 cols=2 labels={{tl: hud, br: gameHint}}`.
- `BugHunt` canvas — `absolute inset-0` во весь кадр (сейчас — правая половина). Сетка `.hero-slot-grid` остаётся под canvas.
- h1 (имя): `absolute bottom-8 left-8 pointer-events-none font-display text-hero font-bold uppercase leading-[0.9]` — **`pointer-events-none` обязательно**, иначе имя перекрывает баги. Строки без `whitespace-nowrap`-риска: «STETSIUK» 8 знаков влезает от 360 (см. 5.5).
- Таблетки-роли — статичные метки 3.2 (не кликаются, `border-line`); значения из `subtitle` разбить в messages на два ключа `roleA`/`roleB` (или split по «×» — не делать, хрупко).
- Tagline — `text-lead font-light text-text max-w-[22ch]`, верхний левый блок, `pointer-events-none`.
- Круг «3D GALLERY ↘» = текущий `ctaGallery`: `<a href="#showroom" class="grid size-36 place-items-center rounded-full border border-ui-border bg-bg/60 text-center hud text-mono-xs">` hover: `border-text`, стрелка ↘ `translate 2px`. Это ссылка, не декор — 144px с запасом ≥44.
- Сигнал «EXPLORE MY WORK» — `Button variant="signal"`, `absolute right-8 bottom-8` в кадре.
- «Contact me» — вне кадра, `secondary`, справа под кадром. Локация/форматы — верхняя служебная строка `HudLabel`.
- Счётчик «BUGS 2/7» рисует canvas (уже) — правый верх.
- Порядок фокуса: h1 (tabindex=-1, не в цикле) → «Explore my work» → «3D gallery» → «Contact me». В DOM расположить в этом порядке, визуальное позиционирование — через absolute.

Mobile 390:
```
 SS_                    [EN|RU] (═)
──────────────────────────────────
 00 / HOME          BATUMI, GEORGIA
 ( QA ENGINEER ) ( GAME DESIGNER )
 Testing experiences. Designing
 worlds. Building with AI.
┌+──────────────────────────────+┐
│ CATCH THE BUGS        BUGS 0/7 │
│      ✦          ✦              │  aspect-[4/5], max-h-[62svh]
│            ✦                   │
│ SOFIA                     ✦    │
│ STETSIUK                       │  имя поверх, ~50px
+────────────────────────────────+
 (      EXPLORE MY WORK →      )   ← signal, w-full
 (       3D GALLERY ↘          )   ← на мобильном круг → обычная secondary-таблетка w-full
 (       CONTACT ME →          )
 REMOTE · ON-SITE · HYBRID · RELOCATION
```
- Tagline и роли выносятся НАД кадром (на 390 поверх игры они мешают тапам).
- Подсказка «Catch the bugs» на мобильном показывается (сейчас `hidden lg:block`) — в углу кадра, т.к. игра есть на всех размерах.
- Кадр мобильной высоты ≤62svh, чтобы кнопки попадали в первый экран на 390×844.

Fallback и motion:
- BugHunt — Canvas 2D, WebGL не нужен. Нет JS → сетка + имя + кнопки, игра просто не появляется.
- Reduced motion: баги стоят (уже), intro-анимации отключены (уже). «+» и линии без прорисовки.
- Canvas `aria-hidden` — игра декоративная; вся информация Hero доступна текстом. Клавиатурная игра — не делаем (P2-идея, не требование).

### 4.2 Projects (`Projects.tsx`, `ProjectInspector.tsx`, `ProjectFilter.tsx`)

Desktop:
```
 01 / PROJECTS ───────────────────────────────────────────────────────────────── 01—07
 PROJECTS                                             ( ALL | WEB | ROBLOX | AI )
                                                      ( i  Statuses are as of …  )  ← таблетка-примечание
 intro — text-lead font-light text-text, max-w-prose

 WEB / 03 ──────────────────────────────────────────────────────────────────────────
 [ web card 3.7 ]
 [ web card flip ]
 ROBLOX / 03 ───────────────────────────────────────────────────────────────────────
 Roblox            │ ( WORLDS · SYSTEMS · 3D · UGC )  ← тонкие табы-метки, как в видео (статичные, если не фильтр)
 games             │ ┌───────┐ ┌───────┐ ┌───────┐
 (statement, light,│ │01     │ │02     │ │03     │       ← tall numbered cards 3.7a
  col 1–4)         │ │[media]│ │[media]│ │[media]│
 короткое интро    │ │   01  │ │   02  │ │   03  │
 группы            │ └───────┘ └───────┘ └───────┘
                   │  TITLE     TITLE     TITLE
 AI / 01 ───────────────────────────────────────────────────────────────────────────
 [ web-variant card 3.7 ]   ← при 1 проекте высокие карточки не нужны
```
- Блок Roblox повторяет экран «services» видео: слева тонкий statement-заголовок группы (`text-statement font-light`, текст `groupRoblox` + опц. ключ `groupRobloxIntro` в messages), справа ряд высоких нумерованных карточек (`lg:col-span-8`).
- Полоска табов над карточками — показывать, только если у группы есть реальные подкатегории в данных; иначе не рисовать (не выдумывать категории).
- Карточка Roblox 3.7 (широкая bento) остаётся для страницы кейса; на главной Roblox = 3.7a.
- Заголовок группы: `HudLabel size="md"` + счётчик проектов группы (из данных, `list.length`) + `hud-line`.
- Фильтр справа от заголовка на `lg`, под интро на мобильном.

Mobile 390:
```
 01 / PROJECTS ────────── 01—07
 PROJECTS
 intro…
 ( ALL | WEB | ROBLOX | AI )
 ( i  Statuses are as of … )
 WEB / 03 ─────────────────────
 [ media + «+» по углам      ]
 INSPECT / grand-mall-batumi
 GRAND MALL BATUMI
 STATUS (● Released)
 STACK (Next.js)(TS)(+3)
 summary…
 (       OPEN CASE →        )
 (       Live site ↗        )
```

### 4.3 Showroom (`Showroom.tsx`)

```
 02 / 3D SHOWROOM ─────────────────────────────────────────────────── 02—07
 3D SHOWROOM                                       ( ALL | PETS | WORLD )
 intro…                                            ↗ CLICK A MODEL TO OPEN IT IN 3D
┌───────┐┌───────┐┌───────┐┌───────┐┌───────┐
│  3D ↗ ││  3D ↗ ││       ││       ││       │      xl: 5 колонок, gap-2
│ [img] ││ [img] ││       ││       ││       │      lg: 4, md: 3, base: 2
│ NAME  ││ NAME  ││       ││       ││       │
└───────┘└───────┘└───────┘└───────┘└───────┘
```
Mobile — 2 колонки, имя `truncate`, группа — второй строкой. Диалог на мобильном: `w-[calc(100%-1rem)] h-[92dvh]`, нижняя панель контролов переносится в 2 строки (`flex-wrap`), Segmented пассов уходит под заголовок (не поверх модели).

### 4.4 Marquee band — см. 3.12 и раздел 5.

### 4.5 About (`About.tsx`, `JourneyPath.tsx`, `Avatar.tsx`)

Как блок «GESTOREIM» референса: круг + капс-имя + мелкие строки + лёгкий текст.

Desktop:
```
 03 / ABOUT ───────────────────────────────────────────────────────────── 03—07
 ABOUT
┌─ col 1–5 ──────────────────────────────┐ ┌─ col 7–12 ─────────────────────────────┐
│ ╭──────╮  SOFIA STETSIUK                │ │ bio — text-lead font-light text-text   │
│ │  SS  │  QA ENGINEER × GAME DESIGNER   │ │ intro — text-body text-text-2          │
│ ╰──────╯  BATUMI, GEORGIA               │ │                                        │
│                                         │ │                                        │
│ (●GH) (●@) (●☎)  ← круги size-11        │ │                                        │
└─────────────────────────────────────────┘ └────────────────────────────────────────┘
 JOURNEY ────────────────────────────────────────────────────────────────────────────
 [ JourneyPath: стадии как пронумерованные колонки, хайрлайн между ними ]
 EDUCATION ───────────────────────  EXPERIENCE ──────────────────────
 │ title                             │ title
 │ provider                          │ context · points
```
- Имя — `hud text-mono font-medium text-text tracking-[0.12em]`, строки под ним — `hud text-mono-xs text-text-2`. Всё из `profile`/messages.
- Круги соцсетей: `<a class="grid size-11 place-items-center rounded-full border border-ui-border">` + `aria-label` (GitHub, Email, Phone) — только существующие в `profile.contacts`. Instagram/прочие — нет в данных → не добавлять.
- «Штрих-код» из референса — пропускаем (декор без смысла).
- `JourneyPath`: стадии-кнопки → `rounded-none border border-line`, выбранная `border-t-2 border-t-qa-accent`; ссылки «proof» → `secondary` таблетки `h-11`.

Вариант по экрану «team» видео (рекомендуемый, заменяет верхнюю часть схемы выше):
```
 03 / ABOUT ───────────────────────────────────────────────────────────── 03—07
                    Testing experiences,                         ╭───────────╮
                  designing worlds —                            ╱  ╭───────╮  ╲
                building with AI.                              │   │ chrome│   │  ← круг 320px, внутри постер
        (statement, centered, font-light, col 2–9)             │   │ model │   │    модели из Showroom
                                                                ╲  ╰───────╯  ╱    (реальный ассет)
 MEET THE PATH                                                   ╰───────────╯
 (01)   (02)   (03)   (04)   ← circle row 3.14 = этапы Journey     ( 3D SHOWROOM ↘ )
 QA     GAME   3D     AI
 [ детали выбранного этапа: text, proof-ссылки ]
 ─────────────────────────────────────────────────────────────────────────────
 ╭──╮ SOFIA STETSIUK · QA ENGINEER × GAME DESIGNER · BATUMI     (●GH)(●@)(●☎)   ← Avatar 64px-версия + круги
```
- Statement — существующий `profile.bio` НЕ годится (длинный); нужен короткий ключ `sections.about.statement` в messages (контент-агент; по смыслу = tagline Hero, без новых фактов).
- «Хромированный шар» → постер одной модели из `models.json` в круге `rounded-full overflow-hidden border border-line`, `object-contain p-8`, фон `radial-gradient(surface-2→bg)`. Это ссылка на `#showroom` (или открывает диалог модели — P2). Декоративный `alt=""`, ссылка с текстом-таблеткой под кругом. На base — 200px, под заголовком.
- Bio целиком — ниже, в блоке Journey/Education, `text-body text-text-2`.

Mobile 390: аватар 112px слева + имя справа в одну строку (`flex gap-4 items-center`), под ними круги, затем bio, Journey вертикальной линией (уже), затем Education/Experience одной колонкой.

### 4.6 Skills (`Skills.tsx`, `SkillsMatrix.tsx`)

```
 04 / SKILLS ──────────────────────────────────────────────────────────── 04—07
 SKILLS
 intro — «навыки показаны через проекты, без процентов»
 FILTER BY PROJECT  (GMB)(MCT)(SAK)(WVZ)(CAB)(PIL)(BYP)   ← TechChip pressed, 3.2
┌──────────────────────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ SKILL                    │ GMB │ MCT │ SAK │ WVZ │ CAB │ PIL │ BYP │  hud, border-b border-line
├──────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ TESTING  (h3 uppercase)  │                                         │
│ Test design              │  +  │     │  +  │     │     │  +  │     │  ← «+» = использовалось, розовый
│ API testing              │  +  │  +  │     │     │     │     │     │
└──────────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```
- Отметка ячейки — символ «+» (перекрестье — мотив стиля) `text-qa-accent`, пустая — ничего (не «—», чтобы не шуметь). Плюс `sr-only` текст «used in {project}» — уже есть логика, сохранить.
- Никаких процентов/шкал — запрет сохраняется.
- Mobile: таблица уже скрыта ниже `lg`; карточки навыков → `border-t border-line py-4`, проекты списком таблеток-ссылок (`secondary h-11`).

### 4.7 AI Lab (`AiLab.tsx`, `WorkflowGraph.tsx`)

```
 05 / AI WORKFLOW LAB ─────────────────────────────────────────────────── 05—07
 AI WORKFLOW
 LAB
 intro…
 +──────────+      +──────────+      +──────────+      +──────────+    ┌ details ───────┐
 │01        │ ───▶ │02        │ ───▶ │03        │ ───▶ │04        │    │ selected node  │
 │RESEARCH  │      │BUILD     │      │QA        │      │REVIEW    │    │ text…          │
 +──────────+      +──────────+      +──────────+      +──────────+    └────────────────┘
 WHY A HUMAN STAYS IN THE LOOP                    ┌ THIS SITE ────────────────────┐
 01  point…                                       │ note — text-small             │
 02  point…                                       │ AGENTS (frontend)(qa)(ux-ui)… │
                                                  └───────────────────────────────┘
```
- Узлы: `rounded-none border border-line bg-surface-1` + угловые «+» (Crosshair без делений); выбранный: «+» и номер `text-qa-accent`, `border-text-3`. Hover: `border-text-3`.
- Агенты в aside — статичные теги 3.2.
- Заголовок «AI WORKFLOW LAB» в `text-display` переносится на 2 строки на 1024 — это нормально; проверка RU не нужна (одинаковый в обеих локалях).

### 4.8 Game playground (`GamePlayground.tsx`)

Остров Pet Builder сохраняет пастельный мир (`rounded-pet-lg`, `pet-*` цвета) — это осознанный контраст «QA-мир / мир игры». **Решение за владельцем**; рекомендация — оставить, т.к. перекраска в монохром убивает смысл секции.

Что меняем — только «рама» вокруг острова:
```
 06 / BUILD A PET ─────────────────────────────────────────────────────── 06—07   ← на тёмном фоне, вне острова
 BUILD A PET                                                                         ← display, белый
╭───────────────────────────────────────────────────────────────────────────────╮
│  (пастельный остров без изменений: сцена 3D/постер + PartPicker + состав)       │
╰───────────────────────────────────────────────────────────────────────────────╯
```
- Метка и h2 выносятся НАД островом на тёмный фон (сейчас внутри острова) — так секция встаёт в общий ритм заголовков.
- Кнопки острова — уже таблетки (`rounded-full`), оставить.

### 4.9 Contact (`Contact.tsx`, `CopyEmailButton.tsx`)

```
 07 / CONTACT ─────────────────────────────────────────────────────────── 07—07
 LET’S BUILD                                                    EDITORIAL-строка справа:
 SOMETHING                                                      OPEN TO · QA · GAME DESIGN
 REMARKABLE.                                                    (тонкий капс, text-right, lg+)
 intro — text-lead font-light text-text max-w-prose

 sofiavipera@…  ← font-display text-h2 lowercase break-all select-all (сам адрес — не ссылка)
 ( WRITE AN EMAIL ↗ )  ( COPY EMAIL )  ( CALL +995… )  ( GITHUB ↗ )
   primary              secondary       secondary        secondary
 ────────────────────────────────────────────────────────────────────────────────────
 OPEN TO              FORMATS                       LOCATION
 (QA)(Game design)    (Remote)(On-site)(Hybrid)…    (Batumi, Georgia)       ← статичные теги
```
- Заголовок: `font-display text-h1 font-bold uppercase` (не display — это предложение; RU «Давайте создадим что‑то выдающееся.» = 3–4 строки на 390, проверено в 5.5). Выравнивание — влево (не центр): editorial-ритм референса.
- Телефон и GitHub — из ghost в secondary-таблетки: на мобильном ряд из 4 таблеток одного вида читается лучше.
- Copy: успех — `Toast` «Copied» (есть), кнопка на 2s → текст «Copied ✓», `aria-live` в тосте.

Mobile: всё в одну колонку, кнопки `w-full` (`wide` уже есть), факты — блоками друг под другом.

### 4.10 Footer (`Footer.tsx`)

По экрану 10 с видео — почти пустой, мелкий:
```
────────────────────────────────────────────────────────────────────────────────────
 SS_                  NAVIGATE                 CONTACT
 (●GH)(●@)(●☎)        Projects · Showroom      sofiavipera@…
                      About · Skills · Labs    Batumi, Georgia
                                                                   ( BACK TO TOP ↑ )
 © 2026 Sofia Stetsiuk ─────────────────────────────────────────────────────────────
```
- Колонки `hud text-mono-xs`, ссылки `text-text-2 hover:text-text`, `min-h-11` у каждой ссылки (в столбик на мобильном).
- Иконки — круги `size-11` (как в About), только существующие контакты.
- Все тексты из messages/profile; nav — из `sections.ts`.
- `py-8 border-t border-line`, текст `hud text-mono-xs text-text-3`. «Back to top» — `secondary` sm таблетка, `href="#content"`… — P2, не обязательно.
- Год — уже динамический.

### 4.11 Страница кейса (`src/app/[locale]/projects/[slug]/page.tsx`)

Desktop:
```
 ( ← ALL PROJECTS )                                                   CASE 03 / 07
 INSPECT / woodcutter-vs-zombies ──────────────────────────────────────────────────
 WOODCUTTER                                                    ( ◐ In development )
 VS ZOMBIES                                                    ( Roblox ) ( Lua )…
 subtitle — text-lead font-light text-text                     ( Play on Roblox ↗ )
┌+───────────────────────────────────────────────────────────────────────────────+┐
│                         hero media, full width, rounded-none                    │
+─────────────────────────────────────────────────────────── [ W 1920 × H 1080 ] ─+
┌ col 1–3 (sticky top-24) ┐ ┌ col 5–12 ─────────────────────────────────────────┐
│ 01 OVERVIEW             │ │ OVERVIEW  (h2: font-display text-h3 uppercase)     │
│ 02 ROLE                 │ │ prose max-w-prose text-text-2                      │
│ 03 PROCESS              │ │ ROLE …                                             │
│ 04 FEATURES             │ │ FEATURES — список с «+» маркерами                  │
│ 05 QA                   │ │ METRICS — ячейки bento: font-display h2 + label    │
│ 06 MEDIA                │ │                                                    │
└─────────────────────────┘ └────────────────────────────────────────────────────┘
 06 / MEDIA ───────────────────────────────────────────────────────────────────────
 [ bento 3.8 ]
 07 / 3D MODELS ───────────────────────────────────────────────────────────────────
 [ ModelShowcase 3.9 ]
┌──────────────────────────────────────┬──────────────────────────────────────────┐
│ ← PREVIOUS                           │                                 NEXT →   │  hud
│ CABIN CHAOS                          │                                 PILLARS  │  font-display h3 uppercase
└──────────────────────────────────────┴──────────────────────────────────────────┘
 border-y border-line, каждая половина — вся ссылка (min-h-32), hover bg-surface-1
```
- Шапка кейса — НЕ `ProjectInspector mode="case"` целиком, а его заголовочная часть: заголовок слева, мета-таблетки справа (`lg`), медиа под ними во всю ширину. Проще всего: в `ProjectInspector` для `mode="case"` отдельная ветка разметки (одна, общая для web/roblox).
- Оглавление слева — простые якоря `#case-overview` и т.д. (id уже есть), `hud text-mono-xs`, `min-h-11`. Активный пункт без JS не подсвечиваем (YAGNI, P2). На <1024 оглавление скрыть.
- Метрики: только из данных проекта (`project.metrics`), сноска `*note` — сохраняется. Пустых метрик не рисовать (уже).
- «Нет ссылки» — текст `— no public link`, `text-text-3`, без таблетки и без стрелки (не выглядит кнопкой).

Mobile 390:
```
 ( ← ALL PROJECTS )      CASE 03/07
 WOODCUTTER
 VS ZOMBIES
 (◐ In development)(Roblox)
 subtitle…
 [ hero media ]
 (    PLAY ON ROBLOX ↗    )
 OVERVIEW …
 [ bento: одна колонка ]
 [ ← PREVIOUS: CABIN CHAOS ]
 [ NEXT: PILLARS → ]
```

---

## 5. Лента и почему именно там

**Место:** одна `MarqueeBand` между `<Showroom />` и `<About />` в `src/app/[locale]/page.tsx`.

Почему:
1. Это шов смысла: выше — «работы» (Projects, Showroom), ниже — «человек» (About, Skills, Labs). Лента = титр-перебивка, как разделитель глав в журнале.
2. Не конкурирует с Hero: в первом экране уже есть гигантское имя и живая игра — второй гигантский движущийся объект там = шум и падение LCP.
3. После Showroom (тяжёлые постеры) — лента дешёвая (только текст), даёт «передышку» в скролле.
4. Не перед Contact: перед финальным CTA нужен спокойный ритм, ничего не должно оттягивать взгляд от кнопок.
5. Одна. Вторая лента обесценивает приём (референс использует его один раз).

Лента не секция: не попадает в `sections.ts`, не имеет id/якоря, не в навигации, `aria-hidden`.

---

## 6. Доступность

### 6.1 Фокус на тёмном
- Глобально: `outline: 2px solid #F58FBA; outline-offset: 3px` — 9:1 к фону, работает со `rounded-full` (outline повторяет радиус в Chromium/Firefox/Safari 16.4+).
- На розовой/салатовой/белой заливке кольцо отделено 3px-зазором цвета фона — контраст кольца считается к фону, не к кнопке. Ок.
- Поверх медиа (бейдж «3D ↗», круг в Hero поверх canvas) — `bg-bg/60`+ кольцо снаружи элемента; проверить, что offset не обрезается `overflow-hidden` родителя: у карточек Showroom кольцо на самой `<button>` (у неё нет overflow-hidden снаружи) — OK; у медиа-ссылок внутри `overflow-hidden` использовать `outline-offset:-3px`.
- `[tabindex="-1"]` заголовки не показывают кольцо при программном фокусе (уже).

### 6.2 Размер целей
- Минимум 44×44 видимой или hit-area: кнопки `h-12/h-11`, круги `size-11`, сегменты `h-9` + `before:` расширение, мобильное меню `min-h-14`.
- Исключение: inline-ссылки в абзаце (WCAG 2.5.8 exception), но ghost-кнопки — `h-11`.
- Между соседними целями 8px (`gap-2`) — кроме сегментов (`gap-1`, их hit-area не пересекаются по горизонтали).

### 6.3 Контраст
| Пара | Ratio | Статус |
|---|---|---|
| text / bg | 18.6 | AAA |
| text-2 / bg | 8.1 | AAA |
| text-2 / surface-2 | 6.9 | AA |
| text-3 / bg | 5.0 | AA |
| text-3 / surface-1 | 4.7 | AA |
| text-3 / surface-2 | 4.4 | **запрещено** для текста |
| qa-accent / bg | 9.0 | AAA |
| on-accent / qa-accent | 9.0 | AAA |
| on-signal / signal | 16.7 | AAA |
| bg / text (выбранный сегмент) | 18.6 | AAA |
| ui-border / bg (обводка контрола) | 3.9 | AA non-text |
| line / bg (декор) | 1.4 | только декор |
| белое имя Hero поверх canvas | ≥15 | canvas тёмный; баги розовые 1–2px — не перекрывают буквы целиком |

- Контурный ряд ленты (`text-stroke text-3`) — декор, `aria-hidden`, контраст не нормируется.
- Не использовать `opacity` для «приглушения» текста — только токены цвета (opacity-слои ломают расчёт).

### 6.4 Недоступное ≠ кликабельное
- Статичные теги: обводка `line`, без hover, без курсора, без стрелок.
- Кликабельные таблетки: обводка `ui-border` + hover + стрелка/✓.
- Disabled: пунктир + `text-3` + `aria-disabled` + причина рядом текстом (или тултип) — уже в DESIGN_SYSTEM 4.4.
- Нет ссылки у проекта → текст, не таблетка. Нет WebGL → контролы 3D не рендерятся.

### 6.5 Reduced motion
| Элемент | Обычно | `prefers-reduced-motion: reduce` |
|---|---|---|
| Лента | scroll-linked translateX | статична, 2 ряда видны целиком по центру |
| Hero intro / Crosshair draw | 400–480ms прорисовка | мгновенно финальное состояние |
| BugHunt | баги бегают | стоят, ловить можно (уже) |
| Hover-scale медиа/постеров | scale 1.02–1.05 | без scale (глобальный 1ms уже гасит) |
| Showroom auto-rotate | вкл | выкл по умолчанию (уже) |
| Smooth scroll | smooth | auto (уже) |

### 6.6 Без WebGL / без JS
- Hero: Canvas 2D — WebGL не нужен; без JS — кадр с сеткой, имя, кнопки.
- Showroom: постеры в сетке + постер в диалоге + строка «3D unavailable» (уже).
- Pet Builder: постер + `posterNote` (уже).
- Фильтр проектов без JS — все группы видны (уже).

### 6.7 RU: длина текста и перенос гигантских заголовков
RU в среднем на 20–30% длиннее, Unbounded-кириллица шире латиницы. Правила:

1. **Тест «самое длинное слово»**: в `text-display` одно слово не должно превышать 9 знаков RU / 10 EN. Ширина буквы Unbounded 700 caps ≈ 0.8em.
   - 360px: доступно 328px; display(RU) = 36px → 9 × 0.8 × 36 = 259px ✓
   - «3D-ШОУРУМ» (9) ✓, «КОНТАКТЫ» (8) ✓, «ПИТОМЦА» (7) ✓, «WORKFLOW» (8) ✓.
   - Слово длиннее (например, если контент-агент даст «ЛАБОРАТОРИЯ» — 11) → для этого заголовка `text-h1` вместо `text-display`, либо переформулировать. Проверять при каждой правке messages.
2. `hyphens: manual` на заголовках (уже) — **не** включать `auto`: дефисы в капсе-дисплее выглядят как ошибка. Мягкий перенос — `&shy;` в messages при необходимости.
3. `text-wrap: balance` на h1–h3 (уже) — оставить.
4. Имя Hero — латиница в обеих локалях, «STETSIUK» 8 × 0.8 × 48px = 307px < 328px на 360 ✓.
5. Кнопки капсом: RU «СМОТРЕТЬ РАБОТЫ →» ≈ 17 знаков × 8.4px + 48 padding ≈ 190px — помещается; на <480px кнопки всё равно `w-full`. `white-space: nowrap` у `.btn` оставить, но проверить, что самая длинная RU-кнопка на 360 ≤ 328px (сейчас — «НАПИСАТЬ НА ПОЧТУ», ок).
6. Desktop-nav RU на 1024: «Проекты · 3D-шоурум · Обо мне · Навыки · Лаборатории» ≈ 40 знаков × 8.2 + 5 × 32 padding ≈ 490px + лого/переключатель/Contact ≈ 300px = 790 < 896 ✓. Индексы показывать с `xl`. Рекомендация контент-агенту: RU `nav.labs` → «AI Lab» (короче и совпадает с заголовком).
7. Лента: длинная RU-строка не проблема (`nowrap`, бесконечная).
8. Обязательная визуальная проверка: 360 / 390 / 768 / 1024 / 1440 × EN/RU — 10 скриншотов главной + 1 кейс.

---

## 7. Чек-лист внедрения

### P0 — без этого редизайна нет
| # | Изменение | Файлы |
|---|---|---|
| 1 | Новые значения цветов, `signal`, `on-signal`, `ui-border`; `--text-display`, `--text-marquee` (+`:lang(ru)`), удалить RU-override hero; радиусы qa → 0 | `src/app/globals.css` (`@theme`, `:root`, `:lang(ru)`) |
| 2 | `.btn` → `rounded-full`, uppercase; убрать `::after` уголки; `.btn-signal`; secondary hover → `text`; размер sm → `h-11` | `src/app/globals.css`, `src/components/ui/Button.tsx` (тип `Variant` + `"signal"`, size `sm` → `h-11 px-5`) |
| 3 | Section label с линией и счётчиком; заголовки секций `text-display uppercase` | `src/components/ui/SectionShell.tsx`, `src/components/ui/HudLabel.tsx` (без изменений API) |
| 4 | Header: пилюльная nav, активный = заливка, Contact-связка, круглый бургер; удалить `.nav-link::after` | `src/components/layout/Header.tsx`, `src/components/layout/MobileMenu.tsx`, `src/components/layout/LanguageSwitcher.tsx`, `src/app/globals.css` |
| 5 | Segmented-пилюли везде; `ProjectFilter` → обёртка над `Segmented` | `src/components/showroom/ShowroomControls.tsx`, `src/components/project/ProjectFilter.tsx` |
| 6 | Теги/статусы — таблетки, статичные `border-line`, нажимные `border-ui-border` | `src/components/ui/TechChip.tsx`, `src/components/ui/StatusBadge.tsx`, `ProjectInspector.tsx` (`<summary>` «+N») |
| 7 | `Crosshair` компонент | новый `src/components/ui/Crosshair.tsx` |
| 8 | Hero: кадр с canvas во всю ширину, имя поверх (`pointer-events-none`), signal-CTA, круг «3D gallery», мобильная раскладка | `src/components/sections/Hero.tsx`, `src/components/sections/HeroSceneSlot.tsx`, `src/messages/{en,ru}.json` (`roleA`/`roleB`) |
| 9 | Проверка контраста и фокуса после перекраски (axe + ручной Tab-проход) | — (qa-engineer) |

### P1 — стиль референса в секциях
| # | Изменение | Файлы |
|---|---|---|
| 10 | Project card: web с Crosshair; roblox без наклона/тени/скруглений, единый розовый акцент, удалить проп `accent` | `src/components/project/ProjectInspector.tsx`, `src/components/sections/Projects.tsx` |
| 11 | Showroom: карточки `rounded-none`, gap-2, «+» на hover; диалог — круглые IconButton, secondary-ссылки, Crosshair на сцене | `src/components/sections/Showroom.tsx`, `src/components/showroom/ShowroomControls.tsx` |
| 12 | MarqueeBand (scroll-linked, aria-hidden, reduced-motion static) + ключ `marquee` | новый `src/components/ui/MarqueeBand.tsx`, `src/app/[locale]/page.tsx`, `src/app/globals.css` (keyframes), `src/messages/{en,ru}.json` |
| 13 | Avatar (монограмма до получения фото) + блок профиля в About, круги контактов | новый `src/components/ui/Avatar.tsx`, `src/components/sections/About.tsx`, `src/content/profile.ts` (опц. `avatar`) |
| 14 | Страница кейса: шапка, bento по пропорциям, prev/next половинами | `src/app/[locale]/projects/[slug]/page.tsx`, `src/components/project/ProjectInspector.tsx` (ветка `mode="case"`), `src/components/project/MediaItem.tsx` (если нужен `object-contain` проп) |
| 15 | Contact: заголовок влево uppercase, адрес крупно, все действия таблетками | `src/components/sections/Contact.tsx`, `src/components/sections/CopyEmailButton.tsx` |
| 16 | Skills «+» в ячейках, нажимные теги; AI Lab узлы `rounded-none` + «+» | `src/components/sections/SkillsMatrix.tsx`, `src/components/ai-lab/WorkflowGraph.tsx`, `src/components/sections/AiLab.tsx` |
| 17 | Game playground: метка + h2 над островом на тёмном фоне | `src/components/sections/GamePlayground.tsx` |
| 17a | Roblox-группа: statement слева + высокие нумерованные карточки (3.7a), base — snap-скролл | `src/components/sections/Projects.tsx`, новый `src/components/project/TallCard.tsx`, `src/messages/{en,ru}.json` (опц. `groupRobloxIntro`) |
| 17b | About по экрану «team»: statement по центру, круг с постером модели, circle row этапов (3.14) | `src/components/sections/About.tsx`, `src/components/sections/JourneyPath.tsx`, `src/messages/{en,ru}.json` (`sections.about.statement`) |
| 17c | Токен `--text-statement` | `src/app/globals.css` |
| 18 | RU-прогон 10 скриншотов (6.7.8), правка длинных слов в messages | `src/messages/ru.json` |

### P2 — полировка
| # | Изменение | Файлы |
|---|---|---|
| 19 | Оглавление кейса слева (sticky, якоря) | `src/app/[locale]/projects/[slug]/page.tsx` |
| 20 | Тире после заголовка секции на `lg+` | `src/components/ui/SectionShell.tsx` |
| 20a | Glitch RGB-split на «release ready» (3.13) | `src/components/sections/BugHunt.tsx`, `src/app/globals.css` |
| 21 | Footer по экрану 10 с: колонки, круги контактов, «Back to top» | `src/components/layout/Footer.tsx` |
| 22 | JourneyPath: стадии `rounded-none`, proof-ссылки таблетками | `src/components/sections/JourneyPath.tsx` |
| 23 | Обновить `DESIGN_SYSTEM.md` §1.2–1.4, §3, §4.4–4.9 ссылкой на этот документ (после внедрения, не до) | `DESIGN_SYSTEM.md` |
| 24 | Фото аватара — когда владелец даст файл | `public/media/profile/avatar.webp`, `src/content/profile.ts` |

Не делаем (YAGNI): новый шрифт, blur/glass-эффекты, клавиатурная версия BugHunt, лайтбокс для bento, второй marquee, активная подсветка оглавления по скроллу.

### Открытые вопросы владельцу
1. Фото для круглого аватара — есть ли? (Пока монограмма «SS».)
2. Pet Builder: оставить пастельный остров (рекомендация) или монохром?
3. Текст ленты в RU: латиница «QA × GAME DESIGN × 3D × AI ×» (рекомендация) или перевод?
