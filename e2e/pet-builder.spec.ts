import { expect, test } from "@playwright/test";

test("pet builder: set bonus follows the dominant element (accessory excluded)", async ({ page }) => {
  await page.goto("/en");
  const pg = page.locator("#game-playground");
  await pg.scrollIntoViewIfNeeded();
  const bonus = pg.locator("[aria-live]").filter({ hasText: "parts:" });
  await expect(bonus).toHaveText("6/6 Cotton Cloud parts: element ability upgraded");

  await pg.getByRole("tab", { name: "Head" }).click();
  await pg.getByRole("radio", { name: "Strawberry Dragon" }).click();
  await expect(bonus).toHaveText("5/6 Cotton Cloud parts: element ability unlocked");

  await pg.getByRole("tab", { name: "Accessory" }).click();
  await pg.getByRole("radio", { name: "Legendary" }).click();
  await expect(bonus).toHaveText("5/6 Cotton Cloud parts: element ability unlocked");
});
