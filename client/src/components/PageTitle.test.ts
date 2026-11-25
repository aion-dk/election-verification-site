import "../test-utils/setupConfig";
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import useConfigStore from "@/stores/useConfigStore";
import PageTitle from "./PageTitle.vue";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings), da: {} };

let pinia: Pinia;

function mountPageTitle(locale = "en") {
  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: "en",
    messages,
  });
  return mount(PageTitle, { global: { plugins: [i18n, pinia] } });
}

describe("PageTitle", () => {
  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it("always renders the site label", () => {
    const wrapper = mountPageTitle();

    expect(wrapper.find("#page-title-label").text()).toBe(
      "Election Verification Site",
    );
  });

  it("does not render the election name when no election is loaded", () => {
    const wrapper = mountPageTitle();

    expect(wrapper.find("h1").exists()).toBe(false);
  });

  it("does not render the election name when the election has no title", () => {
    useConfigStore().election = {} as any;
    const wrapper = mountPageTitle();

    expect(wrapper.find("h1").exists()).toBe(false);
  });

  it("does not render the election name when there is no title for the locale", () => {
    useConfigStore().election = { title: { en: "General Election" } } as any;
    const wrapper = mountPageTitle("da");

    expect(wrapper.find("h1").exists()).toBe(false);
  });

  it("renders the election name for the current locale", () => {
    useConfigStore().election = {
      title: { en: "General Election", da: "Folketingsvalg" },
    } as any;

    expect(mountPageTitle("en").find("#page-title-name").text()).toBe(
      "General Election",
    );
    expect(mountPageTitle("da").find("#page-title-name").text()).toBe(
      "Folketingsvalg",
    );
  });

  it("updates when the election changes", async () => {
    const wrapper = mountPageTitle();
    expect(wrapper.find("h1").exists()).toBe(false);

    useConfigStore().election = { title: { en: "Late Election" } } as any;
    await wrapper.vm.$nextTick();

    expect(wrapper.find("h1").text()).toBe("Late Election");
  });
});
