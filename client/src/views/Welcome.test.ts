import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import type { BasicElectionStatus, ElectionConfigContent } from "@/Types";
import useConfigStore from "@/stores/useConfigStore";
import { fallbackMessages } from "../assets/translations";

const { routerPushMock } = vi.hoisted(() => ({ routerPushMock: vi.fn() }));

vi.mock("@/router", () => ({
  default: { push: routerPushMock },
}));

const Welcome = (await import("./Welcome.vue")).default;

const en = JSON.parse(JSON.stringify(fallbackMessages.en));
const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: { en },
  missingWarn: false,
  fallbackWarn: false,
});

const stubs = { AVIcon: { template: "<span />" } };

async function mountWelcome(theme: Record<string, string> | null = null) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const configStore = useConfigStore();
  if (theme) {
    configStore.setElectionStatus({ theme } as unknown as BasicElectionStatus);
  }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug",
        name: "Welcome",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push("/en/org_slug/election_slug");
  await router.isReady();

  const wrapper = mount(Welcome, {
    global: { plugins: [i18n, pinia, router], stubs },
  });
  return { wrapper, configStore };
}

describe("Welcome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the ballot finder card and the about section", async () => {
    const { wrapper } = await mountWelcome();

    const welcome = en.views.welcome;
    expect(wrapper.find("#welcome-finder-title").text()).toBe(
      welcome.ballot_finder.title,
    );
    expect(wrapper.find("#find-ballot").text()).toBe(
      welcome.ballot_finder.button,
    );
    expect(wrapper.find("#welcome-about-title").text()).toBe(
      welcome.about.title,
    );
    expect(wrapper.find("#welcome-about-description-text").text()).toBe(
      welcome.description,
    );
    expect(wrapper.find("#welcome-about-finder-subtitle").text()).toBe(
      welcome.about.ballot_finder,
    );
    expect(wrapper.find("#welcome-about-audit-text").text()).toBe(
      welcome.about.audit_log_text,
    );
  });

  it("does not render splash or logo images without a theme", async () => {
    const { wrapper } = await mountWelcome();

    expect(wrapper.find("#welcome-splash").exists()).toBe(false);
    expect(wrapper.find("#welcome-brand-logo").exists()).toBe(false);
  });

  it("renders the themed splash and brand logo", async () => {
    const { wrapper } = await mountWelcome({
      splash: "https://example.com/splash.png",
      logo: "https://example.com/logo.png",
    });

    const splash = wrapper.find("#welcome-splash");
    expect(splash.attributes("src")).toBe("https://example.com/splash.png");
    expect(splash.attributes("alt")).toBe(en.views.welcome.splash_alt);
    const logo = wrapper.find("#welcome-brand-logo");
    expect(logo.attributes("src")).toBe("https://example.com/logo.png");
    expect(logo.attributes("alt")).toBe(en.header.election_logo_alt);
  });

  it("shows the election title from the configuration", async () => {
    const { wrapper, configStore } = await mountWelcome();
    configStore.election = {
      title: { en: "Board Election 2026" },
    } as unknown as ElectionConfigContent;
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#page-title-name").text()).toBe("Board Election 2026");
  });

  it("navigates to the ballot finder of the current election", async () => {
    const { wrapper } = await mountWelcome();

    await wrapper.find("#find-ballot").trigger("click");

    expect(routerPushMock).toHaveBeenCalledTimes(1);
    expect(routerPushMock).toHaveBeenCalledWith(
      "/en/org_slug/election_slug/find",
    );
  });
});
