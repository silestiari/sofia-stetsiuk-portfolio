import { expect, test } from "@playwright/test";

test("AI Workflow Lab: select a step and a role with the keyboard", async ({ page }) => {
  await page.goto("/en#ai-lab");
  const section = page.locator("#ai-lab");
  const details = section.getByTestId("ai-lab-details");
  await expect(details.getByRole("heading", { level: 3 })).toHaveText("Idea");

  await section.getByTestId("ai-node-idea").focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const agentsNode = section.getByTestId("ai-node-ai-agents");
  await expect(agentsNode).toBeFocused();
  await expect(agentsNode).toHaveAttribute("aria-pressed", "true");
  await expect(details.getByRole("heading", { level: 3 })).toHaveText("AI Agents");
  await expect(details.getByRole("link", { name: "Cabin Chaos" })).toHaveAttribute("href", "/en/projects/cabin-chaos");

  await page.keyboard.press("End");
  await expect(details.getByRole("heading", { level: 3 })).toHaveText("Release");
  await page.keyboard.press("Enter");
  await expect(section.getByTestId("ai-node-release")).toHaveAttribute("aria-pressed", "true");

  // Roles: tablist with arrow keys
  const sofia = details.getByRole("tab", { name: "Sofia" });
  await sofia.focus();
  await page.keyboard.press("ArrowRight");
  const agents = details.getByRole("tab", { name: "Agents" });
  await expect(agents).toBeFocused();
  await expect(agents).toHaveAttribute("aria-selected", "true");
  await expect(details.getByRole("tabpanel")).toContainText("Release and integration agents");
});
