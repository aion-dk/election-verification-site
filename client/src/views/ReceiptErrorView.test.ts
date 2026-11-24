import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import type { BasicElectionStatus } from "@/Types";
import useConfigStore from "@/stores/useConfigStore";
import useReceiptStore from "@/stores/useReceiptStore";
import { fallbackMessages } from "../assets/translations";

const { routerPushMock } = vi.hoisted(() => ({ routerPushMock: vi.fn() }));

vi.mock("@/router", () => ({
  default: { push: routerPushMock },
}));

// The receipt store pulls in the opaque js-client through this module.
vi.mock("@/lib/useAVVerifier", () => ({ default: vi.fn() }));

const ReceiptErrorView = (await import("./ReceiptErrorView.vue")).default;

const en = JSON.parse(JSON.stringify(fallbackMessages.en));
// These strings are served by the Conference Service, not bundled offline.
en.views.receipt_error = {
  receipt_invalid: {
    title: "Invalid receipt title",
    primary_action: "Invalid primary",
    secondary_action: "Invalid secondary",
  },
  vote_not_found: {
    title: "Vote not found title",
    primary_action: "Not found primary",
    secondary_action: "Not found secondary",
  },
};
en.errors.receipt = {
  receipt_invalid: {
    title: "Receipt error title",
    description: "Receipt error description",
  },
  vote_not_found: {
    title: "Vote error title",
    description: "Vote error description",
  },
};

const stubs = {
  AVIcon: { props: ["icon"], template: '<span :data-icon="icon" />' },
};

const CONTACT_URL = "https://example.com/contact";

interface MountOptions {
  receiptValid: boolean | null;
  trackingCodeMatching?: boolean | null;
  contactUrl?: Record<string, string> | null;
}

async function mountReceiptErrorView({
  receiptValid,
  trackingCodeMatching = null,
  contactUrl = null,
}: MountOptions) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const configStore = useConfigStore();
  configStore.setElectionStatus({
    theme: { logo: "https://example.com/logo.png" },
    ...(contactUrl ? { electionVerificationSite: { contactUrl } } : {}),
  } as unknown as BasicElectionStatus);
  const receiptStore = useReceiptStore();
  receiptStore.receiptValid = receiptValid;
  receiptStore.trackingCodeMatching = trackingCodeMatching;

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/receipt-error",
        name: "ReceiptErrorView",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push("/en/org_slug/election_slug/receipt-error");
  await router.isReady();

  const i18n = createI18n({
    legacy: false,
    locale: "en",
    messages: { en },
    missingWarn: false,
    fallbackWarn: false,
  });

  const wrapper = mount(ReceiptErrorView, {
    global: { plugins: [i18n, pinia, router], stubs },
  });
  await flushPromises();
  return wrapper;
}

describe("ReceiptErrorView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("when the receipt is invalid", () => {
    it("shows the invalid receipt error with both actions", async () => {
      const wrapper = await mountReceiptErrorView({ receiptValid: false });

      expect(wrapper.find("#receipt-error-title").text()).toBe(
        "Invalid receipt title",
      );
      expect(
        wrapper
          .find("#receipt-error-main-icon [data-icon]")
          .attributes("data-icon"),
      ).toBe("file-circle-xmark");
      expect(
        wrapper.find("#error-description-receipt-receipt_invalid").text(),
      ).toContain("Receipt error description");
      expect(wrapper.find("#receipt-error-primary-button").text()).toBe(
        "Invalid primary",
      );
      expect(wrapper.find("#receipt-error-secondary-button").text()).toBe(
        "Invalid secondary",
      );
    });

    it("sends the voter back to the tracker with the primary action", async () => {
      const wrapper = await mountReceiptErrorView({ receiptValid: false });

      await wrapper.find("#receipt-error-primary-button").trigger("click");

      expect(routerPushMock).toHaveBeenCalledWith(
        "/en/org_slug/election_slug/track",
      );
    });

    it("sends the voter to the election home with the secondary action", async () => {
      const wrapper = await mountReceiptErrorView({ receiptValid: false });

      await wrapper.find("#receipt-error-secondary-button").trigger("click");

      expect(routerPushMock).toHaveBeenCalledWith("/en/org_slug/election_slug");
    });

    it("ignores the contact URL", async () => {
      const location = { href: "" };
      vi.stubGlobal("location", location);
      const wrapper = await mountReceiptErrorView({
        receiptValid: false,
        contactUrl: { en: CONTACT_URL },
      });

      await wrapper.find("#receipt-error-primary-button").trigger("click");

      expect(location.href).toBe("");
      expect(routerPushMock).toHaveBeenCalledWith(
        "/en/org_slug/election_slug/track",
      );
    });
  });

  describe("when the receipt is valid but the tracking code does not match", () => {
    it("offers only a way back to the election when no contact URL exists", async () => {
      const wrapper = await mountReceiptErrorView({
        receiptValid: true,
        trackingCodeMatching: false,
      });

      expect(wrapper.find("#receipt-error-title").text()).toBe(
        "Vote not found title",
      );
      expect(
        wrapper
          .find("#receipt-error-main-icon [data-icon]")
          .attributes("data-icon"),
      ).toBe("circle-xmark");
      expect(
        wrapper.find("#error-description-receipt-vote_not_found").text(),
      ).toContain("Vote error description");
      const primary = wrapper.find("#receipt-error-primary-button");
      expect(primary.text()).toBe("Not found secondary");
      expect(wrapper.find("#receipt-error-secondary-button").exists()).toBe(
        false,
      );

      await primary.trigger("click");
      expect(routerPushMock).toHaveBeenCalledWith("/en/org_slug/election_slug");
    });

    it("ignores a contact URL configured for another locale", async () => {
      const wrapper = await mountReceiptErrorView({
        receiptValid: true,
        trackingCodeMatching: false,
        contactUrl: { da: CONTACT_URL },
      });

      expect(wrapper.find("#receipt-error-primary-button").text()).toBe(
        "Not found secondary",
      );
      expect(wrapper.find("#receipt-error-secondary-button").exists()).toBe(
        false,
      );
    });

    it("opens the external contact page with the primary action", async () => {
      const location = { href: "" };
      vi.stubGlobal("location", location);
      const wrapper = await mountReceiptErrorView({
        receiptValid: true,
        trackingCodeMatching: false,
        contactUrl: { en: CONTACT_URL },
      });

      const primary = wrapper.find("#receipt-error-primary-button");
      expect(primary.text()).toBe("Not found primary");
      await primary.trigger("click");

      expect(location.href).toBe(CONTACT_URL);
      expect(routerPushMock).not.toHaveBeenCalled();
    });

    it("keeps an internal secondary action next to the contact link", async () => {
      const wrapper = await mountReceiptErrorView({
        receiptValid: true,
        trackingCodeMatching: false,
        contactUrl: { en: CONTACT_URL },
      });

      const secondary = wrapper.find("#receipt-error-secondary-button");
      expect(secondary.text()).toBe("Not found secondary");
      await secondary.trigger("click");

      expect(routerPushMock).toHaveBeenCalledWith("/en/org_slug/election_slug");
    });
  });

  it("uses the invalid receipt copy when receipt and tracking code are both valid", async () => {
    const wrapper = await mountReceiptErrorView({
      receiptValid: true,
      trackingCodeMatching: true,
    });

    expect(wrapper.find("#receipt-error-title").text()).toBe(
      "Invalid receipt title",
    );
    expect(wrapper.find("#receipt-error-primary-button").text()).toBe(
      "Invalid secondary",
    );
  });

  it("renders the help steps and the election logo", async () => {
    const wrapper = await mountReceiptErrorView({ receiptValid: false });

    expect(wrapper.findAll(".ReceiptError__Step")).toHaveLength(2);
    expect(wrapper.find("#receipt-error-step-index-2").text()).toBe("2");
    expect(wrapper.find("#receipt-error-step-text-1").html()).toContain(
      "<strong>",
    );
    expect(wrapper.find("#content-layout-brand-logo").attributes("src")).toBe(
      "https://example.com/logo.png",
    );
  });
});
