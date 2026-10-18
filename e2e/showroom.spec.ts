import { expect, test } from "@playwright/test";

test("showroom: a card opens the model dialog, Esc closes it and focus returns", async ({ page }) => {
  await page.goto("/en");
  const showroom = page.locator("#showroom");
  await showroom.scrollIntoViewIfNeeded();
  await expect(showroom.getByText("Click any model to look at it closer in 3D")).toBeVisible();

  const card = showroom.getByRole("button", { name: "Bubble Lagoon Sea Dragon — open in 3D" });
  await card.click();
  const dialog = page.getByRole("dialog", { name: "Bubble Lagoon Sea Dragon" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Open the Build Your Own Pet case/ })).toHaveAttribute("href", "/en/projects/build-your-pet");
  await expect(dialog.getByRole("link", { name: /Open in Roblox Creator Store/ })).toHaveAttribute("href", /create\.roblox\.com\/store\/asset\/\d+/);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(card).toBeFocused();
});

test("showroom: category filter narrows the showcase", async ({ page }) => {
  await page.goto("/en");
  const showroom = page.locator("#showroom");
  const cards = showroom.getByRole("list", { name: "Models" }).getByRole("button");
  await expect(cards).toHaveCount(33);
  await showroom.getByRole("radiogroup", { name: "Category" }).getByRole("radio", { name: "Trees" }).click();
  await expect(cards).toHaveCount(16);
  await expect(showroom.getByRole("button", { name: /Bush|Leaders|Portal/ })).toHaveCount(0);
});

test("showroom: without WebGL the dialog shows the poster, no 3D controls", async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error simulate a browser without WebGL2
    delete window.WebGL2RenderingContext;
  });
  await page.goto("/ru");
  const showroom = page.locator("#showroom");
  await showroom.scrollIntoViewIfNeeded();
  await showroom.getByRole("button", { name: "Кристальное дерево, большое — открыть в 3D" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("img", { name: /Кристальное дерево, большое — статичное превью/ })).toHaveAttribute("src", "/posters/tree-crystal-l.webp");
  await expect(dialog.locator("canvas")).toHaveCount(0);
  await expect(dialog.getByRole("button", { name: "Повернуть влево" })).toHaveCount(0);
});
