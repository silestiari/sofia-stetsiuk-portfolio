import media from "./media.json";
import type { CaseStudySection, Localized, Project, ProjectMedia } from "./types";

// Facts come only from PROJECT_AUDIT.md. All projects are personal/demo work, not commercial client orders.
// Role, features and challenges live in their own fields; caseStudy holds Overview / Process / QA / AI workflow.

type Bodies = { overview: string; process: string; qa: string; ai: string };

const headings: Localized<Bodies> = {
  en: { overview: "Overview", process: "Process", qa: "QA", ai: "AI workflow" },
  ru: { overview: "Обзор", process: "Процесс", qa: "Тестирование", ai: "Работа с AI" },
};

const toSections = (h: Bodies, b: Bodies): CaseStudySection[] =>
  (Object.keys(h) as (keyof Bodies)[]).map((k) => ({ heading: h[k], body: b[k] }));

const caseStudy = (en: Bodies, ru: Bodies): Localized<CaseStudySection[]> => ({
  en: toSections(headings.en, en),
  ru: toSections(headings.ru, ru),
});

const mediaFor = (slug: string) =>
  ((media as unknown as Record<string, ProjectMedia[]>)[slug] ?? []);

const labData: Localized = {
  en: "Lighthouse lab data, local production build",
  ru: "Lab-данные Lighthouse, локальная prod-сборка",
};

const ownRole: Localized = {
  en: "My project from idea to release: I framed the tasks, made the design decisions and checked the quality of every iteration.",
  ru: "Мой проект от идеи до релиза: постановка задач, дизайн-решения, проверка качества каждой итерации.",
};

export const projectsDisclaimer: Localized = {
  en: "All projects below are personal or demo projects, not commercial client work.",
  ru: "Все проекты ниже — личные или демонстрационные, а не коммерческие заказы.",
};

export const projects: Project[] = [
  {
    slug: "grand-mall-batumi",
    short: "GMB",
    category: "web",
    status: "released",
    title: { en: "Grand Mall Batumi", ru: "Grand Mall Batumi" },
    note: {
      en: "Independent project, not the official website of the mall.",
      ru: "Независимый проект — не официальный сайт торгового центра.",
    },
    summary: {
      en: "A trilingual (EN/RU/KA) shopping-mall website with a searchable store directory, an interactive map and a documented QA pass.",
      ru: "Сайт торгового центра на трёх языках (EN/RU/KA): каталог магазинов с поиском, интерактивная карта и задокументированный QA-прогон.",
    },
    role: {
      en: `${ownRole.en} The project's QA case study lists my role as "website development and QA project contributor".`,
      ru: `${ownRole.ru} В QA-кейсе проекта моя роль указана как «участник разработки сайта и QA».`,
    },
    tech: [
      "Next.js 16.3.8",
      "React 19.2.8",
      "TypeScript 7.0.2",
      "Tailwind CSS 4.3.3",
      "next-intl 4.14.9",
      "Framer Motion 14.0.0",
      "Playwright 1.63.0",
      "ESLint 9.39.5",
      "Vercel",
    ],
    features: {
      en: [
        "Store directory: search, category and floor filters, result counter, reset, filters kept in the URL",
        "Map of 99 places with floors and deep links (the floor plan is illustrative, not an exact layout)",
        "Pages for stores (80), dining (15) and entertainment (4), plus localized 404 pages",
        "Three languages with 522 message keys each",
        "SEO: canonical, hreflang, Open Graph, a 321-URL sitemap and robots",
        "Dark theme with a header toggle",
        "Accessibility: skip link, dialog-based search, live status messages, reduced motion",
        "308 redirects for outdated store URLs",
      ],
      ru: [
        "Каталог магазинов: поиск, фильтры по категории и этажу, счётчик результатов, сброс, фильтры сохраняются в URL",
        "Карта на 99 мест с этажами и прямыми ссылками (схема иллюстративная, не точный план)",
        "Страницы магазинов (80), ресторанов (15) и развлечений (4), локализованные 404",
        "Три языка, по 522 ключа перевода в каждом",
        "SEO: canonical, hreflang, Open Graph, sitemap на 321 URL и robots",
        "Тёмная тема с переключателем в шапке",
        "Доступность: skip link, поиск в диалоге, статусные сообщения для скринридеров, reduced motion",
        "308-редиректы для устаревших адресов магазинов",
      ],
    },
    challenges: {
      en: [
        "Long RU/KA headings overflowed and got clipped → fixed in a dedicated i18n stylesheet and verified across 195 page/viewport combinations",
        "Slow mobile LCP (3.9–4.5 s on /en) → fonts loaded on demand, LCP down to 3.3–3.5 s",
        "Lint plugins were incompatible with newer ESLint → stayed on ESLint 9 on purpose",
        "Gaps in official data (old slugs, broken links) → documented instead of guessed; Events and Offers stay empty until a verified source exists",
      ],
      ru: [
        "Длинные заголовки на RU/KA вылезали за край и обрезались → исправлено в отдельных i18n-стилях, проверено на 195 комбинациях страница/экран",
        "Медленный LCP на мобильных (3,9–4,5 с на /en) → шрифты подгружаются по требованию, LCP снизился до 3,3–3,5 с",
        "Плагины линтера несовместимы с новой версией ESLint → осознанно оставлен ESLint 9",
        "Пробелы в официальных данных (старые slug, битые ссылки) → задокументированы, а не угаданы; разделы Events и Offers пусты, пока нет проверенного источника",
      ],
    },
    caseStudy: caseStudy(
      {
        overview:
          "A website for Grand Mall Batumi in English, Russian and Georgian: home page, stores, dining, entertainment, map, visitor info, events and offers. It is live on Vercel. It is an independent project and not the mall's official website.",
        process:
          "The site was built iteratively with AI agents: specialist subagents for UI, Next.js, accessibility, SEO, performance and code review, each iteration on its own branch. Content rules were strict: an event or offer is published only when it is verified and has a source.",
        qa: "11 critical user journeys are covered by Playwright and pass. Before launch: 151 interaction checks, 48 Axe checks, all 321 internal links returning HTTP 200, 192 page/viewport combinations and 57 checks at 320 px width. Lighthouse lab scores on a local production build: mobile 91–92, desktop 99. Known limits: no testing on physical Safari/iOS/Android devices, and Axe is not a certification.",
        ai: "Started in Codex, then handed over to Claude Code. The repo has CLAUDE.md, AGENTS.md and 8 subagents (UI designer, Next.js developer, UI/UX tester, performance engineer, accessibility tester, SEO specialist, test automator, code reviewer), plus Playwright MCP for browser checks.",
      },
      {
        overview:
          "Сайт Grand Mall Batumi на английском, русском и грузинском: главная, магазины, рестораны, развлечения, карта, информация для посетителей, события и акции. Опубликован на Vercel. Это независимый проект, а не официальный сайт ТЦ.",
        process:
          "Сайт собирался итерациями с AI-агентами: отдельные субагенты для UI, Next.js, доступности, SEO, производительности и code review, каждая итерация — в своей ветке. Правило для контента жёсткое: событие или акция публикуется, только если проверены и у них есть источник.",
        qa: "11 ключевых пользовательских сценариев покрыты Playwright-тестами и проходят. Перед запуском: 151 проверка взаимодействий, 48 проверок Axe, все 321 внутренняя ссылка отвечает HTTP 200, 192 комбинации страница/экран и 57 проверок на ширине 320 px. Lighthouse (lab-данные, локальная prod-сборка): mobile 91–92, desktop 99. Ограничения: на физических Safari/iOS/Android не тестировалось, а Axe — не сертификация.",
        ai: "Проект начинался в Codex, затем передан в Claude Code. В репозитории — CLAUDE.md, AGENTS.md и 8 субагентов (UI-дизайнер, Next.js-разработчик, UI/UX-тестировщик, performance-инженер, тестировщик доступности, SEO-специалист, автоматизатор тестов, ревьюер кода) и Playwright MCP для проверок в браузере.",
      },
    ),
    metrics: [
      { value: "11", label: { en: "Playwright user journeys, all passing", ru: "сценариев Playwright, все проходят" } },
      { value: "151", label: { en: "interaction checks before launch", ru: "проверка взаимодействий перед запуском" } },
      { value: "48", label: { en: "Axe accessibility checks", ru: "проверок доступности Axe" } },
      { value: "321", label: { en: "internal links returning HTTP 200", ru: "внутренняя ссылка отвечает HTTP 200" } },
      { value: "192", label: { en: "page × viewport combinations", ru: "комбинации страница × экран" } },
      { value: "91–92 / 99", label: { en: "Lighthouse mobile / desktop", ru: "Lighthouse: мобильные / десктоп" }, note: labData },
    ],
    media: mediaFor("grand-mall-batumi"),
    links: [
      {
        kind: "live",
        href: "https://grand-mall-three.vercel.app",
        label: { en: "Live site", ru: "Открыть сайт" },
      },
    ],
  },
  {
    slug: "sakhli",
    short: "Sakhli",
    category: "web",
    status: "in-development",
    title: { en: "Sakhli", ru: "Sakhli" },
    note: {
      en: "Concept landing page, not deployed. Real photos and the menu are still pending.",
      ru: "Концепт-лендинг, не опубликован. Реальные фото и меню пока не добавлены.",
    },
    summary: {
      en: "A one-page restaurant landing in KA/EN/RU with a living pond animation, a time-of-day hero and 100 accessibility scores in Lighthouse.",
      ru: "Одностраничный лендинг ресторана на KA/EN/RU с живым прудом, hero по времени суток и 100 баллами доступности в Lighthouse.",
    },
    role: ownRole,
    tech: ["Next.js 16.4", "React 19.3", "TypeScript 7", "Tailwind CSS 4.3.3", "next-intl 4.14.9", "Motion 14.2", "sharp", "Lighthouse 13.5"],
    features: {
      en: [
        "Landing sections with content in KA/EN/RU, SEO and JSON-LD",
        "A living pond with fish and ripples",
        "Hero house that follows Tbilisi time: day, evening, night",
        "Scroll walk-through, glowing lamps, gallery lightbox",
        "Kinetic headings, number odometer, view transition on language switch",
        "Autoplaying motion limited to meet WCAG 2.2.2",
        "Booking via WhatsApp and phone, no backend",
      ],
      ru: [
        "Секции лендинга с контентом на KA/EN/RU, SEO и JSON-LD",
        "Живой пруд с рыбами и рябью",
        "Дом в hero живёт по тбилисскому времени: день, вечер, ночь",
        "Прогулка по дому при скролле, свечение ламп, лайтбокс галереи",
        "Кинетические заголовки, «одометр» цифр, view transition при смене языка",
        "Автоматическое движение ограничено по WCAG 2.2.2",
        "Бронь через WhatsApp и телефон, без бэкенда",
      ],
    },
    challenges: {
      en: [
        "No real photos of the venue yet → clearly labeled placeholders instead of stock images",
        "Unverified claims in the copy → a separate fact audit removed phrases like \"Open daily\"",
        "Georgian text wrapping and font loading → checked separately, 0 overflow across 18 runs",
      ],
      ru: [
        "Реальных фото заведения пока нет → помеченные заглушки вместо стоковых картинок",
        "Неподтверждённые утверждения в тексте → отдельный фактчек убрал фразы вроде «Open daily»",
        "Переносы грузинского текста и загрузка шрифтов → проверены отдельно, 0 переполнений в 18 прогонах",
      ],
    },
    caseStudy: caseStudy(
      {
        overview:
          "A one-page landing for Sakhli (სახლი, \"home\"), a restaurant in Batumi, in Georgian, English and Russian. Visitors book through WhatsApp or a phone call. The site is not deployed yet; photos, menu and prices are still to come.",
        process:
          "The plan was split between 7 agent roles: brand & content strategist, UX architect, visual designer, frontend engineer, motion engineer, QA & polish, and a lead. Every task in the plan is marked done.",
        qa: "Lighthouse 13.5 mobile (lab data): /ka 91/100/100/100, /en 92/100/100/100, /ru 91/100/100/100; after later phases performance 92–93 and accessibility 100. A checklist of 20+ items: contrast, skip link, focus, dialog, 0 overflow in 18 runs, Georgian line breaks, fonts, reduced motion and working without JavaScript. A separate fact audit removed unconfirmed claims from the copy.",
        ai: "A written plan with 7 agent roles and Claude Code skills. The product brief itself is marked as inferred by the visual designer agent.",
      },
      {
        overview:
          "Одностраничный лендинг ресторана Sakhli (სახლი, «дом») в Батуми на грузинском, английском и русском. Бронь — через WhatsApp или звонок. Сайт пока не опубликован: фото, меню и цены ещё впереди.",
        process:
          "План разделён между 7 ролями агентов: стратег по бренду и контенту, UX-архитектор, визуальный дизайнер, фронтенд-инженер, моушн-инженер, QA и полировка, ведущий. Все задачи плана отмечены как выполненные.",
        qa: "Lighthouse 13.5 mobile (lab-данные): /ka 91/100/100/100, /en 92/100/100/100, /ru 91/100/100/100; после следующих фаз производительность 92–93, доступность 100. Чек-лист из 20+ пунктов: контраст, skip link, фокус, диалог, 0 переполнений в 18 прогонах, грузинские переносы, шрифты, reduced motion и работа без JavaScript. Отдельный фактчек убрал из текстов неподтверждённые утверждения.",
        ai: "Письменный план с 7 ролями агентов и скиллы Claude Code. Сам продуктовый бриф помечен как выведенный агентом-визуальным дизайнером.",
      },
    ),
    metrics: [
      { value: "91–93", label: { en: "Lighthouse mobile Performance", ru: "Lighthouse: производительность на мобильных" }, note: labData },
      { value: "100", label: { en: "Lighthouse Accessibility in all three languages", ru: "Lighthouse: доступность на всех трёх языках" }, note: labData },
      { value: "20+", label: { en: "items in the manual QA checklist", ru: "пунктов в ручном QA-чек-листе" } },
      { value: "0", label: { en: "layout overflows across 18 runs", ru: "переполнений вёрстки в 18 прогонах" } },
    ],
    media: mediaFor("sakhli"),
    links: [],
  },
  {
    slug: "sotka",
    short: "Sotka",
    category: "web",
    status: "prototype",
    title: { en: "Sotka", ru: "Сотка" },
    subtitle: { en: "Unified State Exam (ЕГЭ) prep app", ru: "Тренажёр для подготовки к ЕГЭ" },
    summary: {
      en: "A prep app for Russia’s university entrance exam (ЕГЭ) in six subjects: endless task variants by exam number, mock exams, AI-checked long answers, flashcards, a 60-second blitz and a weekly leaderboard, to make exam prep engaging instead of a chore.",
      ru: "Тренажёр ЕГЭ по шести предметам: бесконечные варианты заданий по номерам, пробники, проверка развёрнутых ответов ИИ, карточки, блиц на 60 секунд и рейтинг недели — чтобы готовиться было интересно, а не скучно.",
    },
    role: {
      en: "Founder: product idea, exam content structure and design decisions.",
      ru: "Основательница: идея продукта, структура экзаменационного контента и дизайн-решения.",
    },
    tech: ["HTML", "CSS", "JavaScript", "Claude Artifacts (shared data, AI checking)"],
    features: {
      en: [
        "Six subjects: profile maths (part 1), Russian, history, physics, computer science, social studies",
        "Task generators by exam number: every attempt is a new variant with a worked explanation",
        "Mock exams with a timer, an answer sheet and a review at the end",
        "Part 2: an AI examiner scores long answers and the essay (criteria K1–K7) and explains the mistakes; a photo of a handwritten answer can be attached",
        "Flashcards with five spaced-repetition levels and a 60-second blitz",
        "XP, levels, day streaks, achievements and a weekly leaderboard",
        "“Exercise-book” design with light and dark themes",
      ],
      ru: [
        "Шесть предметов: профильная математика (часть 1), русский, история, физика, информатика, обществознание",
        "Генераторы заданий по номерам ЕГЭ: каждая попытка — новый вариант с разбором решения",
        "Пробники с таймером, бланком ответов и разбором в конце",
        "Часть 2: ИИ-эксперт оценивает развёрнутые ответы и сочинение (критерии К1–К7) и объясняет ошибки; можно приложить фото решения с листа",
        "Карточки с пятью уровнями интервального повторения и блиц на 60 секунд",
        "Опыт, уровни, серии дней, достижения и рейтинг недели",
        "Дизайн «тетрадь в клетку» со светлой и тёмной темой",
      ],
    },
    challenges: { en: [], ru: [] },
    caseStudy: caseStudy(
      {
        overview:
          "Sotka («a hundred», the top ЕГЭ score) is a prep app for Russia’s national university entrance exam. Instead of a fixed bank of questions, each exam task number has a generator, so practice never runs out, and a game layer — XP, levels, streaks, a blitz and a weekly leaderboard — turns preparation into a habit.",
        process:
          "The prototype is a single web app in the style of an exercise book: training by task number, mock exams on an answer sheet, part 2 with long answers, flashcards, a blitz, a leaderboard and a progress page with weak spots to work on first.",
        qa: "A prototype: every generated task carries its own worked explanation, and progress is kept on the device. There are no automated tests yet.",
        ai: "Built with AI agents under my direction. Inside the app, Claude acts as the part 2 examiner: it scores answers against the official criteria and explains what to fix.",
      },
      {
        overview:
          "Сотка — тренажёр ЕГЭ. Вместо фиксированного банка вопросов у каждого номера задания есть генератор, поэтому задачи не заканчиваются, а игровой слой — опыт, уровни, серии дней, блиц и рейтинг недели — превращает подготовку в привычку.",
        process:
          "Прототип — одно веб-приложение в стиле тетради в клетку: тренировка по номерам, пробники на бланке, часть 2 с развёрнутыми ответами, карточки, блиц, рейтинг и страница прогресса со слабыми местами, которые стоит подтянуть в первую очередь.",
        qa: "Это прототип: у каждого сгенерированного задания есть свой разбор решения, прогресс хранится на устройстве. Автотестов пока нет.",
        ai: "Создано с помощью AI-агентов под моим руководством. Внутри приложения Claude работает экспертом части 2: оценивает ответы по критериям ФИПИ и объясняет, что исправить.",
      },
    ),
    metrics: [
      { value: "6", label: { en: "exam subjects", ru: "предметов ЕГЭ" } },
      { value: "8", label: { en: "modes: training, mock exam, part 2, cards, blitz, rating, progress, home", ru: "режимов: тренировка, пробник, часть 2, карточки, блиц, рейтинг, прогресс, главная" } },
    ],
    media: mediaFor("sotka"),
    links: [
      {
        kind: "live",
        href: "https://claude.ai/artifact/7XccEcN3ejMwpetZetWbBy",
        label: { en: "Open the prototype", ru: "Открыть прототип" },
      },
    ],
  },
  {
    slug: "woodcutter-vs-zombies",
    short: "WvZ",
    category: "roblox",
    status: "released",
    title: { en: "Woodcutter vs Zombies", ru: "Лесоруб против зомби" },
    summary: {
      en: "A dark-fantasy Roblox tycoon: chop wood, upgrade your axe, build a castle and defend it from nightly zombie waves.",
      ru: "Roblox-тайкун в стиле dark fantasy: руби лес, прокачивай топор, строй замок и защищай его от ночных волн зомби.",
    },
    role: {
      en: "Product owner, game designer and QA. I set the tasks, design the mechanics, put the scripts into Roblox Studio and test every change myself. Many mechanics in the project log are marked as my idea or tested by me.",
      ru: "Product owner, гейм-дизайн и QA. Ставлю задачи, придумываю механики, переношу скрипты в Roblox Studio и сама тестирую каждое изменение. Многие механики в журнале проекта отмечены как моя идея или проверены мной.",
    },
    tech: ["Luau", "Rojo 7.7.0", "Aftman", "Roblox Studio", "Blender", "Blender MCP", "graphify", "Claude Code"],
    features: {
      en: [
        "Core loop: chop → upgrade the axe → hire helpers → turn logs into planks → sell and build",
        "5 axes up to a chainsaw, a backpack with 9 levels",
        "Sawmill, storage, conveyors and visible helper characters",
        "6 plots with expansions; a 36-section fence, a 3-floor castle with furniture placement (mobile too), 4 towers",
        "Furniture workshop, NPC customers with orders and a queue, a VIP café",
        "Day/night cycle, nightly zombie waves, bosses including a flying dragon, weapons from club to crossbow, armour",
        "Night-time PvP outside plots, pets: cat, ghost dog, raven, bat",
        "11-step tutorial, 57 achievement tiers, daily reward, boosts",
        "Game passes, coin packs, friends lobby, leaderboard, DataStore saving",
      ],
      ru: [
        "Основной цикл: рубка → прокачка топора → помощники → брёвна в доски → продажа и стройка",
        "5 топоров вплоть до бензопилы, рюкзак с 9 уровнями",
        "Лесопилка, склады, конвейеры и видимые помощники-человечки",
        "6 участков с расширениями; забор из 36 секций, трёхэтажный замок с расстановкой мебели (и на телефоне), 4 башни",
        "Мебельная мастерская, NPC-клиенты с заказами и очередью, VIP-кафе",
        "Смена дня и ночи, ночные волны зомби, боссы вплоть до летающего дракона, оружие от дубины до арбалета, броня",
        "Ночное PvP вне участков, питомцы: кошка, призрачная собака, ворон, летучая мышь",
        "Обучение из 11 заданий, 57 ступеней достижений, ежедневная награда, бусты",
        "Геймпассы, пакеты монет, лобби для друзей, таблица лидеров, сохранение в DataStore",
      ],
    },
    challenges: {
      en: [
        "Game passes could be faked from the client → server-side ownership checks",
        "Purchases could be lost on a failed save → ProcessReceipt confirms only after a successful save",
        "Chopping could be abused → server checks for distance and rate",
        "One broken module could stop the whole game → modules start in xpcall",
      ],
      ru: [
        "Геймпасс можно было «подделать» сигналом с клиента → проверка владения на сервере",
        "Покупка могла потеряться при сбое сохранения → ProcessReceipt подтверждается только после успешного сохранения",
        "Рубкой можно было злоупотреблять → серверная проверка дистанции и частоты",
        "Один сломанный модуль мог остановить всю игру → модули запускаются через xpcall",
      ],
    },
    caseStudy: caseStudy(
      {
        overview:
          "A Roblox tycoon with tower-defense nights in a dark-fantasy style. By day you chop wood, process it and build up your plot; by night you defend it from zombie waves and bosses. The game is released on Roblox; rebirth and seasonal events are planned next.",
        process:
          "The codebase grew to 108 Luau files (about 38.7k lines) synced with Rojo. I described mechanics and changes, Claude implemented them, and I tested each build in Roblox Studio before moving on. The project folder holds a Blender scene and 183 FBX files, and Blender MCP is connected to the project.",
        qa: "There are no automated tests; quality was kept by three layers. Two read-only agents, tester and reviewer, audited the code — the issues they found (game-pass spoofing, receipt handling, chop-rate abuse, module crashes) were fixed. An in-game SelfTest checks 9 game passes, DataStore, models, 6 plots and the server size of 6 players. On top of that I tested manually in Studio; the project log also has a pre-release checklist and a self-check of the published game.",
        ai: "Claude Code with project instructions in CLAUDE.md, agents for Blender, review and testing, project skills, Blender MCP and a graphify code graph to keep a 38k-line codebase navigable.",
      },
      {
        overview:
          "Roblox-тайкун с ночной обороной в стиле dark fantasy. Днём рубишь лес, перерабатываешь его и отстраиваешь участок, ночью защищаешь его от волн зомби и боссов. Игра выпущена на Roblox; следующие в планах — перерождение и праздничные события.",
        process:
          "Кодовая база выросла до 108 Luau-файлов (около 38,7 тыс. строк), синхронизация через Rojo. Я описывала механики и изменения, Claude их реализовывал, а я тестировала каждую сборку в Roblox Studio, прежде чем двигаться дальше. В папке проекта — сцена Blender и 183 FBX-файла, к проекту подключён Blender MCP.",
        qa: "Автотестов нет, качество держится на трёх уровнях. Два агента только для чтения, tester и reviewer, проверяли код — найденные проблемы (подделка геймпассов, обработка покупок, злоупотребление рубкой, падение модулей) исправлены. Внутриигровой SelfTest проверяет 9 геймпассов, DataStore, модели, 6 участков и лимит сервера в 6 игроков. Плюс мои ручные проверки в Studio; в журнале проекта есть также чек-лист перед релизом и самопроверка опубликованной игры.",
        ai: "Claude Code с инструкциями проекта в CLAUDE.md, агенты для Blender, ревью и тестирования, скиллы проекта, Blender MCP и граф кода graphify, чтобы ориентироваться в 38 тыс. строк.",
      },
    ),
    metrics: [
      { value: "108", label: { en: "Luau files, ~38.7k lines", ru: "Luau-файлов, ~38,7 тыс. строк" } },
      { value: "183", label: { en: "FBX files in the project", ru: "FBX-файла в проекте" } },
      { value: "9", label: { en: "game passes covered by the in-game SelfTest", ru: "геймпассов в проверке SelfTest" } },
      { value: "57", label: { en: "achievement tiers", ru: "ступеней достижений" } },
    ],
    media: mediaFor("woodcutter-vs-zombies"),
    links: [
      {
        kind: "roblox",
        href: "https://www.roblox.com/games/126918896016438",
        label: { en: "Play on Roblox", ru: "Играть в Roblox" },
      },
    ],
  },
  {
    slug: "cabin-chaos",
    short: "Cabin",
    category: "roblox",
    status: "released",
    title: { en: "Cabin Chaos", ru: "Cabin Chaos" },
    summary: {
      en: "A cartoon co-op party game for 1–4 cabin crew: serve coffee, cola and meals, keep passengers patient and survive the chaos.",
      ru: "Мультяшная кооперативная party-игра для 1–4 бортпроводников: разноси кофе, колу и еду, следи за терпением пассажиров и переживи хаос.",
    },
    role: {
      en: "My own game: game concept and task framing in stages, design decisions, and quality checks of every stage.",
      ru: "Моя игра: концепция и поэтапная постановка задач, дизайн-решения и проверка качества каждого этапа.",
    },
    tech: ["Luau", "Rojo 7.7.1", "Roblox Studio MCP", "Blender 5.2 (Python)", "Blender MCP", "Codex", "Claude Code", "Python", "Remotion 4", "FFmpeg"],
    features: {
      en: [
        "MVP loop: 12 passengers, Coffee / Cola / Meal orders, carrying and delivery, score, patience, 300-second rounds",
        "Service trolley: push, cargo, brake, turning, anti-stuck logic",
        "Special passengers: Robot, Sleepy Monster, Vampire, Slime; a Chaos Meter",
        "Chain reaction: spilled coffee → puddle → complaints → mop; blackouts, night and VIP flights",
        "Lobby for 1–4 players with gates and reserved servers",
        "Crew shop with cosmetics for Crew Coins and Robux, game passes and coin packs",
        "EN/RU localization, phone-friendly UI, music",
      ],
      ru: [
        "MVP-цикл: 12 пассажиров, заказы Coffee / Cola / Meal, перенос и доставка, очки, терпение, раунд 300 секунд",
        "Тележка: толкание, груз, тормоз, повороты, защита от застревания",
        "Особые пассажиры: Робот, Сонный монстр, Вампир, Слизень; шкала хаоса",
        "Цепная реакция: пролитый кофе → лужа → жалобы → швабра; отключение света, ночные и VIP-рейсы",
        "Лобби на 1–4 игрока с гейтами и резервными серверами",
        "Магазин экипажа: косметика за Crew Coins и Robux, геймпассы и пакеты монет",
        "Локализация EN/RU, интерфейс под телефон, музыка",
      ],
    },
    challenges: {
      en: [
        "Imported FBX models came in with wrong orientation → orientation rules written into AGENTS.md for every agent",
        "The trolley stuck to obstacles 3–9 times per run → turn-with-offset in 8 directions, down to 0–1",
        "Push only worked from the handle side → fixed",
        "Tooltips jittered → the layout recalculation was rolled back",
        "Uneven audio across promo videos → loudness aligned by PlaybackLoudness, checked by LUFS/TP reports",
      ],
      ru: [
        "Импортированные FBX приходили с неправильной ориентацией → правила ориентации записаны в AGENTS.md для всех агентов",
        "Тележка «прилипала» к препятствиям 3–9 раз за поездку → поворот со сдвигом в 8 направлениях, стало 0–1",
        "Толкать тележку можно было только со стороны ручки → исправлено",
        "Подсказки дрожали → пересчёт раскладки откатили",
        "Разная громкость в промо-роликах → выравнивание по PlaybackLoudness, проверка отчётами LUFS/TP",
      ],
    },
    caseStudy: caseStudy(
      {
        overview:
          "A cooperative Roblox party game — explicitly not a realistic flight simulator. Up to four players work as cabin crew, serve passengers, push the trolley through the aisle and deal with special passengers and chain reactions of chaos. The game is released on Roblox.",
        process:
          "The game was built in staged prompts (Prompt24 through Prompt30), each stage logged in a 600-line PROJECT_STATE.md. 14 Python scripts (generate_*.py) build the 3D assets — cabin kit, trolley, seats, coffee station, crew uniform, lobby gate, special passengers and more — in headless Blender 5.2. Promo Shorts are rendered with Remotion and FFmpeg in EN and RU.",
        qa: "Python test suites for the MVP, chaos, drink balance, special passengers, the spill chain and localization — the latest runs: 6 suites PASS. Among them 67 shop checks, 16 lobby checks and 207 localization checks; earlier 127 mocked assertions and 81,450 geometry checks. A separate gameplay audit, and video QA for promo clips (loudness and frames). Not verified yet: real Robux purchases in Play and multiplayer scenes that need 2+ live players.",
        ai: "The most developed multi-agent setup of all my projects. Codex: .codex/config.toml with agents enabled, up to 6 parallel threads and MCP servers for Blender and Roblox Studio; 7 TOML agents — architect, gameplay, UI/UX, QA tester, reviewer, explorer, Blender artist. Claude Code: 9 agents in the project plus 2 for video (cinematic director, gameplay Shorts editor). Coordinator rule: read-only agents run in parallel, and two agents never edit the same file.",
      },
      {
        overview:
          "Кооперативная party-игра на Roblox — принципиально не реалистичный авиасимулятор. До четырёх игроков работают бортпроводниками: обслуживают пассажиров, катают тележку по проходу и справляются с особыми пассажирами и цепными реакциями хаоса. Игра выпущена на Roblox.",
        process:
          "Игра собиралась поэтапными промптами (с Prompt24 по Prompt30), каждый этап записан в журнал PROJECT_STATE.md на 600 строк. 14 Python-скриптов (generate_*.py) собирают 3D-ассеты — салон, тележка, кресла, кофейная станция, форма экипажа, гейт лобби, особые пассажиры и другие — в Blender 5.2 без интерфейса. Промо-шортсы рендерятся через Remotion и FFmpeg на EN и RU.",
        qa: "Наборы Python-тестов для MVP, хаоса, баланса напитков, особых пассажиров, цепочки с пролитым кофе и локализации — в последних прогонах 6 наборов PASS. Среди них 67 проверок магазина, 16 — лобби и 207 — локализации; раньше — 127 mocked-проверок и 81 450 проверок геометрии. Отдельный аудит геймплея и видео-QA промо-роликов (громкость и кадры). Пока не проверено: реальные покупки за Robux в Play и сцены, где нужно 2+ живых игрока.",
        ai: "Самая развитая мультиагентная схема среди моих проектов. Codex: .codex/config.toml с включёнными агентами, до 6 параллельных потоков и MCP-серверами Blender и Roblox Studio; 7 TOML-агентов — архитектор, геймплей, UI/UX, QA-тестировщик, ревьюер, исследователь, Blender-художник. Claude Code: 9 агентов в проекте и ещё 2 для видео (режиссёр синематиков, монтажёр геймплейных шортсов). Правило координатора: агенты только для чтения работают параллельно, два агента никогда не правят один файл.",
      },
    ),
    metrics: [
      { value: "6", label: { en: "test suites PASS in the latest runs", ru: "тестовых наборов PASS в последних прогонах" } },
      { value: "207", label: { en: "localization checks", ru: "проверок локализации" } },
      { value: "7 + 11", label: { en: "Codex and Claude Code agents", ru: "агентов Codex и Claude Code" } },
      { value: "14", label: { en: "3D assets generated by Blender Python scripts", ru: "3D-ассетов из Python-скриптов Blender" } },
    ],
    media: mediaFor("cabin-chaos"),
    links: [
      {
        kind: "roblox",
        href: "https://www.roblox.com/games/122107110812286",
        label: { en: "Play on Roblox", ru: "Играть в Roblox" },
      },
    ],
  },
  {
    slug: "pillars",
    short: "Pillars",
    category: "roblox",
    status: "released",
    title: { en: "PILLARS: Hide & Stack", ru: "PILLARS: Hide & Stack" },
    summary: {
      en: "A multiplayer hide-and-seek block game: hide your 15 blocks, hunt down everyone else's and stack the tallest pillar.",
      ru: "Мультиплеерные прятки с блоками: спрячь свои 15 блоков, найди чужие и построй самый высокий столб.",
    },
    role: {
      en: "My own game: game concept and task framing, design decisions and quality checks.",
      ru: "Моя игра: концепция и постановка задач, дизайн-решения и проверка качества.",
    },
    tech: ["Luau", "Rojo 7.7.1", "Lune 0.11", "luau-lsp 1.70.1", "run-in-roblox 0.3", "Claude Code"],
    features: {
      en: [
        "Each player gets 15 blocks of their colour: hide them, find others' and build a pillar — the tallest one wins",
        "13 procedural voxel maps, from Rainbow Hamlet and Crystal Depths to Haunted Mansion and Desert Temple",
        "Sky-island lobby with 2/4/6/8-player gates, a friends gate and reserved-server matches",
        "Map voting based on player count",
        "Coins, shop and inventory: Speed, Hint, Radar, Glow, Camo, Friends Ticket — for coins or Robux, with receipt de-duplication",
        "Hiding spots in water, flowers and nooks; music by game phase and sound effects",
        "Store page in EN and RU",
      ],
      ru: [
        "У каждого игрока 15 блоков своего цвета: спрячь их, найди чужие и построй столб — побеждает самый высокий",
        "13 процедурных воксельных карт — от Rainbow Hamlet и Crystal Depths до Haunted Mansion и Desert Temple",
        "Лобби на небесном острове с гейтами на 2/4/6/8 игроков, гейтом для друзей и матчами на резервных серверах",
        "Голосование за карту с учётом числа игроков",
        "Монеты, магазин и инвентарь: Speed, Hint, Radar, Glow, Camo, Friends Ticket — за монеты или Robux, с защитой от повторных чеков",
        "Прятки в воде, цветах и нишах; музыка по фазам игры и звуки",
        "Страница в магазине на EN и RU",
      ],
    },
    challenges: {
      en: [
        "Hidden blocks had to be findable on every map → a map test confirms all 13 maps build and 84–97% of the surface is reachable from spawn",
        "Paid items could be granted twice → receipt de-duplication",
        "Security and game-design reviews → fixes applied in a dedicated commit",
      ],
      ru: [
        "Спрятанные блоки должны находиться на любой карте → тест карт подтверждает, что все 13 собираются, а от спавна доступно 84–97% поверхности",
        "Платный предмет мог выдаться дважды → дедупликация чеков",
        "Ревью безопасности и гейм-дизайна → исправления внесены отдельным коммитом",
      ],
    },
    caseStudy: caseStudy(
      {
        overview:
          "A Roblox multiplayer hide-and-seek game inspired by the Minecraft \"Pillars\" minigame. All 13 maps are procedural and built from Roblox parts — no imported 3D models. The project is tagged v1.0, went through a release checklist and is released on Roblox.",
        process:
          "Built in stages, starting with architecture, agent setup and a playable prototype — 30 commits in total. Security, performance and known bugs are documented in separate files.",
        qa: "Syntax pass, logic tests 29/29, type check with 0 errors, a map test where all 13 maps build with 84–97% of the surface reachable, and an engine SELFTEST in Studio passing on all 13 maps. The manual Studio checklist has not been run yet — and it's listed as such.",
        ai: "9 Claude Code agents: project architect, game designer, gameplay engineer, environment artist, map-import specialist, performance engineer, QA engineer, security engineer and UI/UX designer.",
      },
      {
        overview:
          "Мультиплеерные прятки на Roblox по мотивам мини-игры «Pillars» из Minecraft. Все 13 карт процедурные и собраны из Roblox-деталей — без импортированных 3D-моделей. У проекта есть тег v1.0, он прошёл чек-лист релиза и выпущен на Roblox.",
        process:
          "Работа шла этапами: сначала архитектура, настройка агентов и играбельный прототип — всего 30 коммитов. Безопасность, производительность и известные баги описаны в отдельных документах.",
        qa: "Проверка синтаксиса, логические тесты 29/29, проверка типов с 0 ошибок, тест карт: все 13 собираются, от спавна доступно 84–97% поверхности, и SELFTEST движка в Studio проходит на всех 13 картах. Ручной чек-лист в Studio ещё не пройден — и так и записан.",
        ai: "9 агентов Claude Code: архитектор проекта, гейм-дизайнер, геймплей-инженер, художник окружения, специалист по импорту карт, performance-инженер, QA-инженер, инженер по безопасности и UI/UX-дизайнер.",
      },
    ),
    metrics: [
      { value: "29/29", label: { en: "logic tests passing", ru: "логических тестов проходят" } },
      { value: "13/13", label: { en: "maps pass the Studio SELFTEST", ru: "карт проходят SELFTEST в Studio" } },
      { value: "84–97%", label: { en: "map surface reachable from spawn", ru: "поверхности карты доступно от спавна" } },
      { value: "0", label: { en: "type errors", ru: "ошибок типов" } },
    ],
    media: mediaFor("pillars"),
    links: [
      {
        kind: "roblox",
        href: "https://www.roblox.com/games/102854253424644",
        label: { en: "Play on Roblox", ru: "Играть в Roblox" },
      },
    ],
  },
  {
    slug: "build-your-pet",
    short: "Pet",
    category: "roblox",
    status: "released",
    title: { en: "Build Your Own Pet", ru: "Собери своего питомца" },
    summary: {
      en: "Build a pet from six parts with elements and rarities, earn new parts in minigames and races, then send it into auto-PvP.",
      ru: "Собери питомца из шести частей со стихиями и редкостью, добывай новые части в мини-играх и гонках и отправляй его в авто-PvP.",
    },
    role: {
      en: "My own game: game concept and task framing, design and balance decisions, and quality checks.",
      ru: "Моя игра: концепция и постановка задач, решения по дизайну и балансу, проверка качества.",
    },
    tech: ["Luau", "Rojo 7.7.1", "Lune 0.11", "Blender (Python)", "Claude Code"],
    features: {
      en: [
        "A pet is built from 6 parts: head, body, front paws, hind paws, tail and back",
        "Five elements — Fire, Stone, Wood, Air, Water — and part rarities that scale stats",
        "Parts drop in zone minigames, the NPC Tower and the Sky Ring Rush race for 2–8 players",
        "Auto-PvP unlocks at level 15",
        "Balance kept in a separate game-data spreadsheet",
        "Parts and rarity ornaments generated in Blender: 134 exported files",
      ],
      ru: [
        "Питомец собирается из 6 частей: голова, тело, передние лапы, задние лапы, хвост и спина",
        "Пять стихий — Огонь, Камень, Дерево, Воздух, Вода — и редкость частей, которая усиливает характеристики",
        "Части выпадают в мини-играх зон, в Башне NPC и в гонке Sky Ring Rush на 2–8 игроков",
        "Авто-PvP открывается с 15 уровня",
        "Баланс ведётся в отдельной таблице игровых данных",
        "Части и орнаменты редкостей сгенерированы в Blender: 134 экспортированных файла",
      ],
    },
    challenges: {
      en: [
        "Defects BUG-1…BUG-4 found during QA → all marked fixed; BUG-3 is fixed but not playtested yet",
        "Case 13b (Chromatic with a full inventory) still fails in the matrix → kept open and visible, not hidden",
        "Possible PvP farming with alt accounts (GAP-1) → logged as an open risk",
      ],
      ru: [
        "Дефекты BUG-1…BUG-4, найденные на тестировании → все отмечены исправленными; BUG-3 исправлен, но ещё не проверен в игре",
        "Кейс 13b (Chromatic при полном инвентаре) в матрице всё ещё FAIL → оставлен открытым и видимым, а не скрыт",
        "Возможный фарм PvP с альт-аккаунтов (GAP-1) → записан как открытый риск",
      ],
    },
    caseStudy: caseStudy(
      {
        overview:
          "A Roblox game about assembling a pet from parts. Each part has an element and a rarity, so mixing them creates hybrids. New parts come from zone minigames, the NPC Tower, a ring race and auto-PvP. The game is released on Roblox as Build Your Own Pet.",
        process:
          "The game started from a master prompt that set the lead engineer and multi-agent coordinator role, with task files for each agent. Pet parts and world assets are produced by Blender generators (generate_assets.py and others) and exported as 134 FBX/OBJ files with manifests.",
        qa: "Automated Lune tests: 78 passed, 0 failed — covering data, loot, pet building, combat, progression, profile schema, minigame rules and integration with a mock DataStore. The QA matrix: 19 of 21 cases PASS, 1 FAIL (13b), 1 not run (private-server abuse). All manual Studio checks ST-1…ST-11 are not run yet; zones, competitions, leaderboards and the shop are not covered by Lune tests.",
        ai: "11 Claude Code agents: game director, Roblox architect, pet build systems, combat AI engineer, economy & progression designer, world & minigame designer, UI/UX designer, Blender 3D artist, QA automation tester, security & performance reviewer, integration & release manager.",
      },
      {
        overview:
          "Игра на Roblox про сборку питомца из частей. У каждой части есть стихия и редкость, поэтому из них получаются гибриды. Новые части дают мини-игры зон, Башня NPC, гонка через кольца и авто-PvP. Игра выпущена на Roblox под названием «Собери своего питомца».",
        process:
          "Игра началась с мастер-промпта, который задаёт роль ведущего инженера и координатора агентов, и файлов с заданиями для каждого агента. Части питомцев и объекты мира создают генераторы в Blender (generate_assets.py и другие) и экспортируют 134 файла FBX/OBJ с манифестами.",
        qa: "Автотесты на Lune: 78 пройдено, 0 упало — данные, лут, сборка питомца, бой, прогрессия, схема профиля, правила мини-игр и интеграция с mock DataStore. QA-матрица: 19 из 21 кейса PASS, 1 FAIL (13b), 1 не запускался (абуз приватных серверов). Все ручные проверки в Studio ST-1…ST-11 ещё не проведены; зоны, соревнования, лидерборды и магазин тестами Lune не покрыты.",
        ai: "11 агентов Claude Code: гейм-директор, Roblox-архитектор, системы сборки питомца, инженер боевого AI, дизайнер экономики и прогрессии, дизайнер мира и мини-игр, UI/UX-дизайнер, Blender-художник, QA-автоматизатор, ревьюер безопасности и производительности, менеджер интеграции и релиза.",
      },
    ),
    metrics: [
      { value: "78/78", label: { en: "Lune tests passing", ru: "тестов Lune проходят" } },
      { value: "19/21", label: { en: "QA matrix cases PASS (1 fail, 1 not run)", ru: "кейса QA-матрицы PASS (1 FAIL, 1 не запускался)" } },
      { value: "134", label: { en: "part and ornament files exported from Blender", ru: "файла частей и орнаментов из Blender" } },
      { value: "11", label: { en: "Claude Code agents", ru: "агентов Claude Code" } },
    ],
    media: mediaFor("build-your-pet"),
    links: [
      {
        kind: "roblox",
        href: "https://www.roblox.com/games/83887073812489",
        label: { en: "Play on Roblox", ru: "Играть в Roblox" },
      },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
