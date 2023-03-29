import { test, expect } from "@playwright/test";
import { latestConfig } from "./mocks.ts";

test("verifying a ballot", async ({ page }) => {
  // Mock Network calls
  await page.route("**/*", async (route) => {
    const url = route.request().url();

    // Intercept DBB latest config calls
    if (url.indexOf("us3/configuration/latest_config") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(latestConfig),
      });
    }

    return route.continue();
  });

  await page.goto("/en/us3");
  await expect(page.locator("h1")).toHaveText("Funny Election");
  await page.getByPlaceholder("Verification code").fill("5ksv8Ee");
  await page.getByRole("button", { name: "Verify my ballot" }).click();
});
