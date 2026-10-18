// Order of sections on the one-page home. Ids are used as anchors and as message keys (nav.*, sections.*).
// pass / grid / hud = render-pass map from DESIGN_SYSTEM.md 8.3 (grid = --grid-opacity, hud = --hud-opacity).
export const sections = [
  { id: "hero", pass: "wire", grid: 1, hud: 1 },
  // exit*: the roblox sub-block scrubs clay → shaded (grid 1 → 0, hud 1 → 0.4), see globals.css #projects
  { id: "projects", pass: "debug", grid: 1, hud: 1, exitGrid: 0, exitHud: 0.4 },
  { id: "showroom", pass: "shaded", grid: 0, hud: 0.4 },
  { id: "about", pass: "debug-light", grid: 0.4, hud: 0.6 },
  { id: "skills", pass: "debug-light", grid: 0.4, hud: 0.6 },
  { id: "ai-lab", pass: "debug-light", grid: 0.6, hud: 0.8 },
  { id: "qa-playground", pass: "debug", grid: 1, hud: 1 },
  { id: "game-playground", pass: "pastel", grid: 0, hud: 0 },
  { id: "contact", pass: "beauty", grid: 0, hud: 0 },
] as const;

export const sectionIds = sections.map((s) => s.id);

export type SectionId = (typeof sections)[number]["id"];
export type RenderPass = (typeof sections)[number]["pass"] | "clay";

/** Desktop navigation (DESIGN_SYSTEM.md 2.3): "Labs" points at #ai-lab. */
export const desktopNavIds = ["projects", "showroom", "about", "skills", "ai-lab"] as const satisfies readonly SectionId[];
