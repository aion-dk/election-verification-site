import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import type { Component } from "vue";

const axiosGetMock = vi.hoisted(() => vi.fn());

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();
  return {
    ...actual,
    default: { ...actual.default, get: axiosGetMock },
  };
});

const stubView = (name: string) => ({
  default: { name, template: `<div>${name}</div>` },
});

vi.mock("../views/Welcome.vue", () => stubView("WelcomeStub"));
vi.mock("../views/BallotTrackerView.vue", () =>
  stubView("BallotTrackerViewStub"),
);
vi.mock("../views/BallotVerifierView.vue", () =>
  stubView("BallotVerifierViewStub"),
);
vi.mock("../views/BallotVerifierFoundView.vue", () =>
  stubView("BallotVerifierFoundViewStub"),
);
vi.mock("../views/MissingSlugView.vue", () => stubView("MissingSlugViewStub"));
vi.mock("../views/LogsView.vue", () => stubView("LogsViewStub"));
vi.mock("../views/HelpView.vue", () => stubView("HelpViewStub"));
vi.mock("../views/ResultsView.vue", () => stubView("ResultsViewStub"));
vi.mock("../views/BallotUnifiedTracking.vue", () =>
  stubView("BallotUnifiedTrackingStub"),
);
vi.mock("../views/ReceiptErrorView.vue", () =>
  stubView("ReceiptErrorViewStub"),
);

const router = (await import("./index")).default;
const useConfigStore = (await import("@/stores/useConfigStore")).default;

const CONFERENCE_URL = "http://electa.localhost:3016";

function currentComponentName() {
  const matched = router.currentRoute.value.matched;
  const component = matched[matched.length - 1].components
    .default as Component & { name: string };
  return component.name;
}

let slugCounter = 0;
// Each test navigates to a unique election so navigations are never
// considered duplicated by the (singleton) router.
function uniqueElection() {
  slugCounter += 1;
  return `election_${slugCounter}`;
}

describe("router", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    // Leave any guarded route so per-route `beforeEnter` guards run again.
    await router.push("/reset");
    setActivePinia(createPinia());
    axiosGetMock.mockReset();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("route table", () => {
    it("redirects the root path to the English locale", async () => {
      await router.push("/");

      expect(router.currentRoute.value.fullPath).toBe("/en");
      expect(currentComponentName()).toBe("MissingSlugViewStub");
    });

    it("renders the missing slug view when only a locale is given", async () => {
      await router.push("/da");

      expect(router.currentRoute.value.params).toEqual({ locale: "da" });
      expect(router.currentRoute.value.name).toBeUndefined();
      expect(currentComponentName()).toBe("MissingSlugViewStub");
    });

    it("resolves the welcome page from locale, organisation and election slugs", async () => {
      const election = uniqueElection();
      await router.push(`/en/org/${election}`);

      expect(router.currentRoute.value.name).toBe("Welcome");
      expect(router.currentRoute.value.params).toEqual({
        locale: "en",
        organisationSlug: "org",
        electionSlug: election,
      });
      expect(currentComponentName()).toBe("WelcomeStub");
    });

    it("resolves the unified ballot finder", async () => {
      const election = uniqueElection();
      await router.push(`/en/org/${election}/find`);

      expect(router.currentRoute.value.name).toBe("BallotFinder");
      expect(currentComponentName()).toBe("BallotUnifiedTrackingStub");
    });

    it.each(["track", "verify"])(
      "redirects the legacy /%s landing page to the ballot finder",
      async (segment) => {
        const election = uniqueElection();
        await router.push(`/fr/org/${election}/${segment}`);

        expect(router.currentRoute.value.name).toBe("BallotFinder");
        expect(router.currentRoute.value.fullPath).toBe(
          `/fr/org/${election}/find`,
        );
        expect(router.currentRoute.value.params).toEqual({
          locale: "fr",
          organisationSlug: "org",
          electionSlug: election,
        });
        expect(router.currentRoute.value.redirectedFrom?.fullPath).toBe(
          `/fr/org/${election}/${segment}`,
        );
      },
    );

    it("resolves the ballot tracker with its ballot code", async () => {
      const election = uniqueElection();
      await router.push(`/en/org/${election}/track/abc123`);

      expect(router.currentRoute.value.name).toBe("BallotTrackerView");
      expect(router.currentRoute.value.params.ballotCode).toBe("abc123");
      expect(currentComponentName()).toBe("BallotTrackerViewStub");
    });

    it("resolves the receipt error page", async () => {
      const election = uniqueElection();
      await router.push(`/en/org/${election}/receipt_error`);

      expect(router.currentRoute.value.name).toBe("ReceiptErrorView");
      expect(currentComponentName()).toBe("ReceiptErrorViewStub");
    });

    it("resolves the logs page with and without a page number", async () => {
      const election = uniqueElection();
      await router.push(`/en/org/${election}/logs`);

      expect(router.currentRoute.value.name).toBe("LogsView");
      expect(currentComponentName()).toBe("LogsViewStub");

      await router.push(`/en/org/${election}/logs/3`);

      expect(router.currentRoute.value.name).toBeUndefined();
      expect(router.currentRoute.value.params.page).toBe("3");
      expect(currentComponentName()).toBe("LogsViewStub");
    });

    it("resolves the help page", async () => {
      const election = uniqueElection();
      await router.push(`/en/org/${election}/help`);

      expect(router.currentRoute.value.name).toBe("HelpView");
      expect(currentComponentName()).toBe("HelpViewStub");
    });

    it("does not call the network for unguarded routes", async () => {
      const election = uniqueElection();
      await router.push(`/en/org/${election}/help`);

      expect(axiosGetMock).not.toHaveBeenCalled();
    });

    it("resolves named routes to their paths", () => {
      const params = {
        locale: "en",
        organisationSlug: "org",
        electionSlug: "el",
      };
      expect(
        router.resolve({
          name: "BallotVerifierFound",
          params: { ...params, verificationCode: "v1" },
        }).fullPath,
      ).toBe("/en/org/el/verify/v1/found");
      expect(router.resolve({ name: "ResultsView", params }).fullPath).toBe(
        "/en/org/el/results",
      );
    });
  });

  describe("verify guard", () => {
    it.each([
      ["BallotVerifierView", "pairing1", "BallotVerifierViewStub"],
      ["BallotVerifierFound", "code1/found", "BallotVerifierFoundViewStub"],
    ])(
      "fetches the election status and enters %s when there is no Canadian challenge",
      async (routeName, suffix, componentName) => {
        const election = uniqueElection();
        const status = { boardSlug: "board-1", canadianChallenge: false };
        axiosGetMock.mockResolvedValue({ data: { election: status } });

        await router.push(`/en/org/${election}/verify/${suffix}`);

        expect(axiosGetMock).toHaveBeenCalledWith(
          `${CONFERENCE_URL}/org/${election}/status`,
        );
        expect(router.currentRoute.value.name).toBe(routeName);
        expect(currentComponentName()).toBe(componentName);

        const configStore = useConfigStore();
        expect(configStore.electionStatus).toEqual(status);
        expect(configStore.boardSlug).toBe("board-1");
      },
    );

    it("redirects to the welcome page when the election uses the Canadian challenge", async () => {
      const election = uniqueElection();
      axiosGetMock.mockResolvedValue({
        data: { election: { canadianChallenge: true } },
      });

      await router.push(`/de/org/${election}/verify/pairing1`);

      expect(router.currentRoute.value.name).toBe("Welcome");
      expect(router.currentRoute.value.params).toEqual({
        locale: "de",
        organisationSlug: "org",
        electionSlug: election,
      });
      // No boardSlug in the status, so it is left untouched.
      expect(useConfigStore().boardSlug).toBeNull();
    });

    it("uses an already loaded election status without fetching", async () => {
      const election = uniqueElection();
      useConfigStore().setElectionStatus({
        canadianChallenge: true,
      } as never);

      await router.push(`/en/org/${election}/verify/code1/found`);

      expect(axiosGetMock).not.toHaveBeenCalled();
      expect(router.currentRoute.value.name).toBe("Welcome");
    });

    it("continues when the status response has no election", async () => {
      const election = uniqueElection();
      axiosGetMock.mockResolvedValue({ data: undefined });

      await router.push(`/en/org/${election}/verify/pairing1`);

      expect(router.currentRoute.value.name).toBe("BallotVerifierView");
      expect(useConfigStore().electionStatus).toBeNull();
    });

    it("logs and continues when fetching the status fails", async () => {
      const election = uniqueElection();
      const error = new Error("network down");
      axiosGetMock.mockRejectedValue(error);

      await router.push(`/en/org/${election}/verify/pairing1`);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch election status in route guard:",
        error,
      );
      expect(router.currentRoute.value.name).toBe("BallotVerifierView");
      expect(useConfigStore().electionStatus).toBeNull();
    });
  });

  describe("results guard", () => {
    it("fetches the published flag and enters the results page when published", async () => {
      const election = uniqueElection();
      axiosGetMock.mockResolvedValue({ data: { resultsPublished: true } });

      await router.push(`/en/org/${election}/results`);

      expect(axiosGetMock).toHaveBeenCalledWith(
        `${CONFERENCE_URL}/org/${election}/results_published`,
      );
      expect(router.currentRoute.value.name).toBe("ResultsView");
      expect(currentComponentName()).toBe("ResultsViewStub");
      expect(useConfigStore().resultsPublished).toBe(true);
      expect(useConfigStore().resultsPublishedLoaded).toBe(true);
    });

    it("redirects to the welcome page when results are not published", async () => {
      const election = uniqueElection();
      axiosGetMock.mockResolvedValue({ data: { resultsPublished: false } });

      await router.push(`/es/org/${election}/results`);

      expect(router.currentRoute.value.name).toBe("Welcome");
      expect(router.currentRoute.value.params).toEqual({
        locale: "es",
        organisationSlug: "org",
        electionSlug: election,
      });
    });

    it("treats a missing published flag as not published", async () => {
      const election = uniqueElection();
      axiosGetMock.mockResolvedValue({ data: undefined });

      await router.push(`/en/org/${election}/results`);

      expect(useConfigStore().resultsPublished).toBe(false);
      expect(useConfigStore().resultsPublishedLoaded).toBe(true);
      expect(router.currentRoute.value.name).toBe("Welcome");
    });

    it("uses the already loaded flag without fetching", async () => {
      const election = uniqueElection();
      useConfigStore().setResultsPublished(true);

      await router.push(`/en/org/${election}/results`);

      expect(axiosGetMock).not.toHaveBeenCalled();
      expect(router.currentRoute.value.name).toBe("ResultsView");
    });

    it("logs and redirects to the welcome page when fetching fails", async () => {
      const election = uniqueElection();
      const error = new Error("boom");
      axiosGetMock.mockRejectedValue(error);

      await router.push(`/en/org/${election}/results`);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch results_published in route guard:",
        error,
      );
      expect(useConfigStore().resultsPublishedLoaded).toBe(false);
      expect(router.currentRoute.value.name).toBe("Welcome");
    });
  });
});
