# PROJECT_AUDIT — проекты Sofia Stetsiuk

Дата аудита: 2026-10-18. Метод: только чтение исходных папок (README, docs, package.json, CLAUDE.md/AGENTS.md, .claude/agents, тесты, git log). `node_modules` не сканировались. Исходные проекты не изменялись.

Правило: факт есть, только если он подтверждён файлом или командой ниже. Всё остальное помечено «не подтверждено».

## Сводка

| # | Проект (реальное название) | Категория | Стек | Статус (по доказательствам) | Git / ссылки | Локальный путь |
|---|---|---|---|---|---|---|
| 1 | Grand Mall Batumi | Web: сайт ТЦ (EN/RU/KA) | Next.js 16.3.8, React 19.2.8, TS, Tailwind 4, next-intl 4.14.9, framer-motion, Playwright | **Released**: опубликован на Vercel, `https://grand-mall-three.vercel.app/en` → HTTP 200 (проверено 2026-10-18). Это не официальный сайт молла | `https://github.com/silestiari/grand-mall` (remote; публично отдаёт 404, вероятно приватный), 39 коммитов, 2026-10-06…10-14 | `C:\Users\tolik\Documents\woodcutter\grand-mall` |
| 2 | Metro City — demonstration website | Web: демо-сайт ТЦ (KA/EN/RU) | Next.js 16.4.1, React 19.3.0, TS 5 strict, Tailwind 4, своя i18n (`[lang]` + словари), Playwright | **In Development**: демо, noindex, «It is not yet the official website». Запуск ждёт письменного разрешения | git init без коммитов, remote нет | `C:\Users\tolik\Documents\metrocity` |
| 3 | Sakhli (სახლი) | Web: лендинг ресторана (KA/EN/RU) | Next.js ^16.4.1, React ^19.3.1, TS ^7.0.2, Tailwind 4.3.3, next-intl 4.14.9, motion 14.2, sharp | **In Development**: не задеплоен (remote нет), фото и меню TODO | 7 коммитов 2026-10-15, remote нет | `C:\Users\tolik\Documents\sakhli` |
| 4 | Woodcutter — «Лесоруб против зомби» | Roblox: тайкун + tower defense, dark fantasy | Luau, Rojo 7.7.0 (aftman), Blender (FBX), graphify | **Released** (по заданию). Косвенно: в CLAUDE.md есть «Проверка перед релизом (12 октября 2026)» и «Самопроверка опубликованной игры». Ссылка на Roblox place не найдена | git нет | `C:\Users\tolik\Documents\woodcutter\woodcutter` (+ `.rbxl` и `.zip` — ранние снимки) |
| 5 | Cabin Chaos | Roblox: кооперативная party-игра для 1–4 бортпроводников | Luau, Rojo 7.7.1, Codex multi-agent + Claude Code, Blender 5.2 (Python), Python-тесты, Remotion/FFmpeg для роликов | **In Development**: публикация игры не подтверждена («перелёт только в опубликованной игре… не проверено»). Промо-шортсы запланированы на YouTube-канале DEVsilestiari | git init без коммитов, remote нет | `C:\Users\tolik\Documents\CabinChaos-Codex-Starter\CabinChaos-Codex-Starter` |
| 6 | PILLARS: Hide & Stack | Roblox: мультиплеерные прятки/сбор блоков | Luau, Rojo 7.7.1, lune 0.11, luau-lsp, run-in-roblox | **In Development (подготовка к релизу)**: тег `v1.0`, чек-лист релиза, ID Developer Products вписаны. Публикация и ссылка не подтверждены | 30 коммитов 2026-10-16…10-17, тег v1.0, remote нет | `C:\Users\tolik\Documents\PILLARS` |
| 7 | Petforge Arena («рабочее название») | Roblox: сборка питомца из частей + мини-игры + авто-PvP | Luau, Rojo 7.7.1, lune 0.11, Blender (генераторы на Python) | **In Development**: lune-тесты 78/78, ручные проверки в Studio — NOT RUN | git init без коммитов, remote нет | `C:\Users\tolik\Documents\питомцы` |

---

## 1. Grand Mall Batumi

- **Что это.** Сайт ТЦ Grand Mall Batumi, три языка: EN, RU, KA (`/en`, `/ru`, `/ka`). Есть главная, `/stores` (80 магазинов), `/dining` (15), `/entertainment` (4), `/map`, `/visit`, `/events`, `/offers`, страницы деталей, локализованные 404. Источник: `README.md`, `docs/claude-handoff.md`.
- **Сайт ли это.** Да. Next.js-приложение, `package.json`, `app/[locale]/…`.
- **Стек** (`package.json`, `docs/claude-handoff.md` по `npm ls`): next 16.3.8, react/react-dom 19.2.8, next-intl 4.14.9, framer-motion 14.0.0, tailwindcss 4.3.3, TypeScript 6.0.2 (API) + 7.0.2 (`tsc`), ESLint 9.39.5, @playwright/test 1.63.0.
- **Реализовано** (код и handoff):
  - каталог Stores: поиск, фильтры по категории и этажу, счётчик, сброс, фильтры в URL — `components/store-directory.tsx`, `data/stores.ts`;
  - карта `/map`: общий каталог из 99 записей, этажи, deep links `?type=&slug=`, серверный рендер — `lib/directory.ts`, `lib/map-data.ts`. Карта иллюстративная, не точный план;
  - i18n через copyKey-хэши (`i18n/translate.ts`, `messages/*.json`, по 522 ключа);
  - SEO: canonical, hreflang, OG, sitemap (321 URL), robots;
  - тёмная тема с переключателем (коммит 2026-10-14 «Add a dark theme with a header toggle», есть тест);
  - доступность: skip link, `<dialog>`-поиск, `role=status`, reduced motion;
  - 308-редиректы старых slug (`giordano` → `adidas`, `tefal` → `shavdia`).
- **Не реализовано / пусто:** Events и Offers пусты (публикация только при `verified` + `source`). Точные координаты на карте не подключены. Источник: README, handoff.
- **QA:**
  - `tests/critical-journeys.spec.ts`: 11 Playwright-сценариев («все проходят» — `docs/claude-handoff.md`, итерация 1);
  - `docs/portfolio-qa-case-study.md` (EN, готовый QA-кейс для портфолио), `docs/prelaunch-qa-final.md` (6 октября 2026): 151 interaction check, 48 Axe checks, 321 внутренняя ссылка HTTP 200, 192 комбинации страница/viewport, 57 проверок на 320 px;
  - Lighthouse (handoff, локальный prod, lab): /en mobile 91–92 после оптимизации, desktop 99;
  - ограничения: физические Safari/iOS/Android не тестировались; Axe — не сертификация.
- **AI / multi-agent:** `CLAUDE.md`, `AGENTS.md`; `.claude/agents/` — 8 субагентов VoltAgent (ui-designer, nextjs-developer, ui-ux-tester, performance-engineer, accessibility-tester, seo-specialist, test-automator, code-reviewer); Playwright MCP, Serena (`.serena/`). Handoff: «Проект передан от Codex» в Claude Code 14.10.2026. Ветки `claude/first-iteration`, `claude/premium-refresh`, `claude/iteration-3`, `claude/stock-entertainment`.
- **Скриншоты для сайта** (`.verification/`, в git не входит; 269 файлов):
  - `.verification/claude-onboarding/after/en-home-1440.png`, `ru-home-1440.png`, `ka-home-390.png`, `ru-stores-1440.png`, `en-store-adidas-1440.png`;
  - `.verification/dark/v2/home-1440.jpg`, `stores-1440.jpg`, `map-1440.jpg`, `dining-1440.jpg`, `entertainment-1440.jpg`, `404-dark.png`.
- **Права на изображения.** Внутри сайта часть картинок — официальные изображения брендов (`public/images/official`, `public/images/stores/SOURCES.md`; 74 добавлены «с согласия владельца», handoff), часть сгенерирована (`*-ASSETS.md`), часть стоковая (`public/images/stock`). Фасад в hero — архитектурный рендер, не фото. Скриншоты сайта в портфолио содержат эти изображения: права на их повторное использование в портфолио отдельно не подтверждены.
- **Ссылки:** live `https://grand-mall-three.vercel.app` (`lib/site-url.ts`; HTTP 200 на 2026-10-18). GitHub `https://github.com/silestiari/grand-mall`: публично 404.
- **Сложности и решения** (README, handoff): переполнение и обрезка RU/KA-заголовков исправлены в `app/i18n.css` (195 комбинаций без overflow); LCP mobile уменьшен (/en 3.9–4.5 s → 3.3–3.5 s) за счёт загрузки шрифтов по требованию; ESLint оставлен на 9 из-за несовместимости плагинов; несоответствия официальных данных (исторические slug, ошибочные ссылки) не угадывались, а документировались.
- **Не подтверждено:** официальная связь с ТЦ или заказ; роль Софии сверх формулировки кейса («Website development and QA project contributor»).

## 2. Metro City (demonstration website)

- **Что это.** Демо-сайт ТЦ Metro City (Батуми) для руководства молла, KA/EN/RU. «It is not yet the official website», noindex. Разрешение на бренд «reported 2026-10-15». Источники: `README.md`, `CLAUDE.md`, `docs/launch-checklist.md`.
- **Стек** (`package.json`): next 16.4.1, react 19.3.0, typescript ^5 (strict), tailwindcss ^4 (@tailwindcss/turbopack), playwright ^1.64.1. i18n — встроенный паттерн Next.js `app/[lang]` + `getDictionary()` (`src/i18n.ts`), без next-intl.
- **Реализовано:**
  - маршруты home, stores, dining, entertainment, events, map, visit, about, 404 (`src/app/[lang]/`);
  - каталог арендаторов со статусами verified/unconfirmed (`src/data/tenants.ts`);
  - поиск и фильтры-чипы с состоянием в URL (`src/lib/search.ts`, `src/components/directory.tsx`);
  - события, которые сами исчезают после даты окончания (`src/lib/events.ts`);
  - CSS-анимации только под `prefers-reduced-motion: no-preference`.
- **Не готово** (`docs/launch-checklist.md`): часы работы, контакты, полный список арендаторов, лицензированные фото здания, индексация (отключена в трёх местах). Развлечения — пустое состояние.
- **QA** (`docs/qa-report.md`, 2026-10-15):
  - lint 0/0, typecheck pass, unit 4/4, build 34 статические страницы;
  - E2E smoke 46/46 (первый прогон 44/46, дефекты F-1 и F-2 исправлены и перепроверены);
  - матрица 165 загрузок (11 маршрутов × 3 языка × 5 ширин) + axe: 0 нарушений;
  - Lighthouse mobile /ka: Perf 93, A11y 100, BP 100, SEO 69 (из-за намеренного noindex);
  - тестировался только Chromium, без WebKit/Firefox и реальных устройств.
  - Тесты: `tests/unit/search.test.mts`, `tests/e2e/smoke.mjs`.
- **AI / multi-agent:** `CLAUDE.md` + `AGENTS.md` с таблицей владения файлами; `.claude/agents/` — 14 агентов (brand-art-director, ui-designer, ux-designer, motion-designer, nextjs-developer, content-localization-reviewer, qa-functional-tester, qa-responsive-accessibility-tester, performance-seo-reviewer, impeccable-*, motion-reviewer); `skills-lock.json` (design-taste-frontend, impeccable, motion, ui-ux-pro-max); `.claude/skills/` (10).
- **Скриншоты:** `qa-artifacts/` — `en-home-1440.png`, `final-en-stores-1440.png`, `final-ka-today-1440.jpg`, `final-ru-visit-390.jpg`, `v2-en-home-1440.jpg`; `qa-artifacts/design4/` — `en-home-1440.jpg`, `ka-home-390.jpg`, `en-map-1440.jpg`, `en-tenant-1440.jpg` и др. (1440/768/390).
- **Изображения:** фото района New Boulevard под CC BY с указанием авторов (`public/images/`, `docs/image-credits.md`); логотип `public/brand/metrocity-logo.jpg` (разрешение на бренд — со слов владельца проекта).
- **Ссылки:** нет (не опубликован, remote нет, коммитов нет).

## 3. Sakhli

- **Что это.** Одностраничный лендинг ресторана Sakhli (სახლი, «дом»), Батуми, KA/EN/RU. Бронь через WhatsApp и телефон, без бэкенда. Источники: `README.md`, `PLAN.md`, `PRODUCT.md`.
- **Стек** (`package.json`): next ^16.4.1, react ^19.3.1, next-intl ^4.14.9, motion ^14.2.0, tailwindcss ^4.3.3, typescript ^7.0.2, sharp (скрипт `scripts/photos.mjs` считает размеры и blur-превью).
- **Реализовано** (`PLAN.md`, все задачи «done»; git log):
  - секции лендинга и контент из `content/{ka,en,ru}.json`, SEO и JSON-LD в `content/seo.json`;
  - живой пруд с рыбами и рябью — `components/pond-sim.ts`;
  - hero-дом по времени Тбилиси (день/вечер/ночь), scroll walk-through, свечение ламп, лайтбокс галереи (`components/lightbox.tsx`);
  - кинетические заголовки, «одометр» цифр, view transition при смене языка (`components/motion.tsx`);
  - ограничение autoplay-движения (WCAG 2.2.2).
- **Не реализовано / TODO** (README): фото (`public/photos/` пуст, показываются помеченные заглушки), меню и цены, события, условия коворкинга, боевой домен, кнопка «Скопировать адрес», вычитка грузинского носителем.
- **QA** (`QA.md`, 2026-10-15): Lighthouse 13.5 mobile /ka 91/100/100/100, /en 92/100/100/100, /ru 91/100/100/100; после фаз 2–3 — perf 92–93, a11y 100 (`PLAN.md`). Чек-лист из 20+ пунктов: контраст, skip link, focus, dialog, 0 overflow в 18 прогонах, грузинские переносы, шрифты (CDP), reduced motion, работа без JS. Отдельный «Fact audit» убрал неподтверждённые фразы («Open daily» и др.).
- **AI / multi-agent:** `PLAN.md` — 7 ролей-агентов (Brand & Content Strategist, UX Architect, Visual Designer, Frontend Engineer, Motion Engineer, QA & Polish, Lead); skills в `.claude/skills/` и `skills-lock.json`; `PRODUCT.md` помечен «Inferred by the Visual Designer agent».
- **Скриншоты:** только `.playwright-mcp/mobile-ka.png`. Других скриншотов не найдено, реальных фото заведения нет.
- **Ссылки:** нет. В README только инструкция по деплою на Vercel с плейсхолдером `<you>`.

## 4. Woodcutter vs Zombies — «Лесоруб против зомби»

- **Что это.** Roblox-тайкун: рубка леса → прокачка топора → помощники → брёвна в доски → продажа и стройка (забор, замок, башни) → оборона от ночных волн зомби. Стиль dark fantasy. Источник: `woodcutter\woodcutter\CLAUDE.md` (заголовок «Woodcutter — Roblox-тайкун «лесоруб против зомби»»).
- **Роль Софии** (там же): «код пишет Claude, я вставляю, тестирую и занимаюсь дизайном». Многие механики помечены «проверено Софией», «идея Софии», «просьба Софии».
- **Стек:** Luau; Rojo 7.7.0 через aftman (`aftman.toml`, `default.project.json`); 108 файлов в `src/`, около 38.7k строк `.luau`; graphify (граф кода `graphify-out/`); Blender MCP (`blender-mcp/`).
- **Реализовано** (модули в `src/server/`, `src/client/`, раздел CLAUDE.md «Что уже работает»):
  - рубка кликами, 5 топоров до бензопилы, рюкзак с 9 уровнями;
  - лесопилка, склады, конвейеры, помощники (видимые человечки);
  - 6 участков с расширениями за монеты;
  - забор из 36 секций, замок (3 этажа) с расстановкой мебели (в т.ч. на телефоне), 4 башни, фонари, фонтан, сад, дорожки;
  - мебельная мастерская, клиенты-NPC с заказами и очередью, место ожидания, VIP-кафе;
  - смена дня и ночи, ночные волны зомби, боссы (летающий дракон), оружие (дубина → арбалет), броня;
  - PvP ночью вне участков, ночные набеги;
  - питомцы (кошка, призрачная собака, ворон, летучая мышь);
  - обучение из 11 заданий, достижения (57 ступеней), ежедневная награда, бусты;
  - геймпассы (ID вписаны в `src/server/Config.luau`), пакеты монет, лобби для друзей, таблица лидеров, DataStore-сохранение;
  - `SelfTest` (`/selftest`) и кино-режим `/cinema` для роликов (последний — «ждёт проверки»).
- **Запланировано, не сделано** (CLAUDE.md «Планы», п.7): перерождение (Rebirth), праздничные события.
- **QA:** автотестов нет. Есть:
  - агенты `tester` и `reviewer` (`.claude/agents/`, только читают код), найденные проблемы исправлены: защита геймпассов от подделки сигнала, ProcessReceipt только после успешного сохранения, серверная проверка дистанции и частоты рубки, xpcall-запуск модулей;
  - внутриигровой `src/server/SelfTest.luau`: проверяет 9 геймпассов, DataStore, модели, 6 участков, Max Players = 6;
  - ручные проверки Софии в Studio.
- **AI / multi-agent:** `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/agents/` (blender, reviewer, tester), `.claude/skills/`, `.mcp.json`, graphify.
- **Изображения:**
  - превью моделей: `blender/preview_9_models.png`, `preview_dragon.png`, `preview_castle_decor.png`, `preview_zombies_knights.png`, `preview_lamps_fountain.png`, `preview_fountain_*.png`;
  - экраны загрузки: `blender/loading/_full_castle.png`, `_full_center.png`, `_full_dragon.png`, `_full_zombies.png`;
  - иконки и плащи: `blender/icons/`, `blender/cloaks/`.
  - Скриншотов геймплея из самой игры не найдено.
- **3D:** `blender/woodcutter_models.blend`, 183 `.fbx` в `blender/`, 2 `.py`.
- **Прочее:** `C:\Users\tolik\Documents\лесоруб против зомби.rbxl` (98 KB, 2026-09-30) и `C:\Users\tolik\Documents\woodcutter.zip` (5 KB, 9 файлов, 2026-09-30) — ранние снимки начала проекта, не текущая версия. `backup/` — старые копии скриптов.
- **Ссылки:** Roblox place / experience URL не найден. Git нет.

## 5. Cabin Chaos

- **Что это.** «Cartoon cooperative Roblox party-game for 1–4 cabin crew. Not a realistic aviation simulator» (`AGENTS.md`). Игроки обслуживают пассажиров в салоне самолёта (кофе, кола, еда), следят за терпением пассажиров, справляются с хаосом.
- **Важно про структуру.** Реальный проект лежит во вложенной папке `CabinChaos-Codex-Starter\CabinChaos-Codex-Starter\` (54 файла `src`, около 8.4k строк Luau). Внешний `src/` — шаблон Rojo из 3 файлов.
- **Стек:** Luau, Rojo 7.7.1 (aftman), Roblox Studio MCP, Blender MCP + Blender 5.2 headless (Python), Python-раннеры тестов, Remotion 4 + FFmpeg для видео.
- **Реализовано** (`PROJECT_STATE.md`, 608 строк, журнал по датам 2026-10-08…10-15):
  - MVP-цикл: 12 пассажиров, заказы Coffee/Cola/Meal, перенос и доставка, очки, терпение, раунд 300 с;
  - тележка (толкание, груз, тормоз, поворот, защита от застревания);
  - особые пассажиры: Robot, SleepyMonster/Mochi, Вампир, Слизень/Bloop; Chaos Meter, цепочка «пролитый кофе → лужа → жалобы → швабра», отключение света, ночной и VIP-рейсы;
  - лобби на 1–4 игрока с гейтами и ReserveServer/Teleport;
  - магазин экипажа (косметика за Crew Coins и Robux), геймпассы и пакеты монет с реальными ID;
  - локализация EN/RU (`src/shared/Locale.luau`), адаптация UI под телефон, музыка.
- **Не проверено** (там же): настоящий телепорт и 2+ игрока — «только после публикации»; реальные Robux-покупки в Play частично. Сцена gameplay-03 заблокирована: нужно 2+ живых игрока.
- **QA и тесты:** `tests/mvp` (в т.ч. scenario_shop: 67 проверок, scenario_lobby: 16), `tests/chaos`, `tests/drink_balance`, `tests/specials`, `tests/spill_chain`, `tests/locale` (207 проверок). Последние записи — «Тесты 6 наборов PASS». Ранее: «QA 127 mocked assertions», «geometry 81450 checks». Аудит геймплея — `docs/GAMEPLAY_AUDIT.md`. Видео-QA (громкость LUFS/TP, кадры) — `marketing/qa/*.json`.
- **AI / multi-agent** (сильнее всего выражено среди 7 проектов):
  - Codex multi-agent: `.codex/config.toml` (`[agents] enabled = true`, `max_concurrent_threads_per_session = 6`, MCP blender + roblox_studio); `.codex/agents/*.toml` — architect, gameplay, ui-ux, qa-tester, reviewer, explorer, blender-artist;
  - Claude Code: `.claude/agents/` — game-director, roblox-architect, luau-developer, monster-ai-developer, ui-ux-designer, audio-animation-designer, blender-artist, qa-engineer, security-performance-reviewer; во внешней папке ещё cinematic-director и gameplay-shorts-editor;
  - skills: `.agents/skills/cabin-blender-assets`, `cabin-studio-workflow`, `remotion-best-practices`;
  - промпты: `prompts/FIRST_TASK.md`, этапы Prompt24…Prompt30 в `AGENTS.md` и `PROJECT_STATE.md`;
  - правило координатора: read-only агенты параллельно, два агента не редактируют один файл;
  - переход Codex → Claude Code виден по записям «(Claude Code), 2026-10-15».
- **Видео и изображения:**
  - `assets/video/CabinChaos_gameplay.mp4` (31 с, без звука);
  - `marketing/renders/cinematic/{en,ru}/cabin-chaos_cinematic-0{1,2}_*.mp4`, `marketing/renders/gameplay/{en,ru}/cabin-chaos_gameplay-0{1,2}_*.mp4` (1080×1920);
  - кадры `marketing/qa/stills/…`, `docs/previews/passenger-ui.png`, `C:\Users\tolik\Documents\CabinChaos-Codex-Starter\yt1.png`.
- **3D:** 14 `.blend` в `assets/*/` (CabinKit, ServiceTrolley, PassengerSeat, CoffeeStation, CrewUniform, LobbyGate, SpecialPassengers и др.), 33 `.fbx`.
- **Ссылки:** YouTube Shorts, канал DEVsilestiari, запланированы на 16–19 октября 2026 (`marketing/publish/YOUTUBE_PUBLISHED.md`): https://youtube.com/shorts/JF11jGD5qEY, https://youtube.com/shorts/1p6e9-TDUak, https://youtube.com/shorts/cvZ4Vb6wnDk, https://youtube.com/shorts/tpRMfAwZTqY, https://youtube.com/shorts/VfoEuD67nWE, https://youtube.com/shorts/jLhG6JoUADs, https://youtube.com/shorts/D-HhgxdSOls, https://youtube.com/shorts/Czsh_NJDR1E. Фактическая публикация не проверялась. Roblox place URL не найден.
- **Сложности и решения:** ориентация импортированных FBX (правила в `AGENTS.md`); «прилипание» тележки к препятствиям (поворот со сдвигом в 8 сторон: было 3–9 «стояний» за поездку, стало 0–1); Push принимался только со стороны ручки (исправлено); дрожание подсказок (откат пересчёта раскладки); выравнивание громкости по PlaybackLoudness.

## 6. PILLARS: Hide & Stack

- **Что это.** «A Roblox multiplayer hide-and-seek block game inspired by the Minecraft "Pillars" minigame»: у каждого 15 блоков своего цвета, их прячут, потом ищут чужие и строят столб; выигрывает самый высокий столб (`README.md`).
- **Стек:** Luau, Rojo 7.7.1, lune 0.11, luau-lsp 1.70.1, run-in-roblox 0.3; 45 файлов, около 12.4k строк Luau.
- **Реализовано** (git log, `docs/`):
  - 13 процедурных воксельных карт: Rainbow Hamlet, Sky Gardens, Crystal Depths, Airport, Planetoid, Giant Apartment, Robot Yard, City, Pirate Cove, Volcano Island, Haunted Mansion, Amusement Park, Desert Temple (`docs/VOXEL_MAPS.md`);
  - лобби на небесном острове с гейтами 2/4/6/8 и «гейтом друзей», reserved-server матчи;
  - голосование за карту по числу игроков;
  - монеты, магазин и инвентарь (Speed, Hint, Radar, Glow, Camo, Friends Ticket) за монеты или Robux с дедупликацией чеков;
  - прятанье в воде, цветах и нишах; музыка по фазам и звуки; страница в магазине EN/RU.
- **QA** (`docs/QA.md`): syntax pass; logic 29/29; maps — 13 карт собираются, от спавна доступно 84–97 % поверхности; types 0 ошибок; Studio engine SELFTEST PASS на всех 13 картах. Ручной чек-лист в Studio — «NOT yet executed». Есть `docs/SECURITY.md`, `docs/PERFORMANCE.md`, известные баги.
- **AI / multi-agent:** `.claude/agents/` — 9 агентов (project-architect, game-designer, gameplay-engineer, environment-artist, map-import-specialist, performance-engineer, qa-engineer, security-engineer, ui-ux-designer); коммит «Stage 1-2: architecture, agents, playable prototype», «Apply security and game design review fixes».
- **Изображения и видео:** `assets/promo/icon_{en,ru}.png`, `thumbnail_{1,2}_{en,ru}.png`; `assets/shop/*.png` (7 иконок); `assets/video/pillars_tiktok_{en,ru}.mp4`.
- **3D:** нет — все карты процедурные из Roblox parts (`docs/RELEASE.md`).
- **Ссылки:** не найдены. Тег `v1.0`, публикация не подтверждена.

## 7. Petforge Arena (= «Собери питомца»?)

- **Название.** В README, мастер-промпте и туториале игры («Добро пожаловать в Petforge Arena!», `src/shared/Localization.luau`) используется **Petforge Arena**. В промпте указано «working title; make it easy to rename». Фраза «собери питомца» встречается только как текст ошибки («Сначала собери питомца» / «Build your pet first»). То, что это проект «Собери питомца / Build Your Pet», по смыслу совпадает (игра про сборку питомца из частей), но **название «Build Your Pet» в исходниках не найдено**.
- **Что это.** Игра про сборку питомца из 6 частей (голова, тело, передние и задние лапы, хвост, спина). У частей есть стихии (Огонь, Камень, Дерево, Воздух) и редкости. Части добываются в мини-играх зон, в Башне NPC, в гонке Sky Ring Rush (2–8 игроков) и в авто-PvP с 15 уровня (`README.md`).
- **Стек:** Luau, Rojo 7.7.1, lune 0.11 (`tools/lune.exe`); 89 файлов, около 20.3k строк Luau; Blender-генераторы (`blender/generators`, `blender/scripts`); таблица баланса `Petforge_Arena_Game_Data.xlsx`.
- **Реализовано / проверено** (`docs/QA_PLAN.md`, 2026-10-17):
  - lune: **78 passed, 0 failed**, покрыты Data, Loot, PetBuild, Combat, Progression, ProfileSchema, MinigameRules, интеграция с mock DataStore;
  - 19 из 21 кейса матрицы — PASS, 1 FAIL (13b: Chromatic при полном инвентаре), 1 NOT RUN (абуз приватных серверов).
  - Найдены дефекты BUG-1…4, все помечены FIXED (BUG-3 — «not playtested»); GAP-1 (фарм PvP альтами) открыт. Строка матрицы 13b при этом осталась FAIL — несоответствие внутри документа.
- **Не проверено:** все ручные проверки Studio ST-1…ST-11 — NOT RUN. Зоны, соревнования, лидерборды и магазин в lune не покрыты. Многое в мастер-промпте — спецификация; реализованность каждого пункта отдельно не сверялась.
- **Сет-бонусы стихий** (`src/shared/Data/SetBonuses.luau`, применение — `src/shared/PetBuild.luau`, отображение — `src/client/UI/Collection.luau`): пороги 2/4/6 частей одной стихии. 2 — пассивный бонус к характеристике (напр. +8% DEF у Камня, +10% к урону ожога у Огня); 4 — активная способность стихии; 6 — усиление способности 4-сета (заменяет её, не добавляет слот). Одновременно активна максимум одна способность стихии. Стихий в коде 5: FIRE, STONE, WOOD, AIR, WATER (`src/shared/Enums.luau`; WATER добавлена вручную, в README указано 4). Редкость частей масштабирует характеристики (`Data/Parts.luau`, `Config.RARITY_STAT_MULT`).
- **AI / multi-agent:** мастер-промпт `Petforge_Arena_Claude_Code_Prompt.md` («lead engineer and multi-agent coordinator»); `.claude/agents/` — 11 агентов (game-director, roblox-architect, pet-build-systems, combat-ai-engineer, economy-progression-designer, world-minigame-designer, ui-ux-designer, blender-3d-artist, qa-automation-tester, security-performance-reviewer, integration-release-manager); `docs/tasks/` — задания по агентам.
- **Изображения:** `blender/previews/ALL_PETS.png`, `AIR_PET.png`, `FIRE_PET.png`, `STONE_PET.png`, `WOOD_PET.png`, `HYBRID_1.png`, `HYBRID_2.png`, `PARTS_GRID.png` (+ папки `v2`, `v2_proto`, `world`).
- **3D:** `blender/exports/` (134 файла `.fbx`/`.obj`: части по стихиям + орнаменты по редкостям), `blender/assets`, `manifest.json`, `world_manifest.json`.
- **Ссылки:** нет.

---

## Прочее

- **C:\Users\tolik\Pictures** (17 файлов, 2026-10-05). Фото Grand Mall, судя по именам — скачаны из интернета: `Bouling_Grand_Mall_-_2.width-1200.jpg`, `Grand_Mall_Shopping_Center_in_B.max-1200x630.format-jpeg.jpg`, `food-cort-v-grand-mall-batumi.jpg`, `grand-mall-batumi006.webp`, `GRAND-MALL-new.webp`, `grandmall-main.jpg`, `grandmall.png`, `orig.jpg`, `images.jpg` и др. Копии лежат в `C:\Users\tolik\Documents\мои рисунки`. **Права на использование не подтверждены — на сайте портфолио не использовать.**
- **VALORANT-Content-Factory** (`C:\Users\tolik\Documents\VALORANT-Content-Factory`). Не входит в 7 проектов. Собственный конвейер: запись матча → вертикальные ролики RU/EN с субтитрами, озвучкой (локальный Chatterbox TTS) и автопубликацией на YouTube. 26 Claude-агентов в `.claude/agents/`. Может пригодиться для AI Workflow Lab.
- **Ubisoft** — проигнорирован по заданию.

## Не найдено / не подтверждено

- Ссылки на Roblox place / experience для Woodcutter, Cabin Chaos, PILLARS, Petforge Arena — **не найдены**.
- Публичные GitHub-репозитории silestiari: API `users/silestiari/repos` вернул пустой список; `github.com/silestiari/grand-mall` → 404 (вероятно приватный). У остальных 6 проектов git remote нет.
- Vercel: подтверждён только Grand Mall (`grand-mall-three.vercel.app`). Sakhli и Metro City не задеплоены.
- Статус Released подтверждён для Grand Mall (live) и задан заданием для Woodcutter. Для остальных — In Development.
- Название «Build Your Pet / Собери питомца» как официальное — не подтверждено (в исходниках Petforge Arena).
- Метрики игроков (визиты, CCU, доход) — нигде не найдены.
- Реальные скриншоты геймплея Woodcutter — не найдены (только Blender-превью и экраны загрузки).
- Фото заведения Sakhli — отсутствуют.
- Публикация YouTube Shorts Cabin Chaos после запланированного времени — не проверялась.
- Личный вклад Софии в веб-проекты (Grand Mall, Metro City, Sakhli) сверх «AI-assisted разработка + QA» — явно не описан. В Woodcutter роль описана в CLAUDE.md.
- Недоступных путей нет: все переданные пути открылись.
