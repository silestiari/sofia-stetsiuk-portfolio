import { expect, test } from "@playwright/test";

test("showroom: project → model selection updates caption, list and live region", async ({ page }) => {
  await page.goto("/en");
  const showroom = page.locator("#showroom");
  await showroom.scrollIntoViewIfNeeded();

  await showroom.getByRole("radiogroup", { name: "Project" }).getByRole("radio", { name: "Cabin Chaos" }).click();
  const models = showroom.getByRole("radiogroup", { name: "Models" });
  await expect(models.getByRole("radio", { name: /Robot Passenger/ })).toHaveAttribute("aria-checked", "true");
  await expect(showroom.getByRole("heading", { level: 3 })).toHaveText("Robot Passenger");

  // keyboard: arrows move within the radiogroup (roving tabindex)
  await models.getByRole("radio", { name: /Robot Passenger/ }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(models.getByRole("radio", { name: /Sleepy Monster/ })).toHaveAttribute("aria-checked", "true");
  await expect(showroom.locator("[aria-live]")).toHaveText("Sleepy Monster from Cabin Chaos");
  await expect(showroom.getByRole("link", { name: "Open the Cabin Chaos case" })).toHaveAttribute("href", "/en/projects/cabin-chaos");
});

test("showroom: without WebGL shows posters, keeps the pickers, hides 3D controls", async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error simulate a browser without WebGL2
    delete window.WebGL2RenderingContext;
  });
  await page.goto("/ru");
  const showroom = page.locator("#showroom");
  await showroom.scrollIntoViewIfNeeded();

  await expect(showroom.getByText("В этом браузере 3D недоступно", { exact: false })).toBeVisible();
  await expect(showroom.locator("canvas")).toHaveCount(0);
  await expect(showroom.getByRole("button", { name: "Повернуть влево" })).toHaveCount(0);
  await expect(showroom.getByRole("radiogroup", { name: "Проход рендера" })).toHaveCount(0);

  await showroom.getByRole("radio", { name: "Лесоруб против зомби" }).click();
  await expect(showroom.getByRole("img", { name: /Дракон — статичное превью/ })).toHaveAttribute("src", "/posters/dragon.webp");
});
