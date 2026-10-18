# Redesign — Motion Spec (editorial cyber / monochrome)

Референс: `docs/reference-pinterest.jpg`. Чёрный монохром, гигантский extended uppercase, волосяные crosshair-сетки с мелкими подписями, pill-кнопки, bento, liquid-chrome 3D, кинетический marquee «3D TYPE». Акцент — `#F58FBA` (`--color-qa-accent`), только как сигнал: активное состояние, пойманный баг, одна «залитая» строка в marquee.

Документ — спецификация, код не правится. Сниппеты ниже рассчитаны на вставку в `src/app/globals.css` и существующие компоненты. Тексты (подписи сетки, слова marquee, aria-label кнопки паузы) — только из `src/content` / `messages`, в компонентах не хардкодить.

Инструменты: **CSS keyframes + существующий `MotionObserver` (data-reveal/data-inview) + WAAPI** покрывают всё. `motion/react` остаётся там, где уже есть (LanguageSwitcher, GamePlayground). GSAP/ScrollTrigger **не нужен**: сложного скролл-таймлайна нет, скорость marquee — это `playbackRate` у CSS-анимации.

---

## 1. Принципы и токены

**Характер: snappy editorial.** Быстрый старт, длинное «дотягивание» (expo-out), никакого overshoot/bounce/squash. Движение = «печать/монтаж»: шторки-маски, отрисовка волосяных линий, смена слоёв. Ничего не плавает без причины; единственное постоянное движение на странице — marquee (с паузой) и игра в hero (только на экране).

Правила:
1. Анимируются только `transform`, `opacity` (и `clip-path` на мелком тексте — уже используется в проекте).
2. Появление ≤ 720ms на элемент, интро hero ≤ 1200ms суммарно, hover ≤ 240ms.
3. Stagger 40–90ms, не больше 6 шагов (дальше — вместе с 6-м).
4. Контент кликабелен с первого кадра: `animation-fill-mode: backwards`, никаких `pointer-events: none` на время интро.
5. Скрытое состояние появляется только после гидрации и только для элементов вне экрана (уже так работает `MotionObserver`).
6. Все hover — под `@media (hover: hover)`; то же состояние даёт `:focus-visible`.

### Токены (добавить в `@theme` / `:root`)

```css
@theme {
  /* existing: --ease-precise, --ease-out. --ease-soft — удалить (см. §6) */
  --ease-expo: cubic-bezier(0.19, 1, 0.22, 1);     /* маски, крупный текст */
  --ease-wipe: cubic-bezier(0.65, 0, 0.35, 1);     /* линии, шторки, заливка pill */
}
:root {
  --dur-micro: 120ms;    /* было 150 — hover цвета, нажатие */
  --dur-comp: 240ms;     /* было 300 — углы, заливка pill, чипы */
  --dur-reveal: 560ms;   /* появление карточек и лейблов */
  --dur-mask: 720ms;     /* гигантский текст из маски */
  --dur-line: 600ms;     /* отрисовка волосяных линий */
  --stagger: 60ms;
}
```

| Задача | Длительность | Easing |
|---|---|---|
| Цвет/фон hover | 120ms | `--ease-precise` |
| Crosshair-углы, заливка pill | 240ms | `--ease-wipe` |
| Нажатие (`:active`) | 80ms | `--ease-precise` |
| Reveal карточек / лейблов | 560ms | `--ease-expo` |
| Гигантский текст из маски | 720ms | `--ease-expo` |
| Волосяные линии | 600ms | `--ease-wipe` |
| Марquee | linear, 1 цикл 32–48s | linear |

---

## 2. Hero — хореография интро

Структура (визуал определяет арт-директор, здесь — только движение):
- `.hero-grid` — 2 горизонтальные + 2 вертикальные волосяные линии (1px, `--color-grid-strong`), `+`-маркеры на пересечениях, мелкие mono-подписи у линий (текст из content).
- `h1` — имя двумя строками, каждая в маске `.mask-line > span`.
- Подзаголовок / теглайн.
- Pills: 3 CTA (`#projects`, `#showroom`, `#contact`).
- `BugHunt` canvas справа.

**Почему маска строки, а не letter-stagger:** разбиение на буквы ломает чтение скринридером (нужен `aria-label` + `aria-hidden` у букв), ломает кернинг Unbounded и RU-версию, а визуально в editorial-стиле строка, выезжающая из-под линии, сильнее. Letter-stagger — нет.

### Таймлайн (мс от первого кадра)

| t, ms | Элемент | Анимация | Длит. | Easing |
|---|---|---|---|---|
| 0 | Горизонтальные линии (2, stagger 80) | `scaleX 0→1`, origin left | 600 | `--ease-wipe` |
| 80 | Вертикальные линии (2, stagger 80) | `scaleY 0→1`, origin top | 600 | `--ease-wipe` |
| 160 | Имя, строка 1 | `translateY(105%) → 0` в маске | 720 | `--ease-expo` |
| 250 | Имя, строка 2 | то же | 720 | `--ease-expo` |
| 480 | `+`-маркеры и mono-подписи (stagger 30, ≤6) | `opacity 0→1` | 200 | `--ease-precise` |
| 560 | Подзаголовок, теглайн (stagger 60) | `opacity`, `translateY(8px)→0` | 400 | `--ease-expo` |
| 640 | Pills 1–3 (stagger 60) | `opacity`, `translateY(8px)→0` | 360 | `--ease-expo` |
| 700 | BugHunt canvas | `opacity 0→1` + внутренняя scan-линия (§5) | 480 | `--ease-out` |
| ≈1180 | конец | | | |

Имя заканчивает движение к 970ms, но читается уже с ~400ms — текст не держится скрытым дольше полсекунды.

### CSS

```css
/* Маска строки. padding/margin компенсируют line-height 0.92, чтобы не резать верх кириллицы и акценты */
.mask-line { display: block; overflow: clip; padding-block: 0.08em; margin-block: -0.08em; }
.mask-line > span { display: block; }

@keyframes mask-up { from { transform: translateY(105%); } }
@keyframes draw-x { from { transform: scaleX(0); } }
@keyframes draw-y { from { transform: scaleY(0); } }
/* intro-fade и intro-rise уже есть */

@media (prefers-reduced-motion: no-preference) {
  #hero .hero-line-x { transform-origin: left;  animation: draw-x var(--dur-line) var(--ease-wipe) calc(var(--i, 0) * 80ms) backwards; }
  #hero .hero-line-y { transform-origin: top;   animation: draw-y var(--dur-line) var(--ease-wipe) calc(80ms + var(--i, 0) * 80ms) backwards; }
  #hero .mask-line > span { animation: mask-up var(--dur-mask) var(--ease-expo) calc(160ms + var(--i, 0) * 90ms) backwards; }
  #hero .hero-mark { animation: intro-fade 200ms var(--ease-precise) calc(480ms + min(var(--i, 0), 5) * 30ms) backwards; }
  #hero .intro-rise { --rise: 8px; animation: intro-rise 400ms var(--ease-expo) calc(560ms + var(--i, 0) * 60ms) backwards; }
  #hero .hero-pill { --rise: 8px; animation: intro-rise 360ms var(--ease-expo) calc(640ms + var(--i, 0) * 60ms) backwards; }
  #hero [data-hero-scene] { animation: intro-fade 480ms var(--ease-out) 700ms backwards; }
}
```

Разметка имени (сохраняет текущий `t("firstName")`/`t("lastName")`):

```tsx
<span className="mask-line"><span>{t("firstName")}</span></span>{" "}
<span className="mask-line [--i:1]"><span>{t("lastName")}</span></span>
```

Линии сетки — `aria-hidden`, `pointer-events: none`, `position: absolute`, ширина/высота задаются раз, анимируется только `scale`.

**Reduced motion:** всё в финальном состоянии сразу (блок обёрнут в `no-preference`). Линии, маркеры, подписи видимы статично.

---

## 3. Кинетический marquee «гигантский тип»

### Поведение
- 3 строки на desktop (`lg`), 2 на mobile. Каждая строка — трек с контентом, повторённым **дважды**; анимация `translateX(0 → -50%)` бесшовная.
- Нечётные строки едут влево, чётные — вправо (`animation-direction: reverse`).
- Слова чередуются: outline (`-webkit-text-stroke`, прозрачная заливка) / filled (`--color-text`). В одной строке одно слово — filled pink (`--color-qa-accent`), не больше.
- Скорость реагирует на скорость скролла: `playbackRate` 1 → до 5, плавно затухает обратно. При скролле вверх строки разворачиваются (знак скорости) — опционально, флаг `data-flip`.
- Пауза: hover, `:focus-within` и **кнопка-pill «Пауза/Play»** (WCAG 2.2.2: автодвижение > 5s требует механизма остановки, hover не доступен с клавиатуры/тача).
- Вне экрана анимация на паузе (IO), rAF-цикл не крутится.
- Сам marquee декоративный: обёртка `aria-hidden="true"`, слова — из `src/content` (например, роли/дисциплины, подтверждённые контентом). Кнопка паузы — вне `aria-hidden`.

### Разметка

```tsx
// src/components/sections/Marquee.tsx — server-разметка, клиентская часть только в MarqueeSpeed
<section className="marquee" data-marquee aria-labelledby={...}>
  <div aria-hidden="true">
    {rows.map((words, r) => (
      <div key={r} className="marquee-row" style={{ "--row": r } as React.CSSProperties}>
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="marquee-set">
              {words.map((w, i) => <span key={i} className="marquee-word">{w}</span>)}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
  <MarqueeSpeed pauseLabel={t("pause")} playLabel={t("play")} />
</section>
```

### CSS

```css
.marquee { position: relative; overflow: clip; contain: layout paint; }
.marquee-row { overflow: clip; }
.marquee-track { display: flex; width: max-content; will-change: transform; }
.marquee-set { display: flex; gap: 0.35em; padding-inline-end: 0.35em; }
.marquee-word {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 2rem + 9vw, 11rem);
  line-height: 0.9;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
}
.marquee-word:nth-child(odd) { color: transparent; -webkit-text-stroke: 1.5px var(--color-text); }
.marquee-row:nth-child(2) .marquee-set .marquee-word:nth-child(2) { color: var(--color-qa-accent); -webkit-text-stroke: 0; }

@keyframes marquee { to { transform: translateX(-50%); } }

@media (prefers-reduced-motion: no-preference) {
  .marquee-track { animation: marquee calc(40s + var(--row) * 6s) linear infinite; }
  .marquee-row:nth-child(even) .marquee-track { animation-direction: reverse; }
  .marquee:is(:hover, :focus-within, [data-paused]) .marquee-track { animation-play-state: paused; }
}
@media (max-width: 63.99rem) { .marquee-row:nth-child(n + 3) { display: none; } }

/* Reduced motion: статичный «постер» — строки сдвинуты лесенкой, ничего не едет */
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none !important; transform: translateX(calc(var(--row) * -12%)); }
}
```

`animation: none` обязателен: глобальное правило reduced-motion делает `1ms × 1 итерацию` — трек прыгнул бы в конец.

### Скорость от скролла — минимальный JS (WAAPI, без библиотек)

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

/** Speeds the marquee up with scroll velocity via playbackRate on its CSS animations. Idle off screen. */
export function MarqueeSpeed({ pauseLabel, playLabel }: { pauseLabel: string; playLabel: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = ref.current!.closest<HTMLElement>("[data-marquee]")!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anims = root.getAnimations({ subtree: true });
    const flip = root.hasAttribute("data-flip");
    let raf = 0, lastY = scrollY, rate = 1, applied = 1;

    const tick = () => {
      const v = scrollY - lastY; // px per frame
      lastY = scrollY;
      const dir = flip && v < 0 ? -1 : 1;
      const target = dir * (1 + Math.min(4, Math.abs(v) / 10));
      rate += (target - rate) * 0.08; // ~0.5s decay back to 1
      if (Math.abs(rate - applied) > 0.01) {
        anims.forEach((a) => (a.playbackRate = rate));
        applied = rate;
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      raf = 0;
      anims.forEach((a) => (e.isIntersecting && !root.hasAttribute("data-paused") ? a.play() : a.pause()));
      if (e.isIntersecting) { lastY = scrollY; raf = requestAnimationFrame(tick); }
    });
    io.observe(root);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  useEffect(() => {
    ref.current!.closest("[data-marquee]")!.toggleAttribute("data-paused", paused);
  }, [paused]);

  return (
    <button ref={ref} type="button" className="pill absolute right-4 bottom-4" aria-pressed={paused}
      onClick={() => setPaused((p) => !p)}>
      {paused ? playLabel : pauseLabel}
    </button>
  );
}
```

Замечания:
- `a.play()` у CSS-анимации переопределяет `animation-play-state` до следующего изменения стиля; поэтому IO уважает `data-paused`, а hover-пауза работает через CSS (play-state меняется при hover → CSS снова управляет). Проверить в Chrome/Firefox/Safari, что hover останавливает трек после `play()`; если нет — вместо `play()/pause()` ставить на корень `data-offscreen` и добавить его в селектор паузы.
- `getAnimations({ subtree: true })` вызывается после маунта — CSS-анимации уже созданы. Если строки рендерятся условно (mobile), брать анимации заново при resize не нужно: скрытые `display: none` строки анимаций не имеют, это ок.
- В reduced-motion кнопку паузы не показывать (`motion-reduce:hidden`) — двигаться нечему.

---

## 4. Scroll-reveals и hover

Основа — существующий `MotionObserver` + `[data-reveal]`. Добавляются два режима: `mask` (крупные заголовки секций) и `label` (мелкие mono-лейблы с линией).

### 4.1 Лейблы секций (`01 — PROJECTS` + волосяная линия)

```css
@media (prefers-reduced-motion: no-preference) {
  [data-motion] [data-reveal="label"]:not([data-inview]) { opacity: 0; }
  [data-inview="anim"][data-reveal="label"] .label-text { animation: intro-clip 320ms var(--ease-wipe) backwards; }
  [data-inview="anim"][data-reveal="label"] .label-line { transform-origin: left; animation: draw-x var(--dur-line) var(--ease-wipe) 80ms backwards; }
}
```
(Скрытие через `opacity` на контейнере снимается в тот же кадр, когда стартуют дочерние анимации с `backwards` — мигания нет.)

### 4.2 Заголовки секций (гигантский тип)

Та же маска строки, что в hero: `data-reveal="mask"` на `h2`, строки — `.mask-line > span`.

```css
@media (prefers-reduced-motion: no-preference) {
  [data-motion] [data-reveal="mask"]:not([data-inview]) .mask-line > span { transform: translateY(105%); }
  [data-inview="anim"][data-reveal="mask"] .mask-line > span {
    animation: mask-up var(--dur-mask) var(--ease-expo) calc(var(--i, 0) * 90ms) backwards;
  }
}
```

### 4.3 Bento / карточки проектов

Существующий `data-reveal="stagger"` с `intro-rise`, но короче и резче: `--rise: 24px`, `var(--dur-reveal) var(--ease-expo)`, stagger 60ms, кап 300ms. Bento-плитки разной высоты — stagger по DOM-порядку, не по колонкам (проще и предсказуемо).

```css
[data-inview="anim"][data-reveal="stagger"] > * {
  --rise: 24px;
  animation: intro-rise var(--dur-reveal) var(--ease-expo) calc(min(var(--n, 0), 5) * var(--stagger)) backwards;
}
```
`--n` проставить в разметке (`style={{"--n": i}}`) вместо лестницы `nth-child` — лестницу удалить.

### 4.4 Hover / focus micro-interactions

**Pill-кнопки** — заливка «шторкой» слева, текст инвертируется, стрелка смещается на 2px. Без scale.

```css
.pill {
  position: relative; isolation: isolate; overflow: clip;
  display: inline-flex; align-items: center; gap: 8px;
  min-height: 44px; padding: 0 20px; border-radius: var(--radius-full);
  border: 1px solid var(--color-text); color: var(--color-text);
  transition: color var(--dur-comp) var(--ease-wipe);
}
.pill::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background: var(--color-text);
  transform: scaleX(0); transform-origin: right;
  transition: transform var(--dur-comp) var(--ease-wipe);
}
.pill-arrow { transition: transform var(--dur-comp) var(--ease-wipe); }
@media (hover: hover) {
  .pill:hover { color: var(--color-bg); }
  .pill:hover::before { transform: scaleX(1); transform-origin: left; }
  .pill:hover .pill-arrow { transform: translate(2px, -2px); }
}
.pill:focus-visible { color: var(--color-bg); }
.pill:focus-visible::before { transform: scaleX(1); transform-origin: left; }
.pill:active { transform: scale(0.98); transition-duration: 80ms; }
.pill[aria-pressed="true"], .pill-accent { border-color: var(--color-qa-accent); }
.pill-accent::before { background: var(--color-qa-accent); }
```
Смена `transform-origin` на hover даёт «шторку»: заходит слева, уходит вправо.

**Карточки (bento, проекты)** — crosshair-углы. Переиспользовать готовый трюк с `conic-gradient`-маской из `.btn-primary::after`, но углы — короткие «+»-скобы, съезжаются внутрь на 4px.

```css
.card-x { position: relative; }
.card-x::after {
  content: ""; position: absolute; inset: -6px; pointer-events: none;
  border: 1px solid var(--color-qa-accent);
  mask: conic-gradient(at 10px 10px, transparent 75%, #000 0) 0 0 / calc(100% - 10px) calc(100% - 10px);
  opacity: 0; transform: scale(1.03);
  transition: opacity var(--dur-comp) var(--ease-wipe), transform var(--dur-comp) var(--ease-wipe);
}
.card-x .card-media { transition: transform 480ms var(--ease-expo); }
@media (hover: hover) {
  .card-x:hover::after { opacity: 1; transform: none; }
  .card-x:hover .card-media { transform: scale(1.03); }
}
.card-x:focus-within::after { opacity: 1; transform: none; }
```
Без подъёма карточки и без теней: в монохроме «лифт» читается как Material, не как editorial. Медиа внутри — `overflow: clip` у обёртки.

**Аватар-круг** — внешнее кольцо из mono-текста/пунктира медленно вращается только при hover; фото — `scale(1.04)`; угловая pill-стрелка `↘` сдвигается на 2px.

```css
.avatar-ring { transition: transform 1200ms var(--ease-expo); }
.avatar-photo { transition: transform 480ms var(--ease-expo); }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .avatar:hover .avatar-ring { transform: rotate(90deg); }
  .avatar:hover .avatar-photo { transform: scale(1.04); }
}
```
Поворот на фиксированные 90° (а не бесконечный spin) — движение заканчивается, ничего не крутится фоном.

**Showroom-карточки** — сейчас `group-hover:scale-105 duration-300` + `transition-colors`. Заменить на `.card-x` (углы) + `scale(1.03)` 480ms expo; чип `3D ↗` инвертируется (фон `--color-text`, текст `--color-bg`) за 120ms. Liquid-chrome 3D в диалоге: автоповорот как сейчас (выключен при reduced motion — уже реализовано через `usePrefersReducedMotion`).

---

## 5. BugHunt в новой эстетике (лёгкий рестайл)

Механика не меняется. Только отрисовка (`drawBug`, `draw`) и пара эффектов:

1. **Баг = crosshair-цель.** Вместо жука с ногами: кружок r=3 + 4 коротких штриха (как прицел), белый `#ECEEF2` 1px; «ноги» заменить лёгкой вибрацией штрихов (`±0.6px` по `b.step`). Направление движения — короткий «хвост» 6px сзади. Убирает 9 `stroke()` на баг.
2. **Убрать `shadowBlur`** (свечение): дорого на каждом кадре и противоречит «без glow». Для текста «release ready» тоже.
3. **Наведение**: если курсор ближе 28px (досягаемость клика) — штрихи прицела становятся розовыми (`ACCENT`) и чуть раздвигаются. Это подсказка «можно ловить».
4. **Поимка**: существующие угловые скобы оставить (это и есть crosshair-углы карточек — единый язык), плюс **горизонтальная scan-линия** 1px через весь canvas на уровне бага, `alpha 0.6 → 0` за 240ms; лейбл `BUG-004 · fixed ✓` — mono 11px, белым, галочка — `OK`.
5. **Появление раунда**: scan-линия проходит сверху вниз за 600ms, баги «проявляются», когда линия их пересекает (`alpha = y < scanY ? 1 : 0`). Тот же эффект — при fade-in canvas в интро hero.
6. **Счётчик** — в стиле мелких подписей сетки: `BUGS 3/7` mono, + маленький прогресс-бар 1px (ширина ∝ found/N).

Сниппет scan-линии (внутри `draw`):

```ts
// scanAt: performance.now() at round start / catch; scanY drives both reveal and the line
const scan = Math.min(1, (now - scanAt) / 600);
if (scan < 1) {
  const y = H * scan;
  ctx.fillStyle = "rgba(236,238,242,0.5)";
  ctx.fillRect(0, y, W, 1);
}
// in drawBug: if (!reduced && b.y > H * scan) return; // not revealed yet
```

**Reduced motion** (уже частично есть: баги стоят): scan-линии не рисуются, раунд появляется сразу, при поимке — только скобы и лейбл без анимации сжатия (`s` сразу финальный).

---

## 6. Производительность, reduced motion, что удалить

### Бюджет
- Только `transform` / `opacity` (+ `clip-path` на коротких mono-лейблах). Никаких анимаций `width/height/top/left/filter/box-shadow/letter-spacing`.
- Чтения layout (`getBoundingClientRect`) — только в обработчиках событий / IO, не в rAF. `MarqueeSpeed` читает лишь `scrollY` (без форсированного layout).
- Одновременно активных rAF-циклов: ≤ 2 (BugHunt, MarqueeSpeed), оба спят вне экрана и при `document.hidden`.
- `will-change: transform` — только на `.marquee-track` (постоянно анимируется). На остальном не ставить: композитные слои создаются на время анимации сами.
- Марquee: ≤ 3 строки × 2 копии; `contain: layout paint` на секции. Text-stroke на огромном шрифте растеризуется один раз в слой — ок, но не анимировать `font-size`/stroke.
- Интро hero: ≤ 12 одновременно анимируемых элементов; LCP-элемент (имя) видим с ~400ms, CLS = 0 (всё через transform).
- Цель: без long tasks > 50ms от анимаций; 60fps на среднем Android в hero и marquee (проверка — Performance-панель, 4× CPU throttle).

### Reduced motion — по элементам

| Элемент | Поведение при `reduce` |
|---|---|
| Hero линии, маркеры, подписи | статичны, видимы сразу |
| Имя (маска) | на месте сразу |
| Pills, подзаголовок | видимы сразу |
| BugHunt | баги стоят, без scan-линий; клик работает |
| Марquee | `animation: none`, лесенка из строк, кнопка паузы скрыта, JS не запускается |
| Reveals (`label`, `mask`, `stagger`) | не применяются (`MotionObserver` снимает `data-motion`) |
| Hover pill / углы карточек | остаются (это обратная связь, не автодвижение), длительность по глобальному правилу 1ms |
| Аватар-кольцо | без поворота |
| Showroom 3D | автоповорот выключен (уже), постер без WebGL |
| Смена локали (re-render) | отключён (уже) |

Глобальный блок `@media (prefers-reduced-motion: reduce)` в `globals.css` оставить как страховку, но бесконечные анимации гасить явно (`animation: none`), см. marquee.

### Удалить / заменить

| Что | Где | Почему |
|---|---|---|
| `--ease-soft` и `.btn-pet:hover { scale: 1.03 }`, `scale 180ms var(--ease-soft)` в `.btn` | `globals.css` | overshoot противоречит «no bounce»; Pet-остров — уточнить у арт-директора, остаётся ли он вообще |
| Интро `#hero::before` (`intro-scale-y`), `.hero-frame rect` (`intro-draw`), `.hero-name-line` (`intro-clip`), `.hero-handle` fade | `globals.css`, `Hero.tsx` | заменяются crosshair-линиями и маской строки; `DrawFrame` и 4 handle-точки из hero убрать |
| `render-pass` / `roblox-pass` scroll-scrub, `--hud-opacity`-сдвиг `.hud-label`, `scale` у `.hud-line` | `globals.css`, `sections.ts` | концепция «render pass» QA→Game заменяется постоянной волосяной сеткой; scrub на каждый скролл — лишняя работа. Если арт-директор сохраняет переход миров — оставить только `render-pass` |
| Лестница `nth-child` stagger | `globals.css` | заменяется `--n` |
| `group-hover:scale-105 duration-300` | `Showroom.tsx` | → `.card-x`, 1.03 / 480ms expo |
| `shadowBlur` у багов и «release ready» | `BugHunt.tsx` | glow + стоимость кадра |
| `spring` с `bounce > 0` (если есть) | `GamePlayground.tsx`, `LanguageSwitcher.tsx` | проверить: `type: "tween"` или `bounce: 0`, `duration ≤ 0.24` |

Оставить без изменений: `MotionObserver` (механизм reveals и locale re-render), header `scroll()`-таймлайн, nav underline, mobile menu clip-path, toast/tooltip, `prefers-reduced-motion`-обвязку.

---

## 7. Чек-лист внедрения

1. Токены (§1) → `globals.css`; удалить `--ease-soft` и всё из таблицы «Удалить».
2. `.mask-line`, `draw-x/y`, `mask-up` + блок интро hero (§2); разметка имени и сетки в `Hero.tsx`; тексты подписей сетки — в `messages/*.json`.
3. `.pill` (§4.4) и перевод `Button` на неё (variants: default/outline, accent).
4. `Marquee.tsx` (server) + `MarqueeSpeed.tsx` (client) (§3); слова и aria-подписи — из content/messages; секцию добавить в `sections.ts`.
5. `data-reveal="label" | "mask"` + CSS (§4.1–4.2); `--n` в stagger.
6. `.card-x` на карточки проектов и Showroom (§4.4); аватар.
7. BugHunt рестайл (§5).
8. Проверка: reduced motion (DevTools → Rendering → emulate), клавиатура (focus-visible даёт то же, что hover; кнопка паузы marquee), тач (нет hover-only смыслов), Performance 4× throttle, CLS = 0, EN и RU (маска не режет кириллицу, marquee не ломает ширину страницы — нет горизонтального скролла на 360px).

---

## 8. Дополнение по видео-референсу (`reference-pinterest.mp4`, 16s)

По кадрам (`reference-pinterest-frames.png`, 1 кадр/с): панели сайта плавно прокручиваются (0–10s), на ~11s — RGB-split + горизонтальная нарезка слоёв (глитч) и возврат к hero, строки «3D TYPE» едут в чередующихся направлениях.

### 8.1 Глитч RGB-split / slice — дозированно

**Правила:** один всплеск ≤ 300ms, `animation-iteration-count: 1`, никогда не в цикле и не по таймеру. Не больше 2 «вспышек» за всплеск (WCAG 2.3.1: < 3 вспышек/с), только на небольших площадях. Цвета каналов — `--color-qa-accent` (розовый) и `--color-text` (холодный белый), без кислотной зелени из видео: палитра остаётся монохром + розовый. При reduced motion глитч выключен полностью.

**Где (и только тут):**

| Место | Триггер | Длит. |
|---|---|---|
| Имя в hero | один раз, сразу после маски (старт 980ms → конец 1220ms; бюджет интро сдвигается до ~1.2s) | 240ms |
| Заголовок карточки проекта | при входе hover / focus-visible (каждый вход = один всплеск) | 200ms |
| BugHunt, момент поимки | клик по багу — отрисовка в canvas, не CSS | 160ms |

Не применять: marquee, основной текст, кнопки, навигация, смена локали (там остаётся существующий clip re-render).

**CSS-подход:** две копии текста в псевдоэлементах (`content: attr(data-text) / ""` — пустой alt, скринридер не читает дубль), каждая окрашена в свой канал, сдвигается `transform` и нарезается `clip-path: inset()` на горизонтальные полосы; `steps()` даёт «рваный» шаг вместо плавности. Анимируются только `transform`, `opacity` и `clip-path` на тексте небольшой площади.

```css
.glitch { position: relative; }
.glitch::before, .glitch::after {
  content: attr(data-text) / "";
  position: absolute; inset: 0;
  pointer-events: none; opacity: 0;
}
.glitch::before { color: var(--color-qa-accent); }
.glitch::after  { color: var(--color-text); mix-blend-mode: difference; }

@keyframes glitch-a {
  0%   { opacity: 1; transform: translateX(-0.04em); clip-path: inset(12% 0 62% 0); }
  33%  { transform: translateX(0.05em);  clip-path: inset(58% 0 18% 0); }
  66%  { transform: translateX(-0.02em); clip-path: inset(34% 0 44% 0); }
  100% { opacity: 0; transform: none;     clip-path: inset(0 0 100% 0); }
}
@keyframes glitch-b {
  0%   { opacity: 1; transform: translateX(0.04em);  clip-path: inset(48% 0 30% 0); }
  50%  { transform: translateX(-0.05em); clip-path: inset(8% 0 76% 0); }
  100% { opacity: 0; transform: none;     clip-path: inset(0 0 100% 0); }
}
/* the base text itself jumps once horizontally (the "slice" from the video) */
@keyframes glitch-shift { 0%, 100% { transform: none; } 40% { transform: translateX(0.03em); } }

@media (prefers-reduced-motion: no-preference) {
  #hero .mask-line > .glitch {
    animation: mask-up var(--dur-mask) var(--ease-expo) calc(160ms + var(--i, 0) * 90ms) backwards,
               glitch-shift 240ms steps(3) 980ms 1;
  }
  #hero .glitch::before { animation: glitch-a 240ms steps(3) 980ms 1 both; }
  #hero .glitch::after  { animation: glitch-b 240ms steps(2) 1000ms 1 both; }

  @media (hover: hover) {
    .card-x:hover .glitch::before { animation: glitch-a 200ms steps(3) 1 both; }
    .card-x:hover .glitch::after  { animation: glitch-b 200ms steps(2) 1 both; }
  }
  .card-x:has(:focus-visible) .glitch::before { animation: glitch-a 200ms steps(3) 1 both; }
  .card-x:has(:focus-visible) .glitch::after  { animation: glitch-b 200ms steps(2) 1 both; }
}
```

Разметка: `<span className="glitch" data-text={t("firstName")}>{t("firstName")}</span>` — `data-text` из тех же переводов, не хардкод. Маска строки hero режет по вертикали, но горизонтальные сдвиги каналов должны быть видны: у `.mask-line` заменить `overflow: clip` на `overflow-x: visible; overflow-y: clip` (комбинация допустима именно с `clip`, не с `hidden`). Финальное состояние псевдо — `opacity: 0`, так что после всплеска на экране чистый текст.

**BugHunt (canvas):** в первые 160ms после `b.caught` рисовать прицел/баг трижды — розовым со сдвигом `-2px`, белым `+2px` (`globalCompositeOperation = "lighter"`), и сместить полосу canvas высотой 6px вокруг бага на `±3px` через `ctx.drawImage(canvas, …)` одного среза. Один всплеск на поимку, при reduced motion не рисуется.

**Переход «конец страницы → hero» из видео** на сайт не переносим: это монтажная склейка ролика, а не навигация. Ближайший аналог — глитч имени при загрузке.

### 8.2 Темп marquee против видео

Подтверждено направление: соседние строки едут навстречу друг другу. По темпу — **поправка к §3**: в видео строка сдвигается примерно на половину слова «3D TYPE» за секунду (кадры с шагом 1s чередуются между двумя фазами), то есть ~20% ширины плитки/с. В §3 заложено `40s + row × 6s` на полцикла трека — на desktop это ~100px/с ≈ 7% ширины вьюпорта/с, втрое медленнее референса.

Рекомендация: `animation: marquee calc(24s + var(--row) * 4s) linear infinite` при 3–4 словах в наборе (~140–170px/с на 1440px). Это всё ещё спокойнее видео, но сохраняет его «бег»: на полноширинной секции темп референса (20% экрана/с) мешает читать соседний контент. Скоростной буст от скролла (§3) оставить: он даёт видео-ощущение во время прокрутки.

Оговорка: кадры сняты раз в секунду, поэтому скорость из них определяется только приблизительно (возможен алиасинг). Точный темп снять по самому mp4 (покадрово, 30fps) или подобрать на глаз в браузере, меняя одну цифру `24s`.
