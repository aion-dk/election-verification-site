import { test, expect } from "@playwright/test";
import {
  latestConfig,
  foundBallotStatus,
  ballotLookup,
  status,
  ballotDecisionCast,
  ballotDecisionSpoil,
  submitVerifier,
} from "./mocks";
import analyzeAccesibility from "./accessibility";

test("finding a ballot that is pending", async ({ page }) => {
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

    // Intercept DBB vote track calls
    if (url.indexOf("board_slug/verification/vote_track") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(ballotLookup),
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

  await page.goto("/en/organisation_slug/election_slug/find");
  await analyzeAccesibility(page);
  await expect(page.locator("h1.UnifiedLanding__Title")).toHaveText(
    "Find your ballot",
  );
  await page.locator("#unified-code").fill("5ksv8Ee");
  await page.getByRole("button", { name: "Find my ballot" }).click();
  await analyzeAccesibility(page);
  await expect(page.locator("#verifier-found-title")).toHaveText(
    "Your ballot has been found!",
  );
  await page.getByRole("button", { name: "Cancel tracking 5ksv8Ee" }).click();
  await analyzeAccesibility(page);
  await page.locator("#unified-code").fill("5ksv8Ee");
});

test("finding a non-existing ballot shows an error", async ({ page }) => {
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

    // Intercept DBB vote track calls
    if (url.indexOf("board_slug/verification/vote_track") > 0) {
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

  await page.goto("/en/organisation_slug/election_slug/find");
  await analyzeAccesibility(page);
  await expect(page.locator("h1.UnifiedLanding__Title")).toHaveText(
    "Find your ballot",
  );
  await page.locator("#unified-code").fill("abcdef");
  await page.getByRole("button", { name: "Find my ballot" }).click();
  await analyzeAccesibility(page);
  await expect(page.locator(".Error__Title")).toContainText(
    "Ballot code not found",
  );
  await page.locator("#unified-code").fill("5ksv8Ee");
});

test("finding a ballot that has been cast", async ({ page }) => {
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

    // Intercept DBB vote track calls
    if (url.indexOf("board_slug/verification/vote_track") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(ballotLookup),
      });
    }

    // Intercept DBB spoil status calls
    if (url.indexOf("board_slug/verification/spoil_status") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(ballotDecisionCast),
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

  await page.goto("/en/organisation_slug/election_slug/find");
  await analyzeAccesibility(page);
  await expect(page.locator("h1.UnifiedLanding__Title")).toHaveText(
    "Find your ballot",
  );
  await page.locator("#unified-code").fill("5ksv8Ee");
  await page.getByRole("button", { name: "Find my ballot" }).click();
  await analyzeAccesibility(page);
  await expect(page.locator("#tracker-title")).toHaveText("Ballot Registered");
  await page.getByRole("button", { name: "Cancel tracking 5ksv8Ee" }).click();
  await analyzeAccesibility(page);
  await page.locator("#unified-code").fill("5ksv8Ee");
});

test("finding a ballot that has been spoiled", async ({ page }) => {
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

    // Intercept DBB vote track calls
    if (url.indexOf("board_slug/verification/vote_track") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(ballotLookup),
      });
    }

    // Intercept DBB spoil status calls
    if (url.indexOf("board_slug/verification/spoil_status") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(ballotDecisionSpoil),
      });
    }

    // Intercept DBB verifier calls
    if (url.indexOf("board_slug/verification/verifiers") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(submitVerifier),
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

  await page.goto("/en/organisation_slug/election_slug/find");
  await analyzeAccesibility(page);
  await expect(page.locator("h1.UnifiedLanding__Title")).toHaveText(
    "Find your ballot",
  );
  await page.locator("#unified-code").fill("5ksv8Ee");
  await page.getByRole("button", { name: "Find my ballot" }).click();
  await analyzeAccesibility(page);
  await expect(page.locator("#verifier-inprogress-title")).toHaveText(
    "Compare passkeys",
  );
});
