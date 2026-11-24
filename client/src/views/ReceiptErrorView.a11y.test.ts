import "../test-utils/setupConfig";
import { test, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { defineComponent, h } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import type { BasicElectionStatus } from "@/Types";
import useConfigStore from "@/stores/useConfigStore";
import useReceiptStore from "@/stores/useReceiptStore";
import { mountForA11y, i18n, defaultStubs } from "../test-utils/a11y";

vi.mock("@/router", () => ({ default: { push: vi.fn() } }));
vi.mock("@/lib/useAVVerifier", () => ({ default: vi.fn() }));

const ReceiptErrorView = (await import("./ReceiptErrorView.vue")).default;

const Wrapper = defineComponent({
  setup() {
    return () => h("main", [h(ReceiptErrorView)]);
  },
});

async function mountReceiptErrorView(
  receiptValid: boolean,
  contactUrl: Record<string, string> | null = null,
) {
  const pinia = createPinia();
  setActivePinia(pinia);
  useConfigStore().setElectionStatus({
    theme: { logo: "https://example.com/logo.png" },
    ...(contactUrl ? { electionVerificationSite: { contactUrl } } : {}),
  } as unknown as BasicElectionStatus);
  const receiptStore = useReceiptStore();
  receiptStore.receiptValid = receiptValid;
  receiptStore.trackingCodeMatching = false;

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/receipt-error",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push("/en/org_slug/election_slug/receipt-error");
  await router.isReady();

  return mountForA11y(Wrapper, {
    global: { plugins: [i18n, pinia, router], stubs: defaultStubs },
  });
}

test("ReceiptErrorView has no accessibility violations for an invalid receipt", async () => {
  const wrapper = await mountReceiptErrorView(false);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("ReceiptErrorView has no accessibility violations when the vote is not found", async () => {
  const wrapper = await mountReceiptErrorView(true, {
    "en-US": "https://example.com/contact",
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
