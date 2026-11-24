import "../test-utils/setupConfig";
import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import { defineComponent, h } from "vue";
import { flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia } from "pinia";
import type { BasicElectionStatus } from "@/Types";
import useConfigStore from "@/stores/useConfigStore";
import { mountForA11y, defaultStubs } from "../test-utils/a11y";
import { fallbackMessages } from "../assets/translations";
import HelpView from "./HelpView.vue";

// HelpView reads FAQ entries with getLocaleMessage(locale), so the active
// locale must be exactly "en" (the shared a11y i18n defaults to "en-US").
const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: { en: JSON.parse(JSON.stringify(fallbackMessages.en)) },
  missingWarn: false,
  fallbackWarn: false,
});

const Wrapper = defineComponent({
  setup() {
    return () => h("main", [h(HelpView)]);
  },
});

async function mountHelpView(status: Partial<BasicElectionStatus> = null) {
  const pinia = createPinia();
  setActivePinia(pinia);
  if (status) {
    useConfigStore().setElectionStatus(status as BasicElectionStatus);
  }
  const wrapper = await mountForA11y(Wrapper, {
    global: { plugins: [i18n, pinia], stubs: defaultStubs },
  });
  await flushPromises();
  return wrapper;
}

test("HelpView has no accessibility violations on the default tab", async () => {
  const wrapper = await mountHelpView();
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("HelpView has no accessibility violations with an expanded question", async () => {
  const wrapper = await mountHelpView({
    theme: { logo: "https://example.com/logo.png" },
  } as Partial<BasicElectionStatus>);
  await wrapper.find("#help-tab-other").trigger("click");
  await wrapper.find(".HelpView__FAQ").trigger("click");
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("HelpView has no accessibility violations for the Canadian challenge", async () => {
  const wrapper = await mountHelpView({ canadianChallenge: true });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
