import type { Localized, Project } from "./types";

// Skill × project matrix. A skill links to a project only if PROJECT_AUDIT.md confirms it was applied there.
// No percentages or self-ratings. Skills with an empty `projects` list come from training or general practice.

type Slug = Project["slug"];

export interface Skill {
  id: string;
  label: Localized;
  projects: Slug[];
  /** One line: where/how it was applied */
  how: Localized;
}

export interface SkillGroup {
  id: "qa" | "game-design" | "dev-tools";
  title: Localized;
  skills: Skill[];
}

const web: Slug[] = ["grand-mall-batumi", "sakhli"];
const roblox: Slug[] = ["woodcutter-vs-zombies", "cabin-chaos", "pillars", "build-your-pet"];

export const skillGroups: SkillGroup[] = [
  {
    id: "qa",
    title: { en: "QA & Testing", ru: "QA и тестирование" },
    skills: [
      {
        id: "manual-testing",
        label: { en: "Manual functional testing", ru: "Ручное функциональное тестирование" },
        projects: ["woodcutter-vs-zombies", "sakhli"],
        how: {
          en: "Multicart extension; every Woodcutter build tested by hand in Studio; Sakhli's 20+ item checklist.",
          ru: "Расширение Multicart; каждая сборка Woodcutter проверена вручную в Studio; чек-лист Sakhli на 20+ пунктов.",
        },
      },
      {
        id: "bug-reports",
        label: { en: "Bug reports & defect reproduction", ru: "Баг-репорты и воспроизведение дефектов" },
        projects: ["build-your-pet"],
        how: {
          en: "English bug reports for Multicart; BUG-1…4 in Build Your Own Pet logged, fixed and re-tested.",
          ru: "Баг-репорты на английском для Multicart; BUG-1…4 в «Собери своего питомца» — заведены, исправлены и перепроверены.",
        },
      },
      {
        id: "test-scenarios",
        label: { en: "Test scenarios & user journeys", ru: "Тест-сценарии и пользовательские пути" },
        projects: ["grand-mall-batumi", "build-your-pet"],
        how: {
          en: "11 critical journeys in Grand Mall; a 21-case QA matrix in Build Your Own Pet.",
          ru: "11 ключевых сценариев в Grand Mall; QA-матрица на 21 кейс в «Собери своего питомца».",
        },
      },
      {
        id: "regression",
        label: { en: "Regression & re-testing", ru: "Регресс и перепроверка" },
        projects: ["cabin-chaos"],
        how: {
          en: "Cabin Chaos suites re-run after fixes, latest result 6 suites PASS.",
          ru: "Наборы Cabin Chaos перезапускаются после исправлений, последний итог — 6 наборов PASS.",
        },
      },
      {
        id: "responsive-a11y",
        label: { en: "Responsive & accessibility testing", ru: "Адаптивность и доступность" },
        projects: web,
        how: {
          en: "Viewport matrices (192 and 165 combinations), axe checks, 320 px checks, keyboard and reduced-motion checks.",
          ru: "Матрицы экранов (192 и 165 комбинаций), проверки axe, проверки на 320 px, клавиатура и reduced motion.",
        },
      },
      {
        id: "i18n-testing",
        label: { en: "Localization testing", ru: "Тестирование локализации" },
        projects: [...web, "cabin-chaos"],
        how: {
          en: "Overflow checks for RU/KA text on both websites; 207 localization checks in Cabin Chaos.",
          ru: "Проверки переполнения RU/KA-текстов на обоих сайтах; 207 проверок локализации в Cabin Chaos.",
        },
      },
      {
        id: "game-testing",
        label: { en: "Game testing in Roblox Studio", ru: "Тестирование игр в Roblox Studio" },
        projects: roblox,
        how: {
          en: "In-game SelfTests (Woodcutter, PILLARS on 13 maps), Python suites in Cabin Chaos, Lune tests in Build Your Own Pet.",
          ru: "Внутриигровые SelfTest (Woodcutter, PILLARS на 13 картах), Python-наборы в Cabin Chaos, тесты Lune в «Собери своего питомца».",
        },
      },
      {
        id: "playwright",
        label: { en: "Test automation with Playwright", ru: "Автотесты на Playwright" },
        projects: ["grand-mall-batumi"],
        how: {
          en: "E2E suites: 11 user journeys in Grand Mall.",
          ru: "E2E-наборы: 11 пользовательских сценариев в Grand Mall.",
        },
      },
      {
        id: "lighthouse",
        label: { en: "Performance audits (Lighthouse)", ru: "Аудит производительности (Lighthouse)" },
        projects: web,
        how: {
          en: "Lighthouse lab runs on both websites; Grand Mall mobile LCP reduced from 3.9–4.5 s to 3.3–3.5 s.",
          ru: "Lab-прогоны Lighthouse на обоих сайтах; LCP Grand Mall на мобильных снижен с 3,9–4,5 с до 3,3–3,5 с.",
        },
      },
      {
        id: "sql",
        label: { en: "Basic SQL", ru: "Базовый SQL" },
        projects: [],
        how: { en: "From the Yandex Practicum QA course.", ru: "Из курса Яндекс Практикума." },
      },
    ],
  },
  {
    id: "game-design",
    title: { en: "Game Design", ru: "Гейм-дизайн" },
    skills: [
      {
        id: "core-loops",
        label: { en: "Core loops & progression", ru: "Игровые циклы и прогрессия" },
        projects: roblox,
        how: {
          en: "Chop → upgrade → build → defend in Woodcutter; parts → pet → PvP from level 15 in Build Your Own Pet.",
          ru: "Рубка → прокачка → стройка → оборона в Woodcutter; части → питомец → PvP с 15 уровня в «Собери своего питомца».",
        },
      },
      {
        id: "economy",
        label: { en: "Economy & monetization", ru: "Экономика и монетизация" },
        projects: roblox,
        how: {
          en: "Game passes, coin packs, shops and inventories with Robux purchases across all four games.",
          ru: "Геймпассы, пакеты монет, магазины и инвентари с покупками за Robux во всех четырёх играх.",
        },
      },
      {
        id: "balance",
        label: { en: "Balancing", ru: "Баланс" },
        projects: ["cabin-chaos", "build-your-pet"],
        how: {
          en: "A drink-balance test suite in Cabin Chaos; a game-data balance spreadsheet in Build Your Own Pet.",
          ru: "Набор тестов баланса напитков в Cabin Chaos; таблица баланса игровых данных в «Собери своего питомца».",
        },
      },
      {
        id: "multiplayer",
        label: { en: "Multiplayer & co-op design", ru: "Мультиплеер и кооператив" },
        projects: ["cabin-chaos", "pillars", "woodcutter-vs-zombies"],
        how: {
          en: "1–4 player co-op, lobbies with gates and reserved servers, map voting, night-time PvP.",
          ru: "Кооператив на 1–4 игрока, лобби с гейтами и резервными серверами, голосование за карту, ночное PvP.",
        },
      },
      {
        id: "level-design",
        label: { en: "Level & map design", ru: "Дизайн уровней и карт" },
        projects: ["pillars", "woodcutter-vs-zombies"],
        how: {
          en: "13 procedural maps with 84–97% reachable surface in PILLARS; 6 expandable plots in Woodcutter.",
          ru: "13 процедурных карт с доступностью 84–97% поверхности в PILLARS; 6 расширяемых участков в Woodcutter.",
        },
      },
      {
        id: "onboarding",
        label: { en: "Onboarding & retention", ru: "Онбординг и удержание" },
        projects: ["woodcutter-vs-zombies"],
        how: {
          en: "An 11-step tutorial, 57 achievement tiers and a daily reward.",
          ru: "Обучение из 11 заданий, 57 ступеней достижений и ежедневная награда.",
        },
      },
      {
        id: "player-ux",
        label: { en: "Player UX & mobile UI", ru: "UX игрока и мобильный UI" },
        projects: ["cabin-chaos", "woodcutter-vs-zombies"],
        how: {
          en: "Phone-friendly UI in Cabin Chaos; furniture placement that works on phones in Woodcutter.",
          ru: "Интерфейс под телефон в Cabin Chaos; расстановка мебели, которая работает на телефоне, в Woodcutter.",
        },
      },
    ],
  },
  {
    id: "dev-tools",
    title: { en: "Development & Tools", ru: "Разработка и инструменты" },
    skills: [
      {
        id: "roblox-studio",
        label: { en: "Roblox Studio & Luau", ru: "Roblox Studio и Luau" },
        projects: roblox,
        how: {
          en: "Four games in Luau, synced from files with Rojo.",
          ru: "Четыре игры на Luau, синхронизация из файлов через Rojo.",
        },
      },
      {
        id: "nextjs",
        label: { en: "Next.js, React & TypeScript", ru: "Next.js, React и TypeScript" },
        projects: web,
        how: {
          en: "Three multilingual websites, plus this portfolio.",
          ru: "Три многоязычных сайта и это портфолио.",
        },
      },
      {
        id: "blender",
        label: { en: "Blender & Python scripting", ru: "Blender и Python-скрипты" },
        projects: ["woodcutter-vs-zombies", "cabin-chaos", "build-your-pet"],
        how: {
          en: "A Blender scene and FBX assets in Woodcutter; generate_*.py scripts for Cabin Chaos assets and Build Your Own Pet parts.",
          ru: "Сцена Blender и FBX-ассеты в Woodcutter; скрипты generate_*.py для ассетов Cabin Chaos и частей «Собери своего питомца».",
        },
      },
      {
        id: "git",
        label: { en: "Git & GitHub", ru: "Git и GitHub" },
        projects: ["grand-mall-batumi", "pillars", "sakhli"],
        how: {
          en: "Feature branches per iteration in Grand Mall, a v1.0 release tag in PILLARS.",
          ru: "Отдельные ветки на каждую итерацию в Grand Mall, релизный тег v1.0 в PILLARS.",
        },
      },
      {
        id: "vscode",
        label: { en: "VS Code", ru: "VS Code" },
        projects: [],
        how: { en: "My code editor.", ru: "Мой редактор кода." },
      },
      {
        id: "ai-tools",
        label: { en: "AI tools: Claude Code, Codex", ru: "AI-инструменты: Claude Code, Codex" },
        projects: [...web, ...roblox],
        how: {
          en: "A tool for code and routine work; the tasks, design and checks are mine.",
          ru: "Инструмент для кода и рутины; задачи, дизайн и проверка — мои.",
        },
      },
    ],
  },
];
