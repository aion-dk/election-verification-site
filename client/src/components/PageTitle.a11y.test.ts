import "../test-utils/setupConfig";
import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import { createPinia, setActivePinia } from "pinia";
import useConfigStore from "@/stores/useConfigStore";
import PageTitle from "./PageTitle.vue";
import { createI18n } from "vue-i18n";
import { mountForA11y, defaultStubs } from "../test-utils/a11y";
import { fallbackMessages } from "../assets/translations";

// The shared a11y i18n instance uses the default "en-US" locale; these
// components look up localized content by the exact locale, so use "en".
const i18n = createI18n({
  locale: "en",
  messages: { en: JSON.parse(JSON.stringify(fallbackMessages.en)) },
});

test("has no accessibility violations without an election", async () => {
  const wrapper = await mountForA11y(PageTitle);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("has no accessibility violations with an election name", async () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  useConfigStore().election = { title: { en: "General Election" } } as any;

  const wrapper = await mountForA11y(PageTitle, {
    global: { plugins: [i18n, pinia], stubs: defaultStubs },
  });
  expect(wrapper.find("h1").text()).toBe("General Election");
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
