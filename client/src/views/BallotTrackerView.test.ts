import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { fallbackMessages } from "../assets/translations";
import useConfigStore from "@/stores/useConfigStore";
import useVerificationStore from "@/stores/useVerificationStore";

const { pushMock, useAVVerifierMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  useAVVerifierMock: vi.fn(),
}));

vi.mock("@/router", () => ({ default: { push: pushMock } }));
vi.mock("@/lib/useAVVerifier", () => ({ default: useAVVerifierMock }));

const BallotTrackerView = (await import("./BallotTrackerView.vue")).default;

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

const stubs = {
  AVIcon: { template: "<span />" },
  AVTooltip: { template: "<span />" },
  DateTime: { template: "<span />" },
};

const activities = [
  { type: "VoterSessionItem", registered_at: "2025-01-01T10:00:00Z" },
  { type: "CastRequestItem", registered_at: "2025-01-01T10:05:00Z" },
];

function createVerifier(overrides: Record<string, any> = {}) {
  return {
    findBallot: vi.fn().mockResolvedValue("ballot-address"),
    pollForBallotDecision: vi.fn().mockResolvedValue(["cast", "TRACKING-CODE"]),
    checkBallotStatus: vi.fn().mockResolvedValue({
      status: "registered",
      activities: [...activities],
    }),
    ...overrides,
  };
}

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/track/:ballotCode",
        name: "BallotTrackerView",
        component: { template: "<div />" },
      },
    ],
  });
}

let pinia: Pinia;

async function mountView() {
  const router = createTestRouter();
  await router.push("/en/org_slug/election_slug/track/BALLOT123");
  await router.isReady();

  const wrapper = mount(BallotTrackerView, {
    global: { plugins: [i18n, pinia, router], stubs },
  });

  await flushPromises();
  return wrapper;
}

describe("BallotTrackerView", () => {
  let verifier: ReturnType<typeof createVerifier>;

  beforeEach(() => {
    vi.clearAllMocks();
    pinia = createPinia();
    setActivePinia(pinia);
    useConfigStore().setBoardSlug("board-slug");
    verifier = createVerifier();
    useAVVerifierMock.mockResolvedValue(verifier);
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("looks up the ballot and renders its activity when no tracking code is known", async () => {
    const wrapper = await mountView();
    const store = useVerificationStore();

    expect(useAVVerifierMock).toHaveBeenCalledWith("board-slug");
    expect(verifier.findBallot).toHaveBeenCalledWith("BALLOT123");
    expect(verifier.pollForBallotDecision).toHaveBeenCalledTimes(1);
    expect(verifier.checkBallotStatus).toHaveBeenCalledWith("TRACKING-CODE");
    expect(store.trackingCode).toBe("TRACKING-CODE");
    expect(pushMock).not.toHaveBeenCalled();

    expect(wrapper.find("#ballot-tracker").exists()).toBe(true);
    expect(wrapper.find("#current-ballot-code").text()).toBe("BALLOT123");
    expect(wrapper.find("#tracker-title").text()).toBe("Ballot Registered");
    expect(wrapper.find("#content-layout-breadcrumb").text()).toBe(
      "Ballot Tracker",
    );
    expect(wrapper.find("#tracker-help-p1-title").text()).toBe(
      "Congratulations!",
    );

    const listedActivities = wrapper.findAll(".BallotActivity");
    expect(listedActivities).toHaveLength(2);
    // activities are reversed by the store: newest first
    expect(listedActivities[0].text()).toContain("Ballot Cast");
    wrapper.unmount();
  });

  it("shows the election logo from the election status theme", async () => {
    useConfigStore().setElectionStatus({
      theme: { logo: "https://example.com/logo.png" },
    } as any);

    const wrapper = await mountView();

    expect(wrapper.find("#content-layout-brand-logo").attributes("src")).toBe(
      "https://example.com/logo.png",
    );
    wrapper.unmount();
  });

  it("hides the activity list when the ballot has no activities", async () => {
    verifier.checkBallotStatus.mockResolvedValue({
      status: "registered",
      activities: [],
    });

    const wrapper = await mountView();

    expect(wrapper.find("#ballot-tracker").exists()).toBe(true);
    expect(wrapper.find("#tracker-activity-list").exists()).toBe(false);
    wrapper.unmount();
  });

  it("skips the lookup when the store already holds a tracking code", async () => {
    const store = useVerificationStore();
    await store.setupAVVerifier("board-slug");
    store.setTrackingCode("LEGACY-TRACKING");
    vi.clearAllMocks();

    const wrapper = await mountView();

    expect(useAVVerifierMock).not.toHaveBeenCalled();
    expect(verifier.findBallot).not.toHaveBeenCalled();
    expect(verifier.pollForBallotDecision).not.toHaveBeenCalled();
    expect(verifier.checkBallotStatus).toHaveBeenCalledWith("LEGACY-TRACKING");
    expect(wrapper.find("#ballot-tracker").exists()).toBe(true);
    wrapper.unmount();
  });

  it("redirects to the verification landing when the lookup fails", async () => {
    verifier.findBallot.mockRejectedValue(new Error("not found"));
    verifier.checkBallotStatus.mockRejectedValue(new Error("not found"));

    const wrapper = await mountView();

    expect(console.error).toHaveBeenCalledWith(new Error("not found"));
    expect(pushMock).toHaveBeenCalledWith({
      name: "BallotVerificationLanding",
    });
    expect(verifier.pollForBallotDecision).not.toHaveBeenCalled();
    expect(wrapper.find("#ballot-tracker").exists()).toBe(false);
    wrapper.unmount();
  });

  it("redirects when the ballot has not been cast", async () => {
    verifier.pollForBallotDecision.mockResolvedValue(["spoiled", "addr"]);

    const wrapper = await mountView();

    expect(pushMock).toHaveBeenCalledWith({
      name: "BallotVerificationLanding",
    });
    wrapper.unmount();
  });

  it("navigates back to the ballot finder on cancel", async () => {
    const wrapper = await mountView();

    await wrapper.find("[data-testid=cancel]").trigger("click");

    expect(pushMock).toHaveBeenCalledTimes(1);
    // Only the suffix is asserted: the view interpolates `i18n.global.locale`
    // (a ref in composition mode), so the locale segment is not "en".
    expect(pushMock.mock.calls[0][0]).toMatch(
      /\/org_slug\/election_slug\/find$/,
    );
    wrapper.unmount();
  });
});
