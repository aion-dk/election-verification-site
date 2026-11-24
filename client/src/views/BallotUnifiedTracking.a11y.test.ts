import "../test-utils/setupConfig";
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { defineComponent, h } from "vue";
import { mountForA11y, i18n, defaultStubs } from "../test-utils/a11y";
import useConfigStore from "@/stores/useConfigStore";

const { findBallotMock } = vi.hoisted(() => ({ findBallotMock: vi.fn() }));

vi.mock("@/router", () => ({ default: { push: vi.fn() } }));
vi.mock("@/lib/useAVVerifier", () => ({
  default: vi.fn().mockResolvedValue({ findBallot: findBallotMock }),
}));

const BallotUnifiedTracking = (await import("./BallotUnifiedTracking.vue"))
  .default;

let pinia: Pinia;

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/find",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push("/en/org_slug/election_slug/find");
  await router.isReady();

  const Wrapper = defineComponent({
    setup() {
      return () => h("main", [h(BallotUnifiedTracking)]);
    },
  });

  const wrapper = await mountForA11y(Wrapper, {
    global: {
      plugins: [i18n, pinia, router],
      stubs: { ...defaultStubs, AVFileInput: { template: "<div />" } },
      directives: { tooltip: {} },
    },
  });
  await flushPromises();
  return wrapper;
}

beforeEach(() => {
  pinia = createPinia();
  setActivePinia(pinia);
  useConfigStore().setBoardSlug("board-slug");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

test("BallotUnifiedTracking has no accessibility violations", async () => {
  const wrapper = await mountView();

  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("BallotUnifiedTracking has no accessibility violations with an error", async () => {
  findBallotMock.mockRejectedValue(new Error("not found"));
  const wrapper = await mountView();

  await wrapper.find("#unified-code").setValue("WRONG");
  await wrapper.find("#initiate-tracking").trigger("click");
  await flushPromises();

  expect(wrapper.find("#error-verify-invalid_code").exists()).toBe(true);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
