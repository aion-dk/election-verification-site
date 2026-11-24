import "../test-utils/setupConfig";
import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import { createPinia, setActivePinia } from "pinia";
import useConfigStore from "@/stores/useConfigStore";
import Footer from "./Footer.vue";
import { mountForA11y, i18n, defaultStubs } from "../test-utils/a11y";

test("has no accessibility violations in default state", async () => {
  const wrapper = await mountForA11y(Footer);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("has no accessibility violations with a custom footer", async () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  useConfigStore().setElectionStatus({
    cosmetics: {
      footerHtml:
        '<p>Custom footer <a href="https://example.com" target="_blank">link</a></p>',
    },
  } as any);

  const wrapper = await mountForA11y(Footer, {
    global: { plugins: [i18n, pinia], stubs: defaultStubs },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
