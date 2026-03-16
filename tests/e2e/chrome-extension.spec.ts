import { expect, test } from "@playwright/test";

test("chrome extension page shows install flow and downloadable archive", async ({
  page,
  request,
}) => {
  await page.goto("/chrome-extension");

  await expect(page.getByTestId("extension-page-heading")).toContainText(
    "Capture the page you are already reading",
  );
  await expect(page.getByTestId("extension-install-cta")).toBeVisible();
  await expect(page.getByTestId("extension-install-steps")).toContainText(
    "Open chrome://extensions in Chrome.",
  );

  const downloadLink = page.getByTestId("extension-download-link");
  await expect(downloadLink).toHaveAttribute("href", "/downloads/sourcewave-chrome-extension.zip");

  const downloadResponse = await request.get("/downloads/sourcewave-chrome-extension.zip");
  expect(downloadResponse.ok()).toBeTruthy();
});

test("studio prefills source and shows extension entry state from query params", async ({ page }) => {
  await page.goto(
    "/studio?source=https%3A%2F%2Fexample.com%2Fpricing&intent=Summarize%20the%20pricing%20model&origin=extension",
  );

  await expect(page.getByTestId("extension-entry-banner")).toContainText("Sourcewave extension");
  await expect(page.getByTestId("source-input")).toHaveValue("https://example.com/pricing");
  await expect(page.getByTestId("intent-input")).toHaveValue("Summarize the pricing model");
});
