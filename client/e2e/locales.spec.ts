import { test } from "@playwright/test";
import { latestConfig } from "./mocks.ts";

test("changing locale", async ({ page }) => {
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
  await page.getByText("Española").click();
  await page.getByRole("menuitem", { name: "Información" }).click();
  await page.getByText("English").click();
  await page.getByRole("menuitem", { name: "About" }).click();
});
