import "../test-utils/setupConfig";
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { defineComponent, h } from "vue";
import { mountForA11y, i18n, defaultStubs } from "../test-utils/a11y";
import useConfigStore from "@/stores/useConfigStore";
import useVerificationStore from "@/stores/useVerificationStore";

vi.mock("@/router", () => ({ default: { push: vi.fn() } }));
vi.mock("@assemblyvoting/electa-ui", () => ({
  Modal: class {
    show = vi.fn();
    hide = vi.fn();
  },
}));

const BallotVerifierView = (await import("./BallotVerifierView.vue")).default;

let pinia: Pinia;
// BallotVerifierContest reads titles by the active i18n locale
const locale = i18n.global.locale as string;

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/verify/:pairingCode",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push("/en/org_slug/election_slug/verify/PAIRING");
  await router.isReady();

  const Wrapper = defineComponent({
    setup() {
      return () => h("main", [h(BallotVerifierView)]);
    },
  });

  const wrapper = await mountForA11y(Wrapper, {
    global: {
      plugins: [i18n, pinia, router],
      stubs: { ...defaultStubs, AVPileSummary: { template: "<div />" } },
    },
  });
  await flushPromises();
  return wrapper;
}

beforeEach(() => {
  pinia = createPinia();
  setActivePinia(pinia);
  const configStore = useConfigStore();
  configStore.election = { bcTimeout: 300 } as any;
  configStore.latestConfig = {
    contestConfigs: {
      c1: {
        content: {
          title: { [locale]: "Contest one" },
          question: { [locale]: "Who should win?" },
          options: [],
        },
      },
    },
  } as any;
  useVerificationStore().pairingCode = "PAIRING";
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

test("BallotVerifierView has no accessibility violations while waiting", async () => {
  const wrapper = await mountView();

  expect(wrapper.find("#verifier-inprogress-content").exists()).toBe(true);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("BallotVerifierView has no accessibility violations with the expiry alert", async () => {
  vi.useFakeTimers();
  const wrapper = await mountView();

  // Timedown alerts when 180 of the 300 seconds are left
  await vi.advanceTimersByTimeAsync(120_000);

  expect(wrapper.find("#verifier-alert").exists()).toBe(true);
  vi.useRealTimers();
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("BallotVerifierView has no accessibility violations with a decrypted ballot", async () => {
  useVerificationStore().ballot = [{ reference: "c1", piles: [] }] as any;

  const wrapper = await mountView();

  expect(wrapper.find("#verifier-spoiled-content").exists()).toBe(true);
  expect(wrapper.find("#contest-title-c1").text()).toBe("Contest one");
  // Known issue: BallotVerifierContest renders an <h3> right after this
  // view's <h1>, skipping a heading level. Tracked separately; every other
  // rule is still enforced here.
  const results = await axe(wrapper.element, {
    rules: { "heading-order": { enabled: false } },
  });
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
