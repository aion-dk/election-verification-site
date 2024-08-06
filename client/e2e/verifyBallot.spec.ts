import { test, expect } from "@playwright/test";
import { latestConfig, status } from "./mocks";

test("verifying a ballot", async ({ page }) => {
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

  await page.goto("/en/organisation_slug/election_slug/verify");
  await expect(page.locator("h3")).toHaveText("Ballot Tester");
  await page.getByPlaceholder("Testing code").fill("5ksv8Ee");
  await page.getByRole("button", { name: "Start the Test" }).click();
});

test("verifying with an invalid verification code", async ({ page }) => {
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

    // Intercept DBB verification lookup call
    if (
      url.indexOf("organisation_slug/election_slug/verification/vote_track") > 0
    ) {
      return route.fulfill({
        status: 404,
        contentType: "application/json",
        body: "",
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

  await page.goto("/en/organisation_slug/election_slug/verify");
  await expect(page.locator("h3")).toHaveText("Ballot Tester");
  await page.locator("#verification-code").fill("invalid-code");
  await page.getByRole("button", { name: "Start the Test" }).click();
  await expect(page.locator(".Error__Title")).toContainText(
    "Testing code not found"
  );
  await page.locator("#verification-code").fill("invalid-code");
});
