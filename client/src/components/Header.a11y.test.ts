import "../test-utils/setupConfig";
import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import useConfigStore from "@/stores/useConfigStore";
import Header from "./Header.vue";
import { createI18n } from "vue-i18n";
import { mountForA11y, defaultStubs } from "../test-utils/a11y";
import { fallbackMessages } from "../assets/translations";

// The shared a11y i18n instance uses the default "en-US" locale; the contact
// link is looked up by the exact locale, so use "en".
const i18n = createI18n({
  locale: "en",
  messages: { en: JSON.parse(JSON.stringify(fallbackMessages.en)) },
});

const stubs = {
  ...defaultStubs,
  AVAnimatedMenuButton: {
    template: "<button type='button' aria-label='Menu'>menu</button>",
  },
};

async function setup(status: Record<string, unknown>) {
  const pinia = createPinia();
  setActivePinia(pinia);
  useConfigStore().setElectionStatus(status as any);
  useConfigStore().setResultsPublished(true);

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/:page*",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push("/en/org/elec");
  await router.isReady();

  return mountForA11y(Header, {
    props: { locale: "en", election: { locales: ["en", "da"] } as any },
    global: { plugins: [i18n, pinia, router], stubs },
  });
}

test("has no accessibility violations with the default title", async () => {
  const wrapper = await setup({});
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("has no accessibility violations with a logo and contact link", async () => {
  const wrapper = await setup({
    theme: { logo: "https://example.com/logo.png" },
    electionVerificationSite: {
      contactUrl: { en: "https://example.com/contact" },
    },
  });
  expect(wrapper.find("#header-logo").exists()).toBe(true);
  expect(wrapper.find("#header-link-contact").exists()).toBe(true);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
