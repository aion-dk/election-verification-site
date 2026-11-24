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

const BallotVerifierFoundView = (await import("./BallotVerifierFoundView.vue"))
  .default;

let pinia: Pinia;

beforeEach(() => {
  pinia = createPinia();
  setActivePinia(pinia);
  useConfigStore().setBoardSlug("board-slug");
  useAVVerifierMock.mockResolvedValue({
    findBallot: vi.fn().mockResolvedValue("ballot-address"),
    // the ballot decision is still pending while the page is shown
    pollForBallotDecision: vi.fn(() => new Promise(() => {})),
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

test("BallotVerifierFoundView has no accessibility violations", async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/verify/:verificationCode/found",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push("/en/org_slug/election_slug/verify/CODE42/found");
  await router.isReady();

  const Wrapper = defineComponent({
    setup() {
      return () => h("main", [h(BallotVerifierFoundView)]);
    },
  });

  const wrapper = await mountForA11y(Wrapper, {
    global: { plugins: [i18n, pinia, router], stubs: defaultStubs },
  });
  await flushPromises();

  expect(wrapper.find("#verifier-found-title").exists()).toBe(true);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
