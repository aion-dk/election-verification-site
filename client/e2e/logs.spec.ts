import { test } from "@playwright/test";
import {
  latestConfig,
  boardItemsPage1,
  boardItemsPage2,
  status,
} from "./mocks";

test("downloading logs", async ({ page, isMobile }) => {
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

    // Intercept download request
    if (url.indexOf("board_slug/download_log") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/octet-stream",
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

  await page.goto("/en/organisation_slug/election_slug");
  if (isMobile) {
    await page.locator(".Header__Hamburger_Btn").click();
  }
  await page.getByRole("link", { name: "Election Activity Log" }).click();

  if (!isMobile) {
    // The waitForEvent("download") method does not work in safari mobile so I'll skip it for now in mobile.
    const downloadPromise = page.waitForEvent("download");
    await page
      .getByRole("button", {
        name: "Download the full election activity log (json)",
      })
      .click();
    await downloadPromise;
  }
});

test("traversing board items", async ({ page, isMobile }) => {
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

    // Intercept page 1 of the board
    if (url.indexOf("board_slug/board?page=1") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/octet-stream",
        body: JSON.stringify(boardItemsPage1),
      });
    }

    // Intercept page 2 of the board
    if (url.indexOf("board_slug/board?page=2") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/octet-stream",
        body: JSON.stringify(boardItemsPage2),
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
  if (isMobile) {
    await page.locator(".Header__Hamburger_Btn").click();
  }
  await page.getByRole("link", { name: "Election Activity Log" }).click();

  // Page 1
  await page.getByText("Rejected affidavit").click();
  await page.getByText("Accepted affidavit").click();

  // Page 2
  await page.getByRole("button", { name: "Next page" }).click();
  await page.getByText("Voter session").click();
  await page.getByText("Ballot cast").click();

  // Page 1 again
  await page.getByRole("button", { name: "Previous page" }).click();
  await page.getByText("Rejected affidavit").click();
  await page.getByText("Accepted affidavit").click();

  // Configuration only
  await page.getByText("Configuration items only").click();
});
