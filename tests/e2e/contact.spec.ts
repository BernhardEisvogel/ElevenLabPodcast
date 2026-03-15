import { expect, test } from "@playwright/test";

test("contact form submits through Formspree endpoint", async ({ page }) => {
  await page.route("https://formspree.io/f/xjgaewza", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/contact");
  await page.getByLabel("Name").fill("Rahul");
  await page.getByLabel("Email").fill("rahul@example.com");
  await page.getByLabel("Company").fill("Sourcewave Test");
  await page.getByLabel("Use case").fill("Voice agent onboarding");
  await page.getByLabel("Message").fill("We want grounded audio workflows for support demos.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Thanks. Your message has been sent.")).toBeVisible();
});
