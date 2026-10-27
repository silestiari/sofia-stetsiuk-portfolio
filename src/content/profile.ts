import type { Localized } from "./types";

// Confirmed facts only. Age is intentionally not shown on the site.

export type WorkFormat = "remote" | "on-site" | "hybrid" | "relocation";

export interface Profile {
  /** Latin spelling used in hero, SEO and contacts */
  name: string;
  localizedName: Localized;
  roles: Localized<string[]>;
  headline: Localized;
  tagline: Localized;
  bio: Localized;
  location: Localized;
  workFormats: { id: WorkFormat; label: Localized }[];
  openTo: Localized<string[]>;
  contacts: {
    email: string;
    phone: { display: string; href: string };
    telegram: { href: string; handle: string };
    github: { href: string; handle: string };
    steam: { href: string; handle: string };
  };
  education: { title: Localized; provider: Localized }[];
  experience: { title: Localized; context: Localized; points: Localized<string[]> }[];
}

export const profile: Profile = {
  name: "Sofia Stetsiuk",
  localizedName: { en: "Sofia Stetsiuk", ru: "София Стецюк" },
  roles: {
    en: ["QA Engineer", "Game QA", "Game Designer", "AI-Assisted Development"],
    ru: ["QA-инженер", "Game QA", "Гейм-дизайнер", "Разработка с AI"],
  },
  headline: { en: "QA Engineer × Game Designer", ru: "QA-инженер × гейм-дизайнер" },
  tagline: {
    en: "Testing experiences. Designing worlds. Building with AI.",
    ru: "Тестирую опыт. Проектирую миры. Создаю вместе с AI.",
  },
  bio: {
    en: "I test products the way players and users actually use them, design game systems for Roblox, and build web and game projects with a team of AI agents, where I set the tasks, make the design calls and check the result.",
    ru: "Я тестирую продукты так, как ими на самом деле пользуются игроки и пользователи, проектирую игровые системы для Roblox и собираю веб- и игровые проекты с командой AI-агентов: ставлю задачи, принимаю дизайн-решения и проверяю результат.",
  },
  location: { en: "Batumi, Georgia", ru: "Батуми, Грузия" },
  workFormats: [
    { id: "remote", label: { en: "Remote", ru: "Удалённо" } },
    { id: "on-site", label: { en: "On-site", ru: "В офисе" } },
    { id: "hybrid", label: { en: "Hybrid", ru: "Гибрид" } },
    { id: "relocation", label: { en: "Relocation", ru: "Релокация" } },
  ],
  openTo: {
    en: ["QA Engineer", "Game QA", "Game Design"],
    ru: ["QA-инженер", "Game QA", "Гейм-дизайн"],
  },
  contacts: {
    email: "sofiavipera@gmail.com",
    phone: { display: "+995 571 247 510", href: "tel:+995571247510" },
    telegram: { href: "https://t.me/silestiari", handle: "@silestiari" },
    github: { href: "https://github.com/silestiari", handle: "silestiari" },
    steam: { href: "https://steamcommunity.com/id/silestiari/", handle: "silestiari" },
  },
  education: [
    {
      title: { en: "QA Engineer course", ru: "Курс «Инженер по тестированию»" },
      provider: { en: "Yandex Practicum", ru: "Яндекс Практикум" },
    },
  ],
  experience: [
    {
      title: { en: "Manual testing: Multicart browser extension", ru: "Ручное тестирование: браузерное расширение Multicart" },
      context: { en: "Hands-on QA practice", ru: "Практика в QA" },
      points: {
        en: [
          "Functional testing of the extension's features",
          "Reproducing defects and narrowing down the steps that trigger them",
          "Writing bug reports in English",
          "Designing and walking through user scenarios",
          "Reviewing interfaces for usability and consistency issues",
        ],
        ru: [
          "Функциональное тестирование возможностей расширения",
          "Воспроизведение дефектов и поиск шагов, которые к ним приводят",
          "Баг-репорты на английском языке",
          "Составление и прохождение пользовательских сценариев",
          "Анализ интерфейсов на удобство и согласованность",
        ],
      },
    },
  ],
};
