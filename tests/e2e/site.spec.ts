import { expect, test } from "@playwright/test";

test("marketing pages render the new brand and key routes", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "From source to speech, without the drift.",
  );
  await expect(page.getByRole("link", { name: "Open studio" }).first()).toBeVisible();

  await page.getByRole("link", { name: "Use cases" }).first().click();
  await expect(page).toHaveURL(/\/use-cases$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Grounded voice workflows");

  await page.goto("/blog");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("grounded audio");

  await page.goto("/this-route-does-not-exist");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "This page drifted off the timeline.",
  );
});
