import "../test-utils/setupConfig";
import { test, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { defineComponent, h } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import type { BasicElectionStatus } from "@/Types";
import useConfigStore from "@/stores/useConfigStore";
import { mountForA11y, i18n, defaultStubs } from "../test-utils/a11y";

vi.mock("@/router", () => ({ default: { push: vi.fn() } }));

const Welcome = (await import("./Welcome.vue")).default;

const Wrapper = defineComponent({
  setup() {
    return () => h("main", [h(Welcome)]);
  },
});

async function mountWelcome(theme: Record<string, string> | null) {
  const pinia = createPinia();
  setActivePinia(pinia);
  if (theme) {
    useConfigStore().setElectionStatus({
      theme,
    } as unknown as BasicElectionStatus);
  }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push("/en/org_slug/election_slug");
  await router.isReady();

  return mountForA11y(Wrapper, {
    global: { plugins: [i18n, pinia, router], stubs: defaultStubs },
  });
}

test("Welcome has no accessibility violations without a theme", async () => {
  const wrapper = await mountWelcome(null);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("Welcome has no accessibility violations with splash and logo", async () => {
  const wrapper = await mountWelcome({
    splash: "https://example.com/splash.png",
    logo: "https://example.com/logo.png",
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
