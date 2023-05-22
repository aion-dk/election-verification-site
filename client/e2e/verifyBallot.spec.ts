import { test, expect } from "@playwright/test";
import { latestConfig, translations, status } from "./mocks";

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

  await page.goto("/en/us3/verification");
  await expect(page.locator("h3")).toHaveText("Ballot Tester");
  await page.getByPlaceholder("Testing code").fill("5ksv8Ee");
  await page.getByRole("button", { name: "Start the Test" }).click();
});

test("verifying with an invalid verification code", async ({ page }) => {
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

    // Intercept DBB verification lookup call
    if (url.indexOf("us3/verification/vote_track") > 0) {
      return route.fulfill({
        status: 404,
        contentType: "application/json",
        body: "",
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

  await page.goto("/en/us3/verification");
  await expect(page.locator("h3")).toHaveText("Ballot Tester");
  await page.getByPlaceholder("Testing code").fill("invalid-code");
  await page.getByRole("button", { name: "Start the Test" }).click();
  await expect(page.locator(".Error__Title")).toContainText(
    "Invalid verification code"
  );
  await page.getByPlaceholder("Testing code").fill("invalid-code");
});
