import "../test-utils/setupConfig";
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { defineComponent, h } from "vue";
import { mountForA11y, i18n, defaultStubs } from "../test-utils/a11y";
import useConfigStore from "@/stores/useConfigStore";

const { useAVVerifierMock } = vi.hoisted(() => ({
  useAVVerifierMock: vi.fn(),
}));

vi.mock("@/router", () => ({ default: { push: vi.fn() } }));
vi.mock("@/lib/useAVVerifier", () => ({ default: useAVVerifierMock }));

const BallotTrackerView = (await import("./BallotTrackerView.vue")).default;

let pinia: Pinia;

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/track/:ballotCode",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push("/en/org_slug/election_slug/track/BALLOT123");
  await router.isReady();

  const Wrapper = defineComponent({
    setup() {
      return () => h("main", [h(BallotTrackerView)]);
    },
  });

  const wrapper = await mountForA11y(Wrapper, {
    global: { plugins: [i18n, pinia, router], stubs: defaultStubs },
  });
  await flushPromises();
  return wrapper;
}

function mockActivities(activities: object[]) {
  useAVVerifierMock.mockResolvedValue({
    findBallot: vi.fn().mockResolvedValue("ballot-address"),
    pollForBallotDecision: vi.fn().mockResolvedValue(["cast", "TRACK"]),
    checkBallotStatus: vi
      .fn()
      .mockResolvedValue({ status: "registered", activities }),
  });
}

beforeEach(() => {
  pinia = createPinia();
  setActivePinia(pinia);
  useConfigStore().setBoardSlug("board-slug");
});

afterEach(() => {
  vi.clearAllMocks();
});

test("BallotTrackerView has no accessibility violations with activities", async () => {
  mockActivities([
    { type: "VoterSessionItem", registered_at: "2025-01-01T10:00:00Z" },
    { type: "CastRequestItem", registered_at: "2025-01-01T10:05:00Z" },
  ]);

  const wrapper = await mountView();

  expect(wrapper.find("#tracker-activity-list").exists()).toBe(true);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("BallotTrackerView has no accessibility violations without activities", async () => {
  mockActivities([]);

  const wrapper = await mountView();

  expect(wrapper.find("#ballot-tracker").exists()).toBe(true);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
