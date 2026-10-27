import type { Localized, Project } from "./types";

// About section: path without dates. Each stage points to projects (or a confirmed fact) that back it up.

export interface JourneyStage {
  id: string;
  /** HUD label, <= 24 chars in RU */
  label: Localized;
  title: Localized;
  text: Localized;
  projects: Project["slug"][];
  /** Proof when no project applies (course, practice) */
  evidence?: Localized;
}

export const journey: JourneyStage[] = [
  {
    id: "games",
    label: { en: "START", ru: "СТАРТ" },
    title: { en: "Games and game systems", ru: "Игры и игровые системы" },
    text: {
      en: "It started with games, and I still play a lot. Not just playing, but taking them apart: why a loop keeps you hooked, where an economy breaks, what makes a player come back.",
      ru: "Всё началось с игр, и я до сих пор много играю. Причём не просто играю, а разбираю их: почему цикл затягивает, где ломается экономика, что заставляет игрока вернуться.",
    },
    projects: ["woodcutter-vs-zombies"],
  },
  {
    id: "qa-course",
    label: { en: "TRAINING", ru: "ОБУЧЕНИЕ" },
    title: { en: "Learning software testing", ru: "Обучение тестированию" },
    text: {
      en: "I turned that curiosity into a craft with the QA Engineer course at Yandex Practicum, learning to look for problems systematically, not by chance.",
      ru: "Это любопытство я превратила в профессию на курсе «Инженер по тестированию» в Яндекс Практикуме — училась искать проблемы системно, а не случайно.",
    },
    projects: [],
    evidence: { en: "Yandex Practicum: QA Engineer course", ru: "Яндекс Практикум — «Инженер по тестированию»" },
  },
  {
    id: "multicart",
    label: { en: "PRACTICE", ru: "ПРАКТИКА" },
    title: { en: "Hands-on QA: Multicart", ru: "Практика: Multicart" },
    text: {
      en: "Manual testing of the Multicart browser extension: functional checks, reproducing defects, bug reports in English, user scenarios and interface reviews.",
      ru: "Ручное тестирование браузерного расширения Multicart: функциональные проверки, воспроизведение дефектов, баг-репорты на английском, пользовательские сценарии и анализ интерфейсов.",
    },
    projects: [],
    evidence: { en: "Manual testing of the Multicart extension", ru: "Ручное тестирование расширения Multicart" },
  },
  {
    id: "web",
    label: { en: "WEB", ru: "ВЕБ" },
    title: { en: "Web projects", ru: "Веб-проекты" },
    text: {
      en: "Two multilingual websites where QA was built into the process from day one: Playwright journeys, accessibility checks, viewport matrices and Lighthouse audits.",
      ru: "Два многоязычных сайта, где тестирование было частью процесса с первого дня: сценарии Playwright, проверки доступности, матрицы экранов и аудиты Lighthouse.",
    },
    projects: ["grand-mall-batumi", "sakhli"],
  },
  {
    id: "roblox",
    label: { en: "ROBLOX", ru: "ROBLOX" },
    title: { en: "Roblox games", ru: "Игры на Roblox" },
    text: {
      en: "Four games in Roblox Studio: a tycoon, a co-op party game, multiplayer hide-and-seek and a pet builder. All four are released.",
      ru: "Четыре игры в Roblox Studio — тайкун, кооперативная party-игра, мультиплеерные прятки и конструктор питомцев. Все четыре выпущены.",
    },
    projects: ["woodcutter-vs-zombies", "cabin-chaos", "pillars", "build-your-pet"],
  },
  {
    id: "blender",
    label: { en: "3D ASSETS", ru: "3D-АССЕТЫ" },
    title: { en: "Blender and game assets", ru: "Blender и игровые ассеты" },
    text: {
      en: "Blender is part of every game pipeline, and in Cabin Chaos and Build Your Own Pet, Python scripts generate whole asset kits and pet parts.",
      ru: "Blender есть в пайплайне каждой игры, а в Cabin Chaos и «Собери своего питомца» Python-скрипты генерируют целые наборы ассетов и части питомцев.",
    },
    projects: ["woodcutter-vs-zombies", "cabin-chaos", "build-your-pet"],
  },
  {
    id: "next",
    label: { en: "NEXT", ru: "ДАЛЬШЕ" },
    title: { en: "Growing in QA and Game Design", ru: "Рост в QA и гейм-дизайне" },
    text: {
      en: "Now I'm looking for a team where I can grow as a QA engineer, Game QA or game designer, and bring the habit of checking everything twice.",
      ru: "Сейчас я ищу команду, где смогу расти как QA-инженер, Game QA или гейм-дизайнер, — и привнести привычку всё перепроверять.",
    },
    projects: ["pillars", "build-your-pet"],
  },
];
