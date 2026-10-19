import { expect, test } from "@playwright/test";

const sections = ["hero", "projects", "showroom", "about", "skills", "ai-lab", "game-playground", "contact"];

test("skip link is the first Tab stop and moves focus to main content", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#content$/);
  await expect(page.locator("#content")).toBeFocused();
});

test("every section anchor exists once on the home page", async ({ page }) => {
  await page.goto("/ru");
  for (const id of sections) await expect(page.locator(`#${id}`)).toHaveCount(1);
});

test("Tab walks the whole page without traps and every stop shows a focus ring", async ({ page }) => {
  await page.goto("/en");
  const stops: string[] = [];
  for (let i = 0; i < 300; i++) {
    await page.keyboard.press("Tab");
    const s = await page.evaluate(() => {
      const e = document.activeElement as HTMLElement | null;
      if (!e || e === document.body) return null;
      const cs = getComputedStyle(e);
      const ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none";
      return { key: e.outerHTML.slice(0, 60) + " «" + (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 40) + "»", ring, inFooter: !!e.closest("footer"), contact: !!e.closest("#contact") };
    });
    if (!s) break; // focus left the document: no trap
    expect(s.ring, `no visible focus on ${s.key}`).toBe(true);
    stops.push(s.key);
    if (stops.length > 3) expect(new Set(stops.slice(-3)).size, `focus stuck on ${s.key}`).toBeGreaterThan(1);
  }
  expect(stops.length).toBeGreaterThan(30);
  expect(stops.length).toBeLessThan(300);
});

test("mobile menu: opens as modal, lists 8 anchors, Esc returns focus, link jumps", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ru");
  const burger = page.getByRole("button", { name: "Открыть меню" });
  await burger.click();
  const dialog = page.locator("dialog#mobile-menu");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("ol a")).toHaveCount(8);
  await expect(page.getByRole("button", { name: "Закрыть меню" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(burger).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");

  await burger.click();
  await dialog.locator('a[href="/ru#contact"]').click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/ru#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
});

test("contacts: mailto, phone hidden until click, Telegram, GitHub in a new tab", async ({ page }) => {
  await page.goto("/en#contact");
  const contact = page.locator("#contact");
  await expect(contact.locator('a[href="mailto:sofiavipera@gmail.com"]')).toHaveCount(1);
  const tel = contact.locator('a[href="tel:+995571247510"]');
  await expect(tel).toHaveCount(0);
  await expect(contact).not.toContainText("571 247 510");
  await contact.getByRole("button", { name: "Call" }).click();
  await expect(tel).toBeFocused();
  await expect(tel).toContainText("+995 571 247 510");
  await expect(contact.locator('a[href="https://t.me/silestiari"]')).toHaveAttribute("target", "_blank");
  const gh = contact.locator('a[href="https://github.com/silestiari"]');
  await expect(gh).toHaveAttribute("target", "_blank");
  await expect(gh).toHaveAttribute("rel", /noopener/);
});

test("copy email: clipboard + toast; fallback selects the address", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/ru#contact");
  await page.locator("#contact").getByRole("button", { name: "Скопировать email" }).click();
  await expect(page.getByText("Email скопирован")).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("sofiavipera@gmail.com");

  const page2 = await context.newPage();
  await page2.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) } }),
  );
  await page2.goto("/en#contact");
  await page2.locator("#contact").getByRole("button", { name: "Copy email" }).click();
  await expect(page2.getByText("Couldn’t copy automatically", { exact: false })).toBeVisible();
  expect(await page2.evaluate(() => String(getSelection()))).toBe("sofiavipera@gmail.com");
});
