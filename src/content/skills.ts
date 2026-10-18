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
  id: "qa" | "game-design" | "dev-tools" | "ai";
  title: Localized;
  skills: Skill[];
}

const web: Slug[] = ["grand-mall-batumi", "metrocity", "sakhli"];
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
        projects: ["metrocity", "build-your-pet"],
        how: {
          en: "English bug reports for Multicart; defects F-1/F-2 in Metro City and BUG-1…4 in Petforge logged, fixed and re-tested.",
          ru: "Баг-репорты на английском для Multicart; дефекты F-1/F-2 в Metro City и BUG-1…4 в Petforge — заведены, исправлены и перепроверены.",
        },
      },
      {
        id: "test-scenarios",
        label: { en: "Test scenarios & user journeys", ru: "Тест-сценарии и пользовательские пути" },
        projects: ["grand-mall-batumi", "build-your-pet"],
        how: {
          en: "11 critical journeys in Grand Mall; a 21-case QA matrix in Petforge.",
          ru: "11 ключевых сценариев в Grand Mall; QA-матрица на 21 кейс в Petforge.",
        },
      },
      {
        id: "regression",
        label: { en: "Regression & re-testing", ru: "Регресс и перепроверка" },
        projects: ["metrocity", "cabin-chaos"],
        how: {
          en: "Metro City smoke suite re-run after fixes (44/46 → 46/46); Cabin Chaos suites re-run, latest result 6 suites PASS.",
          ru: "Smoke-набор Metro City перезапущен после исправлений (44/46 → 46/46); наборы Cabin Chaos перезапускаются, последний итог — 6 наборов PASS.",
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
          en: "Overflow checks for RU/KA text on three websites; 207 localization checks in Cabin Chaos.",
          ru: "Проверки переполнения RU/KA-текстов на трёх сайтах; 207 проверок локализации в Cabin Chaos.",
        },
      },
      {
        id: "game-testing",
        label: { en: "Game testing in Roblox Studio", ru: "Тестирование игр в Roblox Studio" },
        projects: roblox,
        how: {
          en: "In-game SelfTests (Woodcutter, PILLARS on 13 maps), Python suites in Cabin Chaos, Lune tests in Petforge.",
          ru: "Внутриигровые SelfTest (Woodcutter, PILLARS на 13 картах), Python-наборы в Cabin Chaos, тесты Lune в Petforge.",
        },
      },
      {
        id: "playwright",
        label: { en: "Test automation with Playwright", ru: "Автотесты на Playwright" },
        projects: ["grand-mall-batumi", "metrocity"],
        how: {
          en: "AI-assisted E2E suites: 11 journeys in Grand Mall, a 46-test smoke run in Metro City.",
          ru: "E2E-наборы, написанные с AI: 11 сценариев в Grand Mall, smoke-прогон на 46 тестов в Metro City.",
        },
      },
      {
        id: "lighthouse",
        label: { en: "Performance audits (Lighthouse)", ru: "Аудит производительности (Lighthouse)" },
        projects: web,
        how: {
          en: "Lighthouse lab runs on all three websites; Grand Mall mobile LCP reduced from 3.9–4.5 s to 3.3–3.5 s.",
          ru: "Lab-прогоны Lighthouse на всех трёх сайтах; LCP Grand Mall на мобильных снижен с 3,9–4,5 с до 3,3–3,5 с.",
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
          en: "Chop → upgrade → build → defend in Woodcutter; parts → pet → PvP from level 15 in Petforge.",
          ru: "Рубка → прокачка → стройка → оборона в Woodcutter; части → питомец → PvP с 15 уровня в Petforge.",
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
          en: "A drink-balance test suite in Cabin Chaos; a game-data balance spreadsheet in Petforge.",
          ru: "Набор тестов баланса напитков в Cabin Chaos; таблица баланса игровых данных в Petforge.",
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
          en: "Three multilingual websites built with AI agents, plus this portfolio.",
          ru: "Три многоязычных сайта, собранных с AI-агентами, и это портфолио.",
        },
      },
      {
        id: "blender",
        label: { en: "Blender & Python scripting", ru: "Blender и Python-скрипты" },
        projects: ["woodcutter-vs-zombies", "cabin-chaos", "build-your-pet"],
        how: {
          en: "183 FBX models for Woodcutter; generate_*.py scripts for Cabin Chaos assets and Petforge parts.",
          ru: "183 FBX-модели для Woodcutter; скрипты generate_*.py для ассетов Cabin Chaos и частей Petforge.",
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
    ],
  },
  {
    id: "ai",
    title: { en: "AI & Automation", ru: "AI и автоматизация" },
    skills: [
      {
        id: "claude-code",
        label: { en: "Claude Code", ru: "Claude Code" },
        projects: [...web, ...roblox],
        how: {
          en: "Main development environment for all seven projects.",
          ru: "Основная среда разработки во всех семи проектах.",
        },
      },
      {
        id: "codex",
        label: { en: "Codex", ru: "Codex" },
        projects: ["cabin-chaos", "grand-mall-batumi"],
        how: {
          en: "7 TOML agents with MCP in Cabin Chaos; Grand Mall started in Codex before moving to Claude Code.",
          ru: "7 TOML-агентов с MCP в Cabin Chaos; Grand Mall начинался в Codex, потом переехал в Claude Code.",
        },
      },
      {
        id: "multi-agent",
        label: { en: "Multi-agent workflows", ru: "Мультиагентная разработка" },
        projects: [...web, ...roblox],
        how: {
          en: "From 3 agents in Woodcutter to 14 in Metro City, with roles and file-ownership rules.",
          ru: "От 3 агентов в Woodcutter до 14 в Metro City — с ролями и правилами владения файлами.",
        },
      },
      {
        id: "mcp",
        label: { en: "MCP integrations", ru: "MCP-интеграции" },
        projects: ["cabin-chaos", "woodcutter-vs-zombies", "grand-mall-batumi"],
        how: {
          en: "Blender and Roblox Studio MCP in Cabin Chaos, Blender MCP in Woodcutter, Playwright MCP in Grand Mall.",
          ru: "MCP для Blender и Roblox Studio в Cabin Chaos, Blender MCP в Woodcutter, Playwright MCP в Grand Mall.",
        },
      },
      {
        id: "prompting",
        label: { en: "Staged prompts & task specs", ru: "Поэтапные промпты и ТЗ" },
        projects: ["cabin-chaos", "build-your-pet"],
        how: {
          en: "Prompt24–Prompt30 stages in Cabin Chaos; a master prompt with per-agent task files in Petforge.",
          ru: "Этапы Prompt24–Prompt30 в Cabin Chaos; мастер-промпт и задания для каждого агента в Petforge.",
        },
      },
      {
        id: "ai-review",
        label: { en: "AI-assisted code review", ru: "Ревью кода с AI" },
        projects: ["woodcutter-vs-zombies", "pillars", "grand-mall-batumi"],
        how: {
          en: "Reviewer, tester and security agents; their findings were checked and fixed.",
          ru: "Агенты-ревьюеры, тестировщики и security-агенты; их находки проверены и исправлены.",
        },
      },
    ],
  },
];
