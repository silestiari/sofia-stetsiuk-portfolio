import type { Localized, Project } from "./types";

// AI Workflow Lab: the real process behind the projects. Examples are taken from PROJECT_AUDIT.md.

export interface AiLabExample {
  projectSlug: Project["slug"];
  text: Localized;
}

export interface AiLabNode {
  id: "idea" | "game-design" | "ai-agents" | "development" | "3d-assets" | "qa" | "release";
  /** Node title, mono uppercase in UI */
  title: Localized;
  /** One line under the title */
  summary: Localized;
  tasks: Localized<string[]>;
  human: Localized<string[]>;
  agents: Localized<string[]>;
  examples: AiLabExample[];
}

export const aiLabNodes: AiLabNode[] = [
  {
    id: "idea",
    title: { en: "Idea", ru: "Идея" },
    summary: { en: "What are we building and for whom?", ru: "Что строим и для кого?" },
    tasks: {
      en: ["Define the genre, audience and core fantasy", "Decide what is out of scope"],
      ru: ["Определить жанр, аудиторию и главную фантазию игрока", "Решить, что в проект не входит"],
    },
    human: {
      en: ["Comes up with the concept and the constraints", "Writes the project brief and the rules for agents"],
      ru: ["Придумывает концепцию и ограничения", "Пишет бриф проекта и правила для агентов"],
    },
    agents: {
      en: ["Explore similar mechanics and ask clarifying questions"],
      ru: ["Изучают похожие механики и задают уточняющие вопросы"],
    },
    examples: [
      {
        projectSlug: "cabin-chaos",
        text: {
          en: "AGENTS.md fixes the frame: a cartoon co-op party game for 1–4 cabin crew, not a realistic flight simulator.",
          ru: "AGENTS.md задаёт рамку: мультяшная кооперативная party-игра для 1–4 бортпроводников, а не реалистичный авиасимулятор.",
        },
      },
      {
        projectSlug: "build-your-pet",
        text: {
          en: "A master prompt sets the lead-engineer and coordinator role and keeps the working title easy to rename.",
          ru: "Мастер-промпт задаёт роль ведущего инженера и координатора и оставляет рабочее название лёгким для замены.",
        },
      },
    ],
  },
  {
    id: "game-design",
    title: { en: "Game Design", ru: "Гейм-дизайн" },
    summary: { en: "Loops, economy and the fun part.", ru: "Циклы, экономика и то, ради чего играют." },
    tasks: {
      en: ["Design the core loop and progression", "Plan the economy, shop and monetization", "Balance numbers"],
      ru: ["Спроектировать основной цикл и прогрессию", "Продумать экономику, магазин и монетизацию", "Сбалансировать цифры"],
    },
    human: {
      en: ["Designs mechanics and decides what stays", "Makes the final call on balance"],
      ru: ["Придумывает механики и решает, что остаётся", "Принимает финальное решение по балансу"],
    },
    agents: {
      en: ["Game-director and economy agents propose options and spot holes in the design"],
      ru: ["Агенты гейм-директора и экономики предлагают варианты и находят дыры в дизайне"],
    },
    examples: [
      {
        projectSlug: "woodcutter-vs-zombies",
        text: {
          en: "Many mechanics in the project log are marked as Sofia's idea or Sofia's request.",
          ru: "Многие механики в журнале проекта отмечены как идея или просьба Софии.",
        },
      },
      {
        projectSlug: "build-your-pet",
        text: {
          en: "Balance lives in a separate game-data spreadsheet, not scattered in code.",
          ru: "Баланс живёт в отдельной таблице игровых данных, а не разбросан по коду.",
        },
      },
    ],
  },
  {
    id: "ai-agents",
    title: { en: "AI Agents", ru: "AI-агенты" },
    summary: { en: "A team with roles and boundaries.", ru: "Команда с ролями и границами." },
    tasks: {
      en: ["Split the work into agent roles", "Assign file ownership", "Write staged prompts"],
      ru: ["Разбить работу на роли агентов", "Распределить владение файлами", "Написать поэтапные промпты"],
    },
    human: {
      en: ["Designs the team: who does what and who may touch which files", "Breaks the project into stages"],
      ru: ["Собирает команду: кто что делает и кто какие файлы трогает", "Делит проект на этапы"],
    },
    agents: {
      en: ["Work in parallel within their roles; read-only agents review without editing"],
      ru: ["Работают параллельно в своих ролях; агенты только для чтения проверяют, не редактируя"],
    },
    examples: [
      {
        projectSlug: "cabin-chaos",
        text: {
          en: "Codex: .codex/config.toml with agents enabled, up to 6 parallel threads and 7 TOML agents. Claude Code: 9 agents plus 2 for video. Work moved stage by stage, Prompt24 to Prompt30.",
          ru: "Codex: .codex/config.toml с включёнными агентами, до 6 параллельных потоков и 7 TOML-агентов. Claude Code: 9 агентов и ещё 2 для видео. Работа шла этапами — с Prompt24 по Prompt30.",
        },
      },
      {
        projectSlug: "grand-mall-batumi",
        text: {
          en: "8 subagents: UI, Next.js, UI/UX testing, performance, accessibility, SEO, test automation and code review.",
          ru: "8 субагентов: UI, Next.js, UI/UX-тестирование, производительность, доступность, SEO, автотесты и code review.",
        },
      },
    ],
  },
  {
    id: "development",
    title: { en: "Development", ru: "Разработка" },
    summary: { en: "Agents write code, the human steers.", ru: "Код пишут агенты, курс держит человек." },
    tasks: {
      en: ["Implement features stage by stage", "Keep a project log so the next session knows the state"],
      ru: ["Реализовать функции по этапам", "Вести журнал, чтобы следующая сессия знала состояние проекта"],
    },
    human: {
      en: ["Describes each change, integrates it and checks it in Studio or the browser", "Rejects what doesn't feel right"],
      ru: ["Описывает каждое изменение, встраивает его и проверяет в Studio или браузере", "Отклоняет то, что ощущается не так"],
    },
    agents: {
      en: ["Write and refactor code, update the project log"],
      ru: ["Пишут и рефакторят код, обновляют журнал проекта"],
    },
    examples: [
      {
        projectSlug: "woodcutter-vs-zombies",
        text: {
          en: "\"Claude writes the code, I paste it in, test it and do the design\" — 108 Luau files, about 38.7k lines.",
          ru: "«Код пишет Claude, я вставляю, тестирую и занимаюсь дизайном» — 108 Luau-файлов, около 38,7 тыс. строк.",
        },
      },
      {
        projectSlug: "cabin-chaos",
        text: {
          en: "A 600-line PROJECT_STATE.md logs every stage, including the handover from Codex to Claude Code.",
          ru: "PROJECT_STATE.md на 600 строк фиксирует каждый этап, включая переход из Codex в Claude Code.",
        },
      },
    ],
  },
  {
    id: "3d-assets",
    title: { en: "3D Assets", ru: "3D-ассеты" },
    summary: { en: "Models generated by code, checked by eye.", ru: "Модели из кода, проверка глазами." },
    tasks: {
      en: ["Generate models with Blender Python scripts", "Export FBX/OBJ for Roblox", "Fix orientation and scale"],
      ru: ["Сгенерировать модели Python-скриптами в Blender", "Экспортировать FBX/OBJ для Roblox", "Исправить ориентацию и масштаб"],
    },
    human: {
      en: ["Sets the visual direction", "Reviews previews and imports in Studio"],
      ru: ["Задаёт визуальное направление", "Проверяет превью и импорт в Studio"],
    },
    agents: {
      en: ["Blender-artist agents write generator scripts and drive Blender through MCP"],
      ru: ["Агенты-художники пишут скрипты-генераторы и управляют Blender через MCP"],
    },
    examples: [
      {
        projectSlug: "cabin-chaos",
        text: {
          en: "14 generate_*.py scripts in headless Blender 5.2: cabin kit, trolley, seats, coffee station, special passengers and more. Orientation rules for FBX are written into AGENTS.md.",
          ru: "14 скриптов generate_*.py в Blender 5.2 без интерфейса: салон, тележка, кресла, кофейная станция, особые пассажиры и другие. Правила ориентации FBX записаны в AGENTS.md.",
        },
      },
      {
        projectSlug: "build-your-pet",
        text: {
          en: "Blender generators produce pet parts by element and rarity ornaments: 134 exported files with manifests.",
          ru: "Генераторы в Blender создают части питомцев по стихиям и орнаменты редкостей — 134 экспортированных файла с манифестами.",
        },
      },
    ],
  },
  {
    id: "qa",
    title: { en: "QA", ru: "QA" },
    summary: { en: "Nothing ships without a check.", ru: "Без проверки ничего не выходит." },
    tasks: {
      en: ["Automated suites and in-game self-tests", "Manual checks of what automation can't see", "Log what was NOT tested"],
      ru: ["Автотесты и внутриигровые самопроверки", "Ручные проверки того, что не видит автоматизация", "Записать, что НЕ проверялось"],
    },
    human: {
      en: ["Tests builds by hand in Studio and the browser", "Decides whether an agent's finding is real", "Keeps failed and not-run cases visible"],
      ru: ["Вручную тестирует сборки в Studio и браузере", "Решает, реальна ли находка агента", "Оставляет FAIL и непройденные кейсы на виду"],
    },
    agents: {
      en: ["QA and reviewer agents write tests, run them and review code for security issues"],
      ru: ["Агенты QA и ревью пишут и запускают тесты, проверяют код на уязвимости"],
    },
    examples: [
      {
        projectSlug: "cabin-chaos",
        text: {
          en: "Latest runs: 6 test suites PASS, including 207 localization checks.",
          ru: "Последние прогоны: 6 тестовых наборов PASS, в том числе 207 проверок локализации.",
        },
      },
      {
        projectSlug: "grand-mall-batumi",
        text: {
          en: "11 Playwright journeys, 151 interaction checks, 48 Axe checks and 321 links with HTTP 200.",
          ru: "11 сценариев Playwright, 151 проверка взаимодействий, 48 проверок Axe и 321 ссылка с HTTP 200.",
        },
      },
      {
        projectSlug: "build-your-pet",
        text: {
          en: "78/78 Lune tests, but manual Studio checks are honestly marked NOT RUN.",
          ru: "78/78 тестов Lune, но ручные проверки в Studio честно помечены NOT RUN.",
        },
      },
    ],
  },
  {
    id: "release",
    title: { en: "Release", ru: "Релиз" },
    summary: { en: "A human says \"ship it\".", ru: "Команду «выпускаем» даёт человек." },
    tasks: {
      en: ["Run the release checklist", "Deploy or publish", "Prepare promo materials"],
      ru: ["Пройти чек-лист релиза", "Задеплоить или опубликовать", "Подготовить промо-материалы"],
    },
    human: {
      en: ["Makes the go / no-go call", "Holds a launch when permissions or facts are missing"],
      ru: ["Принимает решение «выпускать или нет»", "Останавливает запуск, если нет разрешений или фактов"],
    },
    agents: {
      en: ["Release and integration agents prepare builds, checklists and promo renders"],
      ru: ["Агенты интеграции и релиза готовят сборки, чек-листы и промо-рендеры"],
    },
    examples: [
      {
        projectSlug: "grand-mall-batumi",
        text: { en: "Deployed on Vercel and live.", ru: "Задеплоен на Vercel и работает." },
      },
      {
        projectSlug: "pillars",
        text: { en: "Tagged v1.0 with a release checklist.", ru: "Тег v1.0 и чек-лист релиза." },
      },
      {
        projectSlug: "cabin-chaos",
        text: {
          en: "Promo Shorts rendered with Remotion and FFmpeg in EN and RU, with loudness and frame QA.",
          ru: "Промо-шортсы на EN и RU собраны через Remotion и FFmpeg, с проверкой громкости и кадров.",
        },
      },
    ],
  },
];

export const aiLabWhyHuman: { title: Localized; points: Localized<string[]> } = {
  title: { en: "Why a human owns the tasks and the checks", ru: "Почему задачи и проверку держит человек" },
  points: {
    en: [
      "Agents are fast, but they optimize for the task as written. A vague task gives a confident wrong result — so writing the task well is the real job.",
      "Agents can report success on something that doesn't work in the game. Only a person playing the build notices that the trolley sticks or a tooltip jitters.",
      "Facts, permissions and brand rights can't be generated. When data is missing, I mark it as unconfirmed instead of letting an agent fill the gap.",
      "Someone has to be accountable for the release. That's me.",
    ],
    ru: [
      "Агенты быстрые, но выполняют задачу ровно так, как она написана. Размытая задача даёт уверенный неверный результат — поэтому хорошо поставить задачу и есть главная работа.",
      "Агент может отчитаться об успехе там, где в игре ничего не работает. Только человек, который играет в сборку, заметит, что тележка застревает, а подсказка дрожит.",
      "Факты, разрешения и права на бренд не сгенерировать. Если данных нет, я помечаю их как неподтверждённые, а не даю агенту заполнить пробел.",
      "За релиз должен кто-то отвечать. Это я.",
    ],
  },
};

/** Agent role files of this site (.claude/agents/*.md), in the order of aiLabSiteNote. */
export const aiLabSiteAgents = [
  "creative-director",
  "ux-ui-designer",
  "frontend-architect",
  "motion-designer",
  "3d-technical-artist",
  "content-localization",
  "qa-engineer",
  "performance-engineer",
  "portfolio-researcher",
  "integration-release",
] as const;

export const aiLabSiteNote: Localized = {
  en: "This portfolio was built the same way: 10 agents (creative direction, UX/UI, frontend, motion, 3D, content, QA, performance, research and release), with me setting the tasks and checking the result.",
  ru: "Это портфолио собрано так же: 10 агентов — арт-дирекшн, UX/UI, фронтенд, моушн, 3D, контент, QA, производительность, фактчек и релиз, — а задачи ставлю и результат проверяю я.",
};
