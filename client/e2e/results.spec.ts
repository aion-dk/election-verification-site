import { test, expect } from "@playwright/test";
import analyzeAccessibility from "./accessibility";
import { latestConfig, status } from "./mocks";

const translations = {
  translations: {
    en: {
      js: {
        election_verification_site: {},
        components: {},
        accessibility: {},
      },
    },
    es: {
      js: {
        election_verification_site: {},
        components: {},
        accessibility: {},
      },
    },
  },
};

const publishedResults = [
  {
    votingRoundName: "Round A",
    votingRoundClosingDate: "2025-01-10T00:00:00.000Z",
    publishedAt: "2025-01-15T10:00:00.000Z",
    pdf: btoa("%PDF-1.4 fake content A"),
  },
  {
    votingRoundName: "Round B",
    votingRoundClosingDate: "2025-03-15T00:00:00.000Z",
    publishedAt: "2025-03-20T10:00:00.000Z",
    pdf: btoa("%PDF-1.4 fake content B"),
  },
];

function setupRoutes(
  page: import("@playwright/test").Page,
  options: {
    resultsPublished: boolean;
    publishedResults?: typeof publishedResults;
  },
) {
  return page.route("**/*", async (route) => {
    const url = route.request().url();
    const isConference = url.includes("electa.localhost");
    const isDBB = url.includes("dbb.localhost");

    if (isDBB && url.includes("latest_config")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(latestConfig),
      });
    }

    if (isConference && url.includes("/status")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(status),
      });
    }

    if (isConference && url.includes("/results_published")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ resultsPublished: options.resultsPublished }),
      });
    }

    if (
      isConference &&
      url.includes("/published_results") &&
      options.publishedResults
    ) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(options.publishedResults),
      });
    }

    if (isConference && url.includes("/translations")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(translations),
      });
    }

    if (isConference && url.includes("/theme")) {
      return route.fulfill({
        status: 200,
        contentType: "text/css",
        body: "",
      });
    }

    return route.continue();
  });
}

test("viewing published results", async ({ page, isMobile }) => {
  await setupRoutes(page, {
    resultsPublished: true,
    publishedResults,
  });

  await page.goto("/en/organisation_slug/election_slug");
  if (isMobile) {
    await page.locator(".Header__Hamburger_Btn").click();
  }
  await page.getByRole("link", { name: "Results" }).waitFor();
  await analyzeAccessibility(page);
  if (isMobile) {
    await analyzeAccessibility(page);
  }

  const resultsLink = page.getByRole("link", { name: "Results" });
  await expect(resultsLink).toBeVisible();
  await resultsLink.click();
  await analyzeAccessibility(page);

  await expect(page.locator('[data-testid="result-card-title"]')).toHaveCount(
    2,
  );
  await expect(
    page.locator('[data-testid="result-card-title"]').first(),
  ).toHaveText("Round A");
  await expect(
    page.locator('[data-testid="result-card-title"]').nth(1),
  ).toHaveText("Round B");

  await expect(
    page.locator('[data-testid="result-card-pdf-object"]'),
  ).toHaveCount(2);
  await expect(
    page.locator('[data-testid="result-card-download"]'),
  ).toHaveCount(2);
});

test("results menu hidden when no results published", async ({ page }) => {
  await setupRoutes(page, { resultsPublished: false });

  await page.goto("/en/organisation_slug/election_slug");

  await expect(page.getByRole("link", { name: "Results" })).not.toBeVisible();
});
