import { test } from "@playwright/test";
import { latestConfig, status } from "./mocks";
import analyzeAccesibility from "./accessibility";

test("changing locale", async ({ page, isMobile }) => {
  // Mock Network calls
  await page.route("**/*", async (route) => {
    const url = route.request().url();

    // Intercept DBB latest config calls
    if (url.indexOf("board_slug/configuration/latest_config") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(latestConfig),
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

  await page.goto("/en/organisation_slug/election_slug");

  await analyzeAccesibility(page);

  if (isMobile) {
    await page.locator(".Header__Hamburger_Btn").click();
    await analyzeAccesibility(page);
  }
  await page.locator(".Header__Locales").selectOption("es");
  await analyzeAccesibility(page);
  await page.getByRole("link", { name: "Testeo de Boleta" }).click();
  if (isMobile) {
    await page.locator(".Header__Hamburger_Btn").click();
  }
  await page.locator(".Header__Locales").selectOption("en");
  await page.getByRole("link", { name: "Ballot Tester" }).click();
});
