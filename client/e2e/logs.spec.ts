import { test } from "@playwright/test";
import {
  latestConfig,
  boardItemsPage1,
  boardItemsPage2,
  translations,
  status,
} from "./mocks";

test("downloading logs", async ({ page }) => {
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

    // Intercept download request
    if (url.indexOf("us3/download_log") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/octet-stream",
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
  await page.getByRole("menuitem", { name: "Election Activity Log" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("link", {
      name: "Download the full election activity log (json)",
    })
    .click();
  await downloadPromise;
});

test("traversing board items", async ({ page }) => {
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

    // Intercept page 1 of the board
    if (url.indexOf("us3/board?page=1") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/octet-stream",
        body: JSON.stringify(boardItemsPage1),
      });
    }

    // Intercept page 2 of the board
    if (url.indexOf("us3/board?page=2") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/octet-stream",
        body: JSON.stringify(boardItemsPage2),
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
  await page.getByRole("menuitem", { name: "Election Activity Log" }).click();

  // Page 1
  await page.getByText("16fSovo").click();
  await page.getByText("VMMHYWv").click();

  // Page 2
  await page.getByRole("link", { name: "Next page" }).click();
  await page.getByText("1yo3CEM").click();
  await page.getByText("12g69GA").click();

  // Page 1 again
  await page.getByRole("link", { name: "Previous page" }).click();
  await page.getByText("16fSovo").click();
  await page.getByText("VMMHYWv").click();

  // Configuration only
  await page.getByText("Configuration items only?").click();
});
