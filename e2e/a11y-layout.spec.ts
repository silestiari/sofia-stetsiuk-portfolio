import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const pages = ["/en", "/ru", "/en/projects/cabin-chaos", "/ru/projects/build-your-pet"];

/** Scroll through the page so lazily mounted sections render before checking. */
const scrollThrough = (page: Page) =>
  page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });

for (const path of pages)
  test(`axe: no violations on ${path} (planted demo defect excluded)`, async ({ page }) => {
    await page.goto(path);
    await scrollThrough(page);
    const { violations } = await new AxeBuilder({ page }).exclude("[data-qa-demo-defect]").analyze();
    expect(violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });

for (const width of [360, 390])
  for (const path of ["/en", "/ru", "/ru/projects/build-your-pet", "/ru/projects/woodcutter-vs-zombies"])
    test(`no horizontal scroll at ${width}px on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      await scrollThrough(page);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(width);
    });

test("no console errors or uncaught exceptions on home and cases", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  for (const path of ["/en", "/ru", "/en/projects/grand-mall-batumi", "/ru/projects/pillars", "/en/projects/build-your-pet"]) {
    await page.goto(path);
    await scrollThrough(page);
  }
  expect(errors).toEqual([]);
});
