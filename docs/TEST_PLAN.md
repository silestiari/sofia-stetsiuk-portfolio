# Test Plan — портфолио Sofia Stetsiuk

Дата: 2026-10-18. Тип: независимое QA перед релизом (код приложения не меняется, добавляются только e2e-тесты).

## Область

- Главная `/en`, `/ru`: 9 секций (hero, projects, showroom, about, skills, ai-lab, qa-playground, game-playground, contact), header, мобильное меню, footer.
- 7 страниц кейсов × 2 языка (`/{locale}/projects/{slug}`), 404 для неизвестного slug и пути.
- Маршрутизация и i18n: редирект `/` и путей без префикса, cookie `NEXT_LOCALE`, переключатель языка (путь + якорь).
- Интерактив: 3D Showroom (11 моделей, контролы, пассы, фон, фолбэк без WebGL, мобильный режим), QA Playground (5 демо-дефектов, отчёты, Reveal all, Reset), Pet Builder (части, аксессуар, Randomize, Reset), AI Workflow Lab (7 узлов, роли).
- Контакты: mailto, tel, GitHub, копирование email (Clipboard API и фолбэк).
- SEO: title, description, OG, canonical, hreflang, `html lang`, sitemap.xml, robots.txt.
- Фактчек: выборочно статусы, стек, метрики и ссылки против `PROJECT_AUDIT.md`.

Вне области: реальные устройства iOS/Android, Safari/Firefox, Lighthouse/Core Web Vitals, скринридеры (NVDA/VoiceOver) — только автоматические a11y-проверки.

## Окружение

- Windows 11, Node 24, Next.js 16.4.2 production build (`next build` + `next start`).
- Chromium (Playwright 1.64), headless; WebGL через SwiftShader; без WebGL — `--disable-webgl` и подмена `getContext`.
- Viewport: 360, 390, 768, 1024, 1440, 1920 (+ 1280×720 по умолчанию Playwright).

## Типы тестов

| Тип | Как |
|---|---|
| Статика | `npm run lint`, `typecheck`, `check:i18n`, `build` |
| E2E (регресс) | `npm run test:e2e` — `e2e/*.spec.ts` |
| Функциональные / UI | Playwright-скрипты + ручной просмотр скриншотов |
| Responsive | scrollWidth vs viewport, элементы за краем, обрезанный текст (overflow hidden) |
| Accessibility | `@axe-core/playwright` (исключён только `[data-qa-demo-defect]`), Tab-обход всей страницы, видимый фокус, skip-link, модальное меню |
| Локализация | сравнение ключей en/ru, скан латиницы в отрендеренном `/ru` |
| Ссылки | все внутренние → 200, внешние (`grand-mall-three.vercel.app`, `github.com/silestiari`) → 200 |
| Консоль | errors / warnings / pageerror на всех страницах |

## Критерии

- Выход (релиз): нет открытых S1/S2; lint/typecheck/build зелёные; e2e без падений, кроме тестов, зафиксированных как дефекты в `docs/QA_REPORT.md`.
- Severity: S1 — блокирует ключевой сценарий / данные; S2 — серьёзное нарушение функции, a11y или SEO без обхода; S3 — заметный дефект с обходом; S4 — косметика.
- Тесты не подгоняются под дефекты: падающий тест = открытый дефект в отчёте.
