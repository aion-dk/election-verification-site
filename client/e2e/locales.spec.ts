import { test } from "@playwright/test";
import { latestConfig, translations, status } from "./mocks";

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

    // Intercept Translation calls
    if (url.indexOf("/translations") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(translations),
      });
    }

    // Intercept Status calls
    if (url.indexOf("/status") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(status),
      });
    }

    return route.continue();
  });

  await page.goto("/en/us3");
  await page.locator(".Header__Locales").selectOption("es");
  await page.getByRole("menuitem", { name: "Información" }).click();
  await page.locator(".Header__Locales").selectOption("en");
  await page.getByRole("menuitem", { name: "About" }).click();
});
