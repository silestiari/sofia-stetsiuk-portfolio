import { expect, test } from "@playwright/test";

test("QA Playground (RU): all 5 demo bugs can be found, reports open, Reset clears", async ({ page }) => {
  await page.goto("/ru#qa-playground");
  const section = page.locator("#qa-playground");
  const panel = section.getByRole("tabpanel");
  const counter = section.getByTestId("qa-found-counter");
  // Tabs are picked by position: their RU labels are a separate i18n check (see i18n-routing.spec.ts).
  const tab = (i: number) => section.getByRole("tablist", { name: /виджет/i }).getByRole("tab").nth(i);
  await expect(section.getByText("Демонстрационные дефекты", { exact: false }).first()).toBeVisible();
  await expect(counter).toContainText("0 / 5");

  // BUG-001: double submit
  const place = panel.getByRole("button", { name: "Оформить заказ" });
  await place.click();
  await place.click();
  await expect(counter).toContainText("1 / 5");

  // BUG-002: promo applied twice
  await tab(1).click();
  await panel.getByRole("textbox").fill("loot10");
  await panel.locator("form button[type=submit]").click();
  await expect(counter).toContainText("2 / 5");

  // BUG-003: keyboard pass skips the remove icon
  await tab(2).click();
  const use = panel.locator("button[data-use]").first();
  await use.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab"); // focus-visible on "Use"
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
  await expect(counter).toContainText("3 / 5");

  // BUG-004: valid email with "+" rejected
  await tab(3).click();
  const inputs = panel.locator("form input");
  await inputs.nth(0).fill("Sofia");
  await inputs.nth(1).fill("qa+test@example.com");
  await inputs.nth(2).fill("2");
  await panel.locator("form button[type=submit]").click();
  await expect(counter).toContainText("4 / 5");

  // BUG-005: RU label clipped
  await tab(4).click();
  await panel.getByRole("button", { name: "ru", exact: true }).click();
  await expect(counter).toContainText("5 / 5");

  for (const id of ["BUG-001", "BUG-002", "BUG-003", "BUG-004", "BUG-005"]) {
    const report = section.getByTestId(`report-${id}`);
    await expect(report).toBeVisible();
    await report.getByRole("button", { name: "Развернуть отчёт" }).click();
    for (const field of ["Шаги", "Ожидаемый", "Фактический"]) await expect(report.getByText(field, { exact: false }).first()).toBeVisible();
  }

  await section.getByRole("button", { name: "Сбросить" }).click();
  await expect(counter).toContainText("0 / 5");
  await section.getByRole("button", { name: /Показать все/ }).click();
  await expect(counter).toContainText("5 / 5");
});

test("Pet Builder: choosing a part, Randomize and Reset update the composition", async ({ page }) => {
  await page.goto("/en#game-playground");
  const section = page.locator("#game-playground");
  const composition = section.locator("section[aria-labelledby=pet-composition]");
  await expect(composition).toContainText("Air × 6");

  await section.getByRole("tab", { name: "Head" }).click();
  await section.getByRole("radiogroup", { name: "Options for Head" }).getByRole("radio", { name: "Fire" }).click();
  await expect(composition).toContainText("Fire × 1");
  await expect(composition).toContainText("Air × 5");

  await section.getByRole("tab", { name: "Accessory" }).click();
  await section.getByRole("radio", { name: "Epic" }).click();
  await expect(composition).toContainText("Epic");

  await section.getByRole("button", { name: "Randomize" }).click();
  await expect(composition.locator("dd").first()).not.toBeEmpty();
  await page.waitForTimeout(600); // Randomize lands parts with a 60 ms stagger; let it finish (see next test)

  await section.getByRole("button", { name: "Reset" }).click();
  await expect(composition).toContainText("Air × 6");
  await expect(composition).toContainText("None");
});

test("Pet Builder: Reset clicked right after Randomize is not overwritten by the pending stagger", async ({ page }) => {
  await page.goto("/en#game-playground");
  const section = page.locator("#game-playground");
  const composition = section.locator("section[aria-labelledby=pet-composition]");
  for (let i = 0; i < 5; i++) {
    await section.getByRole("button", { name: "Randomize" }).click();
    await section.getByRole("button", { name: "Reset" }).click();
    await page.waitForTimeout(600);
    await expect(composition).toContainText("Air × 6");
    await expect(composition).toContainText("None");
  }
});

test("AI Lab: every workflow node opens its details", async ({ page }) => {
  await page.goto("/en#ai-lab");
  const section = page.locator("#ai-lab");
  const nodes = section.locator("[data-testid^=ai-node-]");
  const n = await nodes.count();
  expect(n).toBe(7);
  const titles = new Set<string>();
  for (let i = 0; i < n; i++) {
    await nodes.nth(i).click();
    await expect(nodes.nth(i)).toHaveAttribute("aria-pressed", "true");
    titles.add((await section.getByTestId("ai-lab-details").getByRole("heading", { level: 3 }).innerText()).trim());
  }
  expect(titles.size).toBe(7);
});

test("Showroom: every model opens in the dialog", async ({ page }) => {
  // Opening only: posters instead of WebGL, so 39 models don't each load into software GL.
  await page.addInitScript(() => {
    // @ts-expect-error simulate a browser without WebGL2
    delete window.WebGL2RenderingContext;
  });
  await page.goto("/en#showroom");
  const cards = page.locator("#showroom").getByRole("list", { name: "Models" }).getByRole("button");
  const n = await cards.count();
  expect(n).toBe(33);
  for (let i = 0; i < n; i++) {
    await cards.nth(i).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  }
});

test("Showroom: getContext('webgl2') returning null falls back to posters", async ({ page }) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    // @ts-expect-error test override
    HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
      return /webgl/.test(type) ? null : orig.call(this, type, ...(rest as []));
    };
  });
  await page.goto("/en#showroom");
  await page.locator("#showroom").getByRole("list", { name: "Models" }).getByRole("button").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("3D isn’t available", { exact: false }).or(dialog.getByText("3D is", { exact: false })).first()).toBeVisible();
  await expect(dialog.locator("canvas")).toHaveCount(0);
  await expect(dialog.locator("img[src^='/posters/']")).toBeVisible();
});
