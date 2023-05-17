import { test, expect } from "@playwright/test";
import {
  latestConfig,
  foundBallotStatus,
  rejectedBallotStatus,
  translations,
  status,
} from "./mocks";

test("tracking a ballot", async ({ page }) => {
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

    // Intercept DBB ballot status calls
    if (url.indexOf("us3/ballot_status") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(foundBallotStatus),
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
  await expect(page.locator("h1")).toHaveText("Ballot Verification Site");
  await page.getByPlaceholder("Tracking code").fill("5ksv8Ee");
  await page.getByRole("button", { name: "Track my ballot" }).click();
  await page.locator(".ExpandableSection__Expander").first().click();
  await page.getByRole("button", { name: "Cancel tracking 5ksv8Ee" }).click();
  await page.getByPlaceholder("Tracking code").fill("5ksv8Ee");
});

test("tracking a non-existing ballot shows an error", async ({ page }) => {
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

    // Intercept DBB ballot status calls
    if (url.indexOf("us3/ballot_status") > 0) {
      return route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({}),
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
  await expect(page.locator("h1")).toHaveText("Ballot Verification Site");
  await page.getByPlaceholder("Tracking code").fill("abcdef");
  await page.getByRole("button", { name: "Track my ballot" }).click();
  await expect(page.locator(".Error__Title")).toContainText(
    "Invalid tracking code"
  );
  await page.getByPlaceholder("Tracking code").fill("hijklm");
});

test("tracking a rejected ballot has the right text", async ({ page }) => {
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

    // Intercept DBB ballot status calls
    if (url.indexOf("us3/ballot_status") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(rejectedBallotStatus),
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
  await expect(page.locator("h1")).toHaveText("Ballot Verification Site");
  await page.getByPlaceholder("Tracking code").fill("5ksv8Ee");
  await page.getByRole("button", { name: "Track my ballot" }).click();

  // For some reason this allow the firefox to not break
  // Seems like it needs just a millisecond more to load the proper data on the page
  await page.locator(".BallotTracker__StatusInfo h3");

  await expect(page.locator(".BallotTracker__StatusInfo h3")).toHaveText(
    "Ballot not accepted"
  );
  await expect(page.locator(".BallotTracker__StatusInfo p")).toHaveText(
    "There is a problem with your signature affidavit. Contact your local election official for next steps and to cure your affidavit."
  );
  await expect(page.locator(".BallotTracker__StatusInfo p")).toHaveText(
    "There is a problem with your signature affidavit. Contact your local election official for next steps and to cure your affidavit."
  );
  await expect(page.locator(".BallotActivity__Type").first()).toHaveText(
    "Affidavit Rejected"
  );
});
