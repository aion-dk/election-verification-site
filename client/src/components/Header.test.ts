import "../test-utils/setupConfig";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { createRouter, createMemoryHistory, type Router } from "vue-router";
import useConfigStore from "@/stores/useConfigStore";
import type { SupportedLocale } from "@/Types";
import Header from "./Header.vue";
import DropDown from "./DropDown.vue";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = {
  en: JSON.parse(neededStrings),
  da: JSON.parse(neededStrings),
};

const AVAnimatedMenuButton = {
  name: "AVAnimatedMenuButton",
  props: ["isOpened", "variant", "theme"],
  emits: ["update:isOpened"],
  template:
    "<button type='button' class='menu-stub' @click=\"$emit('update:isOpened', !isOpened)\">menu</button>",
};

const AVIcon = { template: "<span />" };

const election = { locales: ["en", "da"] } as any;

let pinia: Pinia;
let router: Router;

async function mountHeader(
  status: Record<string, unknown> | null = {},
  locale: SupportedLocale = "en",
) {
  if (status) useConfigStore().setElectionStatus(status as any);

  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/:page*",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push(`/${locale}/org/elec`);
  await router.isReady();

  const i18n = createI18n({ legacy: false, locale, messages });
  return mount(Header, {
    props: { locale, election },
    global: {
      plugins: [i18n, pinia, router],
      stubs: { AVAnimatedMenuButton, AVIcon },
    },
  });
}

const nav = (wrapper: Awaited<ReturnType<typeof mountHeader>>) =>
  wrapper.find("#header-nav");

describe("Header", () => {
  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("branding", () => {
    it("shows the site title when there is no logo", async () => {
      const wrapper = await mountHeader(null);

      expect(wrapper.find("#header-logo").exists()).toBe(false);
      expect(wrapper.find("#header-title").text()).toBe(
        "Election Verification Site",
      );
    });

    it("shows the election logo when the theme defines one", async () => {
      const wrapper = await mountHeader({
        theme: { logo: "https://example.com/logo.png" },
      });

      const logo = wrapper.find("#header-logo");
      expect(logo.attributes("src")).toBe("https://example.com/logo.png");
      expect(logo.attributes("alt")).toBe("Election logo");
      expect(wrapper.find("#header-title").exists()).toBe(false);
    });

    it("links the branding to the election home page", async () => {
      const wrapper = await mountHeader();

      expect(
        wrapper.find("#header-election-info-link").attributes("href"),
      ).toBe("/en/org/elec");
    });
  });

  describe("navigation links", () => {
    it("renders find, logs and help links built from the route params", async () => {
      const wrapper = await mountHeader();

      expect(wrapper.find("#header-link-verification").attributes("href")).toBe(
        "/en/org/elec/find",
      );
      expect(wrapper.find("#header-link-verification").text()).toBe(
        "Ballot Finder",
      );
      expect(wrapper.find("#header-link-logs").attributes("href")).toBe(
        "/en/org/elec/logs",
      );
      expect(wrapper.find("#header-link-help").attributes("href")).toBe(
        "/en/org/elec/help",
      );
    });

    it("hides the ballot finder link for canadian challenge elections", async () => {
      const wrapper = await mountHeader({ canadianChallenge: true });

      expect(wrapper.find("#header-link-verification").exists()).toBe(false);
      expect(wrapper.find("#header-link-logs").exists()).toBe(true);
    });

    it("only shows the results link once results are published", async () => {
      const wrapper = await mountHeader();
      expect(wrapper.find("#header-link-results").exists()).toBe(false);

      useConfigStore().setResultsPublished(true);
      await wrapper.vm.$nextTick();

      const results = wrapper.find("#header-link-results");
      expect(results.attributes("href")).toBe("/en/org/elec/results");
      expect(results.text()).toBe("Results");
    });

    it("does not show a contact link when none is configured", async () => {
      const wrapper = await mountHeader({
        electionVerificationSite: { contactUrl: {} },
      });

      expect(wrapper.find("#header-link-contact").exists()).toBe(false);
    });

    it("shows the contact link for the current locale", async () => {
      const wrapper = await mountHeader(
        {
          electionVerificationSite: {
            contactUrl: {
              en: "https://example.com/contact",
              da: "https://example.com/kontakt",
            },
          },
        },
        "da",
      );

      const contact = wrapper.find("#header-link-contact");
      expect(contact.attributes("href")).toBe("https://example.com/kontakt");
      expect(contact.attributes("target")).toBe("_blank");
      expect(contact.attributes("rel")).toBe("noopener noreferrer");
      expect(contact.text()).toContain("Contact");
    });
  });

  describe("locale selection", () => {
    it("offers the election locales with the current one selected", async () => {
      const wrapper = await mountHeader({}, "da");

      expect(wrapper.findComponent(DropDown).props("options")).toEqual([
        { selected: false, value: "en", display: "English" },
        { selected: true, value: "da", display: "Dansk" },
      ]);
    });

    it("emits changeLocale when a new locale is chosen", async () => {
      const wrapper = await mountHeader();

      await wrapper.find("#localizationDropdownMenu-select").setValue("da");

      expect(wrapper.emitted("changeLocale")).toEqual([["da"]]);
    });
  });

  describe("mobile menu", () => {
    it("starts closed and toggles via the hamburger button", async () => {
      const wrapper = await mountHeader();
      expect(nav(wrapper).classes()).toContain("Header__Show");

      await wrapper.find(".menu-stub").trigger("click");
      expect(nav(wrapper).classes()).not.toContain("Header__Show");

      await wrapper.find(".menu-stub").trigger("click");
      expect(nav(wrapper).classes()).toContain("Header__Show");
    });

    it("toggles the menu and signals a page reload when following find or results", async () => {
      useConfigStore().setResultsPublished(true);
      const wrapper = await mountHeader();
      const configStore = useConfigStore();
      expect(configStore.pageRefreshIterator).toBe(0);

      await wrapper.find("#header-link-verification").trigger("click");
      expect(configStore.pageRefreshIterator).toBe(1);
      expect(nav(wrapper).classes()).not.toContain("Header__Show");

      await wrapper.find("#header-link-results").trigger("click");
      expect(configStore.pageRefreshIterator).toBe(2);
      expect(nav(wrapper).classes()).toContain("Header__Show");
    });

    it("toggles the menu without a page reload when following logs or help", async () => {
      const wrapper = await mountHeader();
      const configStore = useConfigStore();

      await wrapper.find("#header-link-logs").trigger("click");
      expect(nav(wrapper).classes()).not.toContain("Header__Show");

      await wrapper.find("#header-link-help").trigger("click");
      expect(nav(wrapper).classes()).toContain("Header__Show");

      expect(configStore.pageRefreshIterator).toBe(0);
    });

    it("closes the menu when the window is resized", async () => {
      const wrapper = await mountHeader();
      await wrapper.find(".menu-stub").trigger("click");
      expect(nav(wrapper).classes()).not.toContain("Header__Show");

      globalThis.dispatchEvent(new Event("resize"));
      await wrapper.vm.$nextTick();

      expect(nav(wrapper).classes()).toContain("Header__Show");
    });

    it("stops listening to resize events once unmounted", async () => {
      const addSpy = vi.spyOn(globalThis, "addEventListener");
      const removeSpy = vi.spyOn(globalThis, "removeEventListener");
      const wrapper = await mountHeader();

      const resizeCall = addSpy.mock.calls.find(([type]) => type === "resize");
      expect(resizeCall).toBeDefined();

      wrapper.unmount();

      expect(removeSpy).toHaveBeenCalledWith("resize", resizeCall[1]);
    });
  });
});
