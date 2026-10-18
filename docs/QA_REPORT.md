# QA Report — портфолио Sofia Stetsiuk

Дата: 2026-10-18. Тестировщик: независимый QA-агент (код приложения не менялся). План: `docs/TEST_PLAN.md`.
Окружение: Windows 11, Node 24, Next.js 16.4.2 production build (BUILD_ID `4Zm5XI7t8SG1I67ORa28t`), Chromium headless (Playwright 1.64), WebGL через SwiftShader.

## Сводка

- S1 и S2 дефектов не найдено. Найдено 6 дефектов S3 и 5 дефектов S4.
- Ключевые сценарии работают: навигация, skip-link, Tab-обход без ловушек с видимым фокусом на всех 109 остановках, мобильное меню (модальное, Esc, возврат фокуса), переключение EN/RU с сохранением пути и якоря, cookie, редиректы, все 14 кейсов → 200, 404 для неизвестного slug, контакты и копирование email (с фолбэком), Showroom (11 моделей, все контролы, 4 пасса, 2 фона, фолбэк без WebGL, мобильный режим), QA Playground (все 5 демо-багов находятся, отчёты, Reveal all, Reset), Pet Builder, AI Lab.
- Горизонтального скролла нет ни на одной из 6 ширин (360–1920) на 7 проверенных страницах. Обрезанного RU-текста не найдено (кроме намеренного BUG-005 в песочнице).
- Основные проблемы: axe `serious` на всех страницах (Label in Name у логотипа и переключателя языка; список в AI Lab), непереведённые вкладки QA Playground в `/ru`, гонка Randomize → Reset в Pet Builder, нет `og:image` на главных, SEO-URL указывают на `localhost:3000` в этой сборке.

## Результаты автопроверок

| Проверка | Результат |
|---|---|
| `npm run lint` | PASS (0 ошибок, включая новые e2e) |
| `npm run typecheck` | PASS |
| `npm run check:i18n` | PASS — 308 ключей в en и ru (проверяет только наличие ключей, не перевод: см. D-03) |
| `npm run build` | PASS — 21 статическая страница, sitemap, robots |
| `npm run test:e2e` (исходные 5 тестов) | 5/5 PASS |
| `npm run test:e2e` (после добавления тестов) | 55 тестов: 47 PASS, 8 FAIL — все 8 падений соответствуют открытым дефектам ниже |

Падающие тесты (не подгонялись под баги):

| Тест | Дефект |
|---|---|
| `a11y-layout.spec.ts` › axe: /en, /ru, /en/projects/cabin-chaos, /ru/projects/build-your-pet | D-01, D-02, D-07 |
| `i18n-routing.spec.ts` › RU: QA Playground widget tabs are translated | D-03 |
| `playgrounds.spec.ts` › Pet Builder: Reset clicked right after Randomize… | D-04 |
| `routing-seo.spec.ts` › home SEO › /en, /ru | D-05 |

Новые файлы тестов: `e2e/routing-seo.spec.ts`, `e2e/i18n-routing.spec.ts`, `e2e/a11y-layout.spec.ts`, `e2e/navigation-contact.spec.ts`, `e2e/playgrounds.spec.ts`. Добавлена devDependency `@axe-core/playwright`.

## Дефекты

| ID | Title | Sev | Steps | Expected | Actual | Страница / viewport |
|---|---|---|---|---|---|---|
| D-01 | Доступное имя логотипа и переключателя языка не содержит видимый текст (WCAG 2.5.3 Label in Name) | S3 | 1. Открыть `/en`. 2. Запустить axe. | Имя содержит видимый текст: логотип «SS_», ссылки «EN»/«RU» (например, `aria-label="EN — English"` или без aria-label + `title`/sr-only). | axe `label-content-name-mismatch` (serious), 3 узла: логотип `SS_` с `aria-label="Sofia Stetsiuk — back to top"`, ссылки `EN`/`RU` с `aria-label="English"/"Русский"`. Пользователь голосового управления, говорящий «нажми EN», не попадёт. `Header.tsx:51`, `LanguageSwitcher.tsx:46`. | все 16 страниц, все ширины (переключатель виден и на 390) |
| D-02 | AI Lab: `<ul role="tabpanel">` ломает семантику списка | S3 | 1. `/en#ai-lab`. 2. axe. | Панель роли — обёртка `div role="tabpanel"` со списком `ul` внутри. | axe `listitem` (serious): `li` без родителя-списка (роль `ul` заменена на tabpanel); `aria-allowed-role` (minor) на `#ai-role-panel`. `WorkflowGraph.tsx:197`. | `/en`, `/ru`, все ширины |
| D-03 | Вкладки виджетов QA Playground в `/ru` не переведены | S3 | 1. Открыть `/ru#qa-playground`. 2. Посмотреть вкладки над песочницей. | Русские подписи (например «Оформление», «Корзина», «Инвентарь», «Регистрация», «Карточка»). | «CHECKOUT · CART · INVENTORY · SIGN-UP · ITEM CARD» — в `ru.json` `sections.qa-playground.widgets.*` значения скопированы из en. `check:i18n` это не ловит. | `/ru`, все ширины |
| D-04 | Pet Builder: Reset сразу после Randomize перезаписывается отложенными частями | S3 | 1. `/en#game-playground`. 2. Нажать «Randomize». 3. В течение ~0,4 с нажать «Reset». 4. Подождать 1 с. | Питомец по умолчанию: Cotton Cloud × 6, аксессуар «None». | Случайная сборка (воспроизведено 9/10; e2e 3/3): `randomize()` ставит 7 `setTimeout` со stagger 60 мс, `reset()` их не отменяет. То же при ручном выборе части во время stagger. `GamePlayground.tsx` (`randomize`/`reset`). | `/en`, `/ru`, все ширины |
| D-05 | Нет `og:image` на главных страницах | S3 | 1. `curl /en`. 2. Искать `og:image`. | Превью-картинка для соцсетей/мессенджеров (у кейсов она есть). | `og:image` отсутствует, `twitter:card=summary` без картинки. Ссылка на портфолио в LinkedIn/Telegram будет без превью. | `/en`, `/ru` |
| D-06 | Canonical, hreflang, og:url, sitemap и robots указывают на `http://localhost:3000` | S3 | 1. `npm run build` без `NEXT_PUBLIC_SITE_URL`. 2. Открыть `/sitemap.xml`, исходник `/en`. | Абсолютные URL боевого домена. | Все URL — `http://localhost:3000/...` (фолбэк в `src/lib/seo.ts`, `.env.example`). Не баг кода, но блокер релиза: перед деплоем обязательно задать `NEXT_PUBLIC_SITE_URL`, иначе поисковики получат неверные canonical. | все страницы, sitemap, robots |
| D-07 | Пропуск уровня заголовка в виджете Checkout | S4 | 1. `/en#qa-playground`. 2. axe. | Уровни заголовков идут по порядку. | axe `heading-order` (moderate): `h4` «My orders» внутри `[data-qa-target=orders-list]`. Это не намеренный дефект (`data-qa-demo-defect` стоит только на BUG-003). `widgets.tsx:108`. | `/en`, `/ru` |
| D-08 | Отдельные английские строки в `/ru` (кроме имён и техтерминов) | S4 | 1. Открыть `/ru`, кейсы Cabin Chaos, Petforge Arena, Grand Mall, Metro City, Sakhli. | Описательные строки переведены. | Чипы стека «Python test runners» (Cabin Chaos), «Blender (Python generators)» (Petforge Arena); подписи метрик «Lighthouse mobile / desktop», «Lighthouse mobile: Performance / A11y / Best Practices», «Lighthouse mobile Performance»; «Питомец стихии AIR» в Showroom (enum вместо названия стихии). | `/ru`, кейсы |
| D-09 | Pet Builder называет стихии именами питомцев | S4 | 1. `/ru#game-playground`. 2. Смотреть «Стихия: …». | Стихии называются как в кейсе и Showroom (Воздух/Огонь/Вода или AIR/FIRE/WATER). | «Стихия: Хлопковое облако × 6», «Клубничный дракон», «Пузырьковый аксолотль»; в Showroom тот же питомец — «стихии AIR». Несогласованность терминов. `pet-parts.json elements[].title`. | `/en`, `/ru` |
| D-10 | 404 без собственного title | S4 | 1. Открыть `/en/projects/nope`. | `<title>` вида «Page not found — Sofia Stetsiuk». | Title главной «Sofia Stetsiuk — QA Engineer × Game Designer» (noindex и локализованный текст при этом корректны, статус 404). | `/en/...`, `/ru/...` 404 |
| D-11 | Предупреждения в консоли | S4 | 1. Открыть `/en`, DevTools → Console. | Нет warnings. | `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` (`/en`, `/ru`, из three 0.186/R3F); `/ru/projects/build-your-pet` (1280×720): «all-pets.webp … was preloaded using link preload but not used within a few seconds». Ошибок (`error`, `pageerror`) нет, кроме ожидаемой 404 на несуществующем slug. | `/en`, `/ru`, кейс Petforge |

## Что проверено и PASS

- Маршрутизация: `/` → 307 `/en` (без cookie, независимо от Accept-Language ru-RU); после выбора RU cookie `NEXT_LOCALE=ru` (≈1 год), `/` → `/ru`, `/projects/sakhli` → `/ru/projects/sakhli`; `/de` → `/en/de` → 404.
- Переключатель: `/en/projects/pillars` → `/ru/projects/pillars`; `/en/projects/cabin-chaos#media` → `/ru/...#media`; на главной `/ru#skills` → `/en#skills`, секция в viewport.
- Кейсы: 14/14 → 200, `html lang`, один `h1`, title/description/canonical/hreflang (en, ru, x-default)/og:image; prev/next по кругу внутри локали; 404 на неизвестный slug в обоих языках со ссылкой «На главную».
- Фактчек выборочно против `PROJECT_AUDIT.md`: статусы (Grand Mall и Woodcutter — Released, остальные 5 — In Development), стек Grand Mall (Next.js 16.3.8, React 19.2.8, next-intl 4.14.9, Framer Motion 14.0.0, Playwright 1.63.0, ESLint 9.39.5), Metro City 46/46 smoke и 0 axe на 165 загрузках, Sakhli Lighthouse 91–92/100/100/100, PILLARS 29/29 и 13 карт 84–97 %, Petforge 78/78 и 19/21, название «Petforge Arena» с подзаголовком «Build Your Pet» и пометкой «рабочее название». Единственная внешняя ссылка из кейсов — `grand-mall-three.vercel.app` (200); на приватный репозиторий grand-mall ссылки нет. Расхождений не найдено.
- Ссылки: 32 уникальных внутренних URL → 200; `https://grand-mall-three.vercel.app` → 200, `https://github.com/silestiari` → 200 (target=_blank, rel=noopener noreferrer); `mailto:sofiavipera@gmail.com`, `tel:+995571247510`. Битых картинок и ответов ≥400 нет; видео (4 шт.) отдаются 206, `preload="none"`.
- Копирование email: Clipboard API → буфер = адрес, тост «Email скопирован»; при отказе API адрес выделяется и показывается подсказка Ctrl+C.
- Клавиатура: первый Tab — skip-link (видим), Enter → фокус на `#content`; полный обход 109 остановок через все секции до footer без ловушек, у каждой остановки есть outline/box-shadow; мобильное меню — `dialog` showModal, 9 якорей, фокус на «Закрыть меню», Tab остаётся внутри, Esc закрывает и возвращает фокус на бургер, scroll-lock снимается, переход по якорю с кейса ведёт на главную.
- Showroom (WebGL): 11 моделей трёх проектов загружаются без Retry; 6 кнопок управления, 4 пасса (Wire/Clay/Shaded/Final) с live-region, 2 фона, клавиши ←/→/+/−/R/Space. Без WebGL (`--disable-webgl`, удаление `WebGL2RenderingContext`, `getContext → null`): canvas нет, постеры и пикеры работают, 3D-контролы скрыты, есть уведомление. Мобильный 390 (touch): статичные постеры, выбор модели работает.
- QA Playground: все 5 демо-дефектов находятся (BUG-001 двойной клик, BUG-002 промокод, BUG-003 клавиатурный проход, BUG-004 email с «+», BUG-005 RU-превью), отчёты раскрываются с шагами / ожидаемым / фактическим, «Пока нет» до находки, Reset → 0/5 (в т.ч. при ожидающих таймерах заказа), Reveal all → 5/5. Дисклеймер о демонстрационных дефектах виден.
- Pet Builder: смена части и аксессуара обновляет состав и сет-бонус; Randomize и Reset работают при паузе ≥0,6 с (см. D-04); сет-бонус соответствует составу (15/15 случайных сборок).
- AI Lab: 7 узлов, у каждого свои детали; стрелки/Home/End и вкладки ролей (исходный тест).
- Responsive: 360/390/768/1024/1440/1920 × `/en`, `/ru`, 4 кейса, 404 — `scrollWidth == viewport`, раскрытые «+N» чипы стека не вылезают за край; визуально просмотрены `/ru` 360 (hero, QA Playground, кейс).
- Контраст: axe `color-contrast` нарушений не нашёл (на canvas и градиентах axe контраст не оценивает).
- `prefers-reduced-motion: reduce` на 360: страница грузится без ошибок (глубоко анимации не проверялись).

## Ограничения

- Только Chromium; Firefox, WebKit/Safari и реальные устройства не проверялись. WebGL — программный (SwiftShader), производительность 3D не оценивалась.
- Скринридеры вручную не проверялись; axe не заменяет аудит WCAG.
- Lighthouse / Core Web Vitals не запускались.
- Параллельно работали другие агенты: в 16:50 `.next` был пересобран под запущенным сервером (временный «This page couldn’t load» — артефакт окружения, не дефект; после перезапуска сервера не воспроизводится). Все итоговые результаты получены на сборке `4Zm5XI7t8SG1I67ORa28t`.
