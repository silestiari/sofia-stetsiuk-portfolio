import { expect, test } from "@playwright/test";

test("root redirects to en, switcher keeps path and remembers ru", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.getByRole("link", { name: "Русский" }).click();
  await expect(page).toHaveURL(/\/ru$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");

  await page.goto("/");
  await expect(page).toHaveURL(/\/ru$/);
});
