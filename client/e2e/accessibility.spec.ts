import { test, Page } from "@playwright/test";
import analyzeAccessibility from "./accessibility";
import {
  latestConfig,
  status,
  foundBallotStatus,
  boardItemsPage1,
  boardItemsPage2,
  ballotLookup,
  ballotDecisionCast,
  ballotDecisionSpoil,
  submitVerifier,
} from "./mocks";

const BASE_PATH = "/en/organisation_slug/election_slug";

async function setupCommonMocks(
  page: Page,
  extraMocks?: (
    url: string,
  ) => { status: number; contentType: string; body: string } | null,
) {
  await page.route("**/*", async (route) => {
    const url = route.request().url();

    if (url.indexOf("board_slug/configuration/latest_config") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(latestConfig),
      });
    }

    if (url.indexOf("/status") > 0) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(status),
      });
    }

    if (extraMocks) {
      const extra = extraMocks(url);
      if (extra) return route.fulfill(extra);
    }

    return route.continue();
  });
}

test.describe("Welcome page", () => {
  test("initial render has no WCAG violations", async ({ page }) => {
    await setupCommonMocks(page);
    await page.goto(BASE_PATH);
    await analyzeAccessibility(page);
  });

  test("mobile hamburger menu open has no WCAG violations", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "Mobile-only test");
    await setupCommonMocks(page);
    await page.goto(BASE_PATH);
    await page.locator(".Header__Hamburger_Btn").click();
    await analyzeAccessibility(page);
  });
});

test.describe("Ballot Verification page", () => {
  test("initial render has no WCAG violations", async ({ page }) => {
    await setupCommonMocks(page);
    await page.goto(`${BASE_PATH}/find`);
    await analyzeAccessibility(page);
  });

  test("after submitting valid code has no WCAG violations", async ({
    page,
  }) => {
    await setupCommonMocks(page, (url) => {
      if (url.indexOf("board_slug/verification/vote_track") > 0) {
        return {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(ballotLookup),
        };
      }
      if (url.indexOf("board_slug/verification/spoil_status") > 0) {
        return {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(ballotDecisionSpoil),
        };
      }
      if (url.indexOf("board_slug/verification/verifiers") > 0) {
        return {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(submitVerifier),
        };
      }
      return null;
    });
    await page.goto(`${BASE_PATH}/find`);
    await page.locator("#unified-code").fill("5ksv8Ee");
    await page.getByRole("button", { name: "Find my ballot" }).click();
    await analyzeAccessibility(page);
  });

  test("invalid code error state has no WCAG violations", async ({ page }) => {
    await setupCommonMocks(page, (url) => {
      if (url.indexOf("board_slug/verification/vote_track") > 0) {
        return {
          status: 404,
          contentType: "application/json",
          body: "",
        };
      }
      return null;
    });
    await page.goto(`${BASE_PATH}/find`);
    await page.locator("#unified-code").fill("invalid-code");
    await page.getByRole("button", { name: "Find my ballot" }).click();
    await analyzeAccessibility(page);
  });
});

test.describe("Ballot Tracking page", () => {
  const setupTrackingMocks = (page: Page) =>
    setupCommonMocks(page, (url) => {
      if (url.indexOf("board_slug/verification/vote_track") > 0) {
        return {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(ballotLookup),
        };
      }
      if (url.indexOf("board_slug/verification/spoil_status") > 0) {
        return {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(ballotDecisionCast),
        };
      }
      if (url.indexOf("board_slug/ballot_status") > 0) {
        return {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(foundBallotStatus),
        };
      }
      return null;
    });

  test("initial render has no WCAG violations", async ({ page }) => {
    await setupTrackingMocks(page);
    await page.goto(`${BASE_PATH}/track/5ksv8Ee`);
    await analyzeAccessibility(page);
  });

  test("after expanding activity section has no WCAG violations", async ({
    page,
  }) => {
    await setupTrackingMocks(page);
    await page.goto(`${BASE_PATH}/track/5ksv8Ee`);
    await page.locator(".ExpandableSection__Expander").first().click();
    await analyzeAccessibility(page);
  });

  test("after canceling tracking has no WCAG violations", async ({ page }) => {
    await setupTrackingMocks(page);
    await page.goto(`${BASE_PATH}/track/5ksv8Ee`);
    await page.getByRole("button", { name: "Cancel tracking 5ksv8Ee" }).click();
    await analyzeAccessibility(page);
  });

  test("non-existing ballot error state has no WCAG violations", async ({
    page,
  }) => {
    await setupCommonMocks(page, (url) => {
      if (url.indexOf("board_slug/verification/vote_track") > 0) {
        return {
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({}),
        };
      }
      return null;
    });
    await page.goto(`${BASE_PATH}/track/abcdef`);
    await analyzeAccessibility(page);
  });
});

test.describe("Election Activity Logs page", () => {
  test("initial render has no WCAG violations", async ({ page, isMobile }) => {
    await setupCommonMocks(page, (url) => {
      if (url.indexOf("board_slug/board?page=1") > 0) {
        return {
          status: 200,
          contentType: "application/octet-stream",
          body: JSON.stringify(boardItemsPage1),
        };
      }
      return null;
    });
    await page.goto(BASE_PATH);
    if (isMobile) {
      await page.locator(".Header__Hamburger_Btn").click();
    }
    await page.getByRole("link", { name: "Election Activity Log" }).click();
    await analyzeAccessibility(page);
  });

  test("with expanded board items has no WCAG violations", async ({
    page,
    isMobile,
  }) => {
    await setupCommonMocks(page, (url) => {
      if (url.indexOf("board_slug/board?page=1") > 0) {
        return {
          status: 200,
          contentType: "application/octet-stream",
          body: JSON.stringify(boardItemsPage1),
        };
      }
      return null;
    });
    await page.goto(BASE_PATH);
    if (isMobile) {
      await page.locator(".Header__Hamburger_Btn").click();
    }
    await page.getByRole("link", { name: "Election Activity Log" }).click();
    await page.getByText("Rejected affidavit").click();
    await page.getByText("Accepted affidavit").click();
    await analyzeAccessibility(page);
  });

  test("after paginating to page 2 has no WCAG violations", async ({
    page,
    isMobile,
  }) => {
    await setupCommonMocks(page, (url) => {
      if (url.indexOf("board_slug/board?page=1") > 0) {
        return {
          status: 200,
          contentType: "application/octet-stream",
          body: JSON.stringify(boardItemsPage1),
        };
      }
      if (url.indexOf("board_slug/board?page=2") > 0) {
        return {
          status: 200,
          contentType: "application/octet-stream",
          body: JSON.stringify(boardItemsPage2),
        };
      }
      return null;
    });
    await page.goto(BASE_PATH);
    if (isMobile) {
      await page.locator(".Header__Hamburger_Btn").click();
    }
    await page.getByRole("link", { name: "Election Activity Log" }).click();
    await page.getByRole("button", { name: "Next page" }).click();
    await analyzeAccessibility(page);
  });
});

test.describe("Help page", () => {
  test("initial render has no WCAG violations", async ({ page, isMobile }) => {
    await setupCommonMocks(page);
    await page.goto(BASE_PATH);
    if (isMobile) {
      await page.locator(".Header__Hamburger_Btn").click();
    }
    await page.getByRole("link", { name: "FAQ" }).click();
    await analyzeAccessibility(page);
  });
});

test.describe("Locale switching", () => {
  test("after switching locale has no WCAG violations", async ({
    page,
    isMobile,
  }) => {
    await setupCommonMocks(page);
    await page.goto(BASE_PATH);
    if (isMobile) {
      await page.locator(".Header__Hamburger_Btn").click();
    }
    await page.locator(".Header__Locales select").selectOption("es");
    await analyzeAccessibility(page);
  });
});
