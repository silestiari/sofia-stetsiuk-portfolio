/**
 * The colour tokens of globals.css for places that cannot read CSS variables: canvas 2D, WebGL materials,
 * the OG image. Keep in sync with :root in globals.css (e2e/tokens.spec.ts fails when they drift).
 */
export const color = {
  bg: "#0A0A0A",
  surface2: "#1E1E1E",
  panel: "#262626",
  line: "#2E2E2E",
  lineStrong: "#4D4D4D",
  text: "#F2F2F2",
  text2: "#A8A8A8",
  text3: "#858585",
  accent: "#F58FBA",
  signal: "#C5F25A",
} as const;

/** CSS variable each key mirrors. */
export const cssVar: Record<keyof typeof color, string> = {
  bg: "--color-bg",
  surface2: "--color-surface-2",
  panel: "--color-panel",
  line: "--color-line",
  lineStrong: "--color-line-strong",
  text: "--color-text",
  text2: "--color-text-2",
  text3: "--color-text-3",
  accent: "--color-qa-accent",
  signal: "--color-signal",
};
