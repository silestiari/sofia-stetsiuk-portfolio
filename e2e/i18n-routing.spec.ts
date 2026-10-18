import { expect, test } from "@playwright/test";

// The desktop header switcher; the mobile menu has its own (hidden) copy.
const switchTo = (page: import("@playwright/test").Page, l: "en" | "ru") => page.locator(`header a[hreflang="${l}"]:visible`).first().click();

test("case page: switcher keeps the path and the anchor", async ({ page }) => {
  await page.goto("/en/projects/pillars");
  await switchTo(page, "ru");
  await expect(page).toHaveURL(/\/ru\/projects\/pillars$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");

  await page.goto("/en/projects/cabin-chaos#media");
  await switchTo(page, "ru");
  await expect(page).toHaveURL(/\/ru\/projects\/cabin-chaos#media$/);
});

test("home: switcher keeps the section in view", async ({ page }) => {
  await page.goto("/ru#skills");
  // the idle-loaded hero canvas can nudge the scroll after load; click once the page is settled
  await page.waitForLoadState("networkidle");
  await expect(page.locator('header a[hreflang="en"]:visible')).toHaveAttribute("href", "/en#skills");
  await switchTo(page, "en");
  await expect(page).toHaveURL(/\/en#skills$/);
  await expect(page.getByRole("heading", { level: 2, name: "Skills" })).toBeInViewport();
});

test("cookie remembers the choice; unprefixed paths redirect to it", async ({ page, context }) => {
  await page.goto("/en");
  await switchTo(page, "ru");
  await expect(page).toHaveURL(/\/ru$/);
  const cookie = (await context.cookies()).find((c) => c.name === "NEXT_LOCALE");
  expect(cookie?.value).toBe("ru");

  await page.goto("/");
  await expect(page).toHaveURL(/\/ru$/);
  await page.goto("/projects/sakhli");
  await expect(page).toHaveURL(/\/ru\/projects\/sakhli$/);
});

test("RU: QA Playground widget tabs are translated", async ({ page }) => {
  await page.goto("/ru#qa-playground");
  const labels = await page.locator("#qa-playground [role=tab]").allInnerTexts();
  expect(labels).toHaveLength(5);
  for (const l of labels) expect(l, `untranslated tab "${l}"`).toMatch(/[А-Яа-яЁё]/);
});

test("without cookie / redirects to /en regardless of Accept-Language", async ({ browser }) => {
  const ctx = await browser.newContext({ locale: "ru-RU" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await ctx.close();
});
