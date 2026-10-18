import { expect, test } from "@playwright/test";

const slugs = ["grand-mall-batumi", "sakhli", "sotka", "woodcutter-vs-zombies", "cabin-chaos", "pillars", "build-your-pet", "valorant-content-factory"];
const locales = ["en", "ru"] as const;

test.describe("case pages", () => {
  for (const locale of locales)
    for (const slug of slugs)
      test(`/${locale}/projects/${slug} renders with SEO tags`, async ({ page }) => {
        const res = await page.goto(`/${locale}/projects/${slug}`);
        expect(res?.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page).toHaveTitle(/.+/);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/${locale}/projects/${slug}$`));
        for (const l of [...locales, "x-default"])
          await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveCount(1);
        await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

        // prev/next stay inside the same locale and point to existing cases
        const hrefs = await page.locator("a[rel=prev], a[rel=next]").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
        expect(hrefs).toHaveLength(2);
        for (const h of hrefs) expect(h).toMatch(new RegExp(`^/${locale}/projects/(${slugs.join("|")})$`));
      });

  test("unknown slug returns 404 in both locales", async ({ page }) => {
    for (const locale of locales) {
      const res = await page.goto(`/${locale}/projects/does-not-exist`);
      expect(res?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("link", { name: locale === "en" ? "Back to home" : "На главную" })).toBeVisible();
    }
  });
});

test.describe("home SEO", () => {
  for (const locale of locales)
    test(`/${locale} has title, description, OG, canonical, hreflang`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/${locale}$`));
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
    });

  test("sitemap lists all pages of both locales, robots points to it", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const l of locales) {
      expect(sitemap).toContain(`/${l}</loc>`);
      for (const s of slugs) expect(sitemap).toContain(`/${l}/projects/${s}</loc>`);
    }
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Sitemap: .+\/sitemap\.xml/);
  });
});

test.describe("internal links", () => {
  test("every internal link on home and cases answers 200", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const path of ["/en", "/ru", "/en/projects/cabin-chaos", "/ru/projects/grand-mall-batumi"]) {
      await page.goto(path);
      const hrefs = await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")!.split("#")[0]));
      hrefs.forEach((h) => seen.add(h));
    }
    for (const h of seen) expect((await request.get(h)).status(), h).toBe(200);
  });
});
