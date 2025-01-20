import { test, expect } from "@playwright/test";
import { latestConfig, foundBallotStatus, status } from "./mocks";

test("tracking a ballot", async ({ page }) => {
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

    // Intercept DBB ballot status calls
    if (url.indexOf("board_slug/ballot_status") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(foundBallotStatus),
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

  await page.goto("/en/organisation_slug/election_slug/track");
  await expect(page.locator("h3")).toHaveText("Ballot Tracker");
  await page.locator("#tracking-code").fill("5ksv8Ee");
  await page.getByRole("button", { name: "Track my ballot" }).click();
  await page.locator(".ExpandableSection__Expander").first().click();
  await page.getByRole("button", { name: "Cancel tracking 5ksv8Ee" }).click();
  await page.locator("#tracking-code").fill("5ksv8Ee");
});

test("tracking a non-existing ballot shows an error", async ({ page }) => {
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

    // Intercept DBB ballot status calls
    if (url.indexOf("board_slug/ballot_status") > 0) {
      return route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({}),
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

  await page.goto("/en/organisation_slug/election_slug/track");
  await expect(page.locator("h3")).toHaveText("Ballot Tracker");
  await page.locator("#tracking-code").fill("abcdef");
  await page.getByRole("button", { name: "Track my ballot" }).click();
  await expect(page.locator(".Error__Title")).toContainText(
    "Tracking code not found",
  );
  await page.locator("#tracking-code").fill("hijklm");
});
