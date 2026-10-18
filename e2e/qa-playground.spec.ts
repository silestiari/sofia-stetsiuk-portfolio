import { expect, test } from "@playwright/test";

test("QA Playground: find BUG-001 and BUG-002 and open their reports", async ({ page }) => {
  await page.goto("/en#qa-playground");
  const section = page.locator("#qa-playground");
  const panel = section.getByRole("tabpanel");
  const counter = section.getByTestId("qa-found-counter");
  await expect(counter).toHaveText("Found 0 / 5");

  // Not found yet → soft message, no report
  await panel.getByRole("button", { name: "Report a Bug" }).click();
  await expect(panel.getByText("Not yet — keep looking.")).toBeVisible();

  // BUG-001: double click on "Place order" creates two orders
  const place = panel.getByRole("button", { name: "Place order" });
  await place.click();
  await place.click();
  await expect(section.locator('[data-qa-target="orders-list"] li')).toHaveCount(2);
  await expect(counter).toHaveText("Found 1 / 5");
  await panel.getByRole("button", { name: "Report a Bug" }).click();
  const report1 = section.getByTestId("report-BUG-001");
  await expect(report1.getByRole("button", { name: "Collapse report" })).toHaveAttribute("aria-expanded", "true");
  await expect(report1.getByText("Two identical orders (#1, #2) are created", { exact: false })).toBeVisible();

  // BUG-002: promo code applied twice
  await section.getByRole("tab", { name: "Cart" }).click();
  await panel.getByLabel("Promo code").fill(" loot10 ");
  await panel.getByRole("button", { name: "Apply" }).click();
  await expect(section.locator('[data-qa-target="cart-total"]')).toHaveText("972 gems");
  await expect(counter).toHaveText("Found 2 / 5");
  await panel.getByRole("button", { name: "Report a Bug" }).click();
  const report2 = section.getByTestId("report-BUG-002");
  await expect(report2.getByText("S2 Major")).toBeVisible();
  await expect(report2.getByText("Discount: −120 gems (10%). Total: 1080 gems.")).toBeVisible();

  // Reset returns everything to setup
  await section.getByRole("button", { name: "Reset" }).click();
  await expect(counter).toHaveText("Found 0 / 5");
});
