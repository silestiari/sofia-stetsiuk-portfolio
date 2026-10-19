import { expect, test } from "@playwright/test";
import { color, cssVar } from "../src/lib/tokens";

test("JS colour tokens match the CSS variables", async ({ page }) => {
  await page.goto("/en");
  const css = await page.evaluate(
    (vars) => vars.map((v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim().toUpperCase()),
    Object.values(cssVar),
  );
  expect(css).toEqual(Object.values(color));
});
