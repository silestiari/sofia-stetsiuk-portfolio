import { expect, test } from "@playwright/test";

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
