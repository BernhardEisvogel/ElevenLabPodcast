import { expect, test } from "@playwright/test";

test("marketing pages render the new brand and key routes", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Turn any page into a grounded podcast briefing.",
  );
  await expect(page.getByRole("link", { name: "Open studio" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Chrome extension" }).first()).toBeVisible();
  await expect(page.getByRole("banner").getByRole("link", { name: "How it works" })).toBeVisible();
  await expect(page.getByRole("banner").getByRole("link", { name: "Contact" })).toBeVisible();

  await page.getByRole("link", { name: "Chrome extension" }).first().click();
  await expect(page).toHaveURL(/\/chrome-extension$/);
  await expect(page.getByTestId("extension-page-heading")).toContainText(
    "Capture the page you are already reading",
  );

  await page.getByRole("contentinfo").getByRole("link", { name: "Use cases" }).click();
  await expect(page).toHaveURL(/\/use-cases$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Grounded voice workflows");

  await page.getByRole("contentinfo").getByRole("link", { name: "Blog" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("grounded audio");

  await page.goto("/this-route-does-not-exist");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "This page drifted off the timeline.",
  );
});
