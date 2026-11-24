import "../test-utils/setupConfig";
import { describe, it, expect, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia } from "pinia";
import type { BasicElectionStatus } from "@/Types";
import useConfigStore from "@/stores/useConfigStore";
import { fallbackMessages } from "../assets/translations";
import HelpView from "./HelpView.vue";

const en = JSON.parse(JSON.stringify(fallbackMessages.en));
const enQuestions = en.views.faq.questions;

// A second locale with distinguishable FAQ content to verify locale switching.
const xx = JSON.parse(JSON.stringify(fallbackMessages.en));
xx.views.faq.questions = {
  ballot_tester: {
    q1: { title: "XX tester question", paragraphs: { p1: "XX tester" } },
  },
  ballot_tracker: {
    q1: { title: "XX tracker question", paragraphs: { p1: "XX tracker" } },
  },
  logs: {
    q1: { title: "XX logs question", paragraphs: { p1: "XX logs" } },
  },
  other: {
    q1: {
      title: "XX other question",
      paragraphs: { p1: "<strong>XX</strong> other", p2: "second" },
    },
  },
};

const stubs = { AVIcon: { template: "<span />" } };

function titlesOf(questions: Record<string, { title: string }>) {
  return Object.values(questions).map((q) => q.title);
}

function mountHelpView(status: Partial<BasicElectionStatus> = null) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: "en",
    messages: { en, xx },
    missingWarn: false,
    fallbackWarn: false,
  });
  const configStore = useConfigStore();
  if (status) configStore.setElectionStatus(status as BasicElectionStatus);

  const wrapper = mount(HelpView, {
    global: { plugins: [i18n, pinia], stubs },
  });
  return { wrapper, i18n, configStore };
}

function renderedTitles(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll(".HelpView__FAQ_Title").map((el) => el.text());
}

describe("HelpView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders the title, description and help paragraphs", async () => {
    const { wrapper } = mountHelpView();
    await flushPromises();

    expect(wrapper.find("#help-title").text()).toBe(en.views.faq.title);
    expect(wrapper.find("#help-description").text()).toBe(
      en.views.faq.description,
    );
    expect(wrapper.find("#help-help-p1").text()).toBe(en.views.faq.help.p1);
    expect(wrapper.find("#help-help-p2").text()).toBe(en.views.faq.help.p2);
    expect(wrapper.find("#help-help-p3").text()).toBe(en.views.faq.help.p3);
    expect(wrapper.find("#content-layout-brand-logo").exists()).toBe(false);
  });

  it("opens on the ballot tester tab by default", async () => {
    const { wrapper } = mountHelpView();
    await flushPromises();

    const testerTab = wrapper.find("#help-tab-tester");
    expect(testerTab.exists()).toBe(true);
    expect(testerTab.classes()).toContain("HelpView__Category_Button_Active");
    expect(wrapper.find("#help-tab-tracker").classes()).not.toContain(
      "HelpView__Category_Button_Active",
    );
    expect(renderedTitles(wrapper)).toEqual(
      titlesOf(enQuestions.ballot_tester),
    );
  });

  it.each([
    ["tracker", "ballot_tracker"],
    ["logs", "logs"],
    ["other", "other"],
    ["tester", "ballot_tester"],
  ])("switches to the %s tab when clicked", async (tab, questionsKey) => {
    const { wrapper } = mountHelpView();
    await flushPromises();

    // Start from a different tab so the switch is observable.
    await wrapper
      .find(tab === "other" ? "#help-tab-logs" : "#help-tab-other")
      .trigger("click");
    await wrapper.find(`#help-tab-${tab}`).trigger("click");

    expect(wrapper.find(`#help-tab-${tab}`).classes()).toContain(
      "HelpView__Category_Button_Active",
    );
    expect(wrapper.findAll(".HelpView__Category_Button_Active")).toHaveLength(
      1,
    );
    expect(renderedTitles(wrapper)).toEqual(
      titlesOf(enQuestions[questionsKey]),
    );
  });

  it("expands a question to show its paragraphs as HTML", async () => {
    const { wrapper, i18n } = mountHelpView();
    await flushPromises();
    i18n.global.locale.value = "xx";
    await flushPromises();
    await wrapper.find("#help-tab-other").trigger("click");

    const section = wrapper.find("#help-faq-q1");
    expect(section.find(".HelpView__FAQ_Text").exists()).toBe(false);
    await section.trigger("click");

    const paragraphs = wrapper.findAll("#help-faq-q1 .HelpView__FAQ_Text");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].html()).toContain("<strong>XX</strong> other");
    expect(paragraphs[1].text()).toBe("second");
  });

  it("starts on the tracker tab and hides the tester tab for the Canadian challenge", async () => {
    const { wrapper } = mountHelpView({ canadianChallenge: true });
    await flushPromises();

    expect(wrapper.find("#help-tab-tester").exists()).toBe(false);
    expect(wrapper.find("#help-tab-tracker").classes()).toContain(
      "HelpView__Category_Button_Active",
    );
    expect(renderedTitles(wrapper)).toEqual(
      titlesOf(enQuestions.ballot_tracker),
    );
  });

  it("moves from the tester tab to the tracker tab when the Canadian challenge is enabled later", async () => {
    const { wrapper, configStore } = mountHelpView({
      canadianChallenge: false,
    });
    await flushPromises();
    expect(wrapper.find("#help-tab-tester").classes()).toContain(
      "HelpView__Category_Button_Active",
    );

    configStore.setElectionStatus({
      canadianChallenge: true,
    } as BasicElectionStatus);
    await flushPromises();

    expect(wrapper.find("#help-tab-tester").exists()).toBe(false);
    expect(wrapper.find("#help-tab-tracker").classes()).toContain(
      "HelpView__Category_Button_Active",
    );
    expect(renderedTitles(wrapper)).toEqual(
      titlesOf(enQuestions.ballot_tracker),
    );
  });

  it("keeps the current non-tester tab when the Canadian challenge is enabled later", async () => {
    const { wrapper, configStore } = mountHelpView();
    await flushPromises();
    await wrapper.find("#help-tab-logs").trigger("click");

    configStore.setElectionStatus({
      canadianChallenge: true,
    } as BasicElectionStatus);
    await flushPromises();

    expect(wrapper.find("#help-tab-logs").classes()).toContain(
      "HelpView__Category_Button_Active",
    );
    expect(renderedTitles(wrapper)).toEqual(titlesOf(enQuestions.logs));
  });

  it("does not switch tabs when the Canadian challenge is disabled later", async () => {
    const { wrapper, configStore } = mountHelpView({
      canadianChallenge: true,
    });
    await flushPromises();
    await wrapper.find("#help-tab-other").trigger("click");

    configStore.setElectionStatus({
      canadianChallenge: false,
    } as BasicElectionStatus);
    await flushPromises();

    expect(wrapper.find("#help-tab-tester").exists()).toBe(true);
    expect(wrapper.find("#help-tab-other").classes()).toContain(
      "HelpView__Category_Button_Active",
    );
  });

  it("reloads the questions of the current tab when the locale changes", async () => {
    const { wrapper, i18n } = mountHelpView();
    await flushPromises();
    await wrapper.find("#help-tab-logs").trigger("click");
    expect(renderedTitles(wrapper)).toEqual(titlesOf(enQuestions.logs));

    i18n.global.locale.value = "xx";
    await flushPromises();

    expect(wrapper.find("#help-tab-logs").classes()).toContain(
      "HelpView__Category_Button_Active",
    );
    expect(renderedTitles(wrapper)).toEqual(["XX logs question"]);

    await wrapper.find("#help-tab-tester").trigger("click");
    expect(renderedTitles(wrapper)).toEqual(["XX tester question"]);
  });

  it("shows the election logo in the help panel when configured", async () => {
    const { wrapper } = mountHelpView({
      theme: { logo: "https://example.com/logo.png" },
    } as Partial<BasicElectionStatus>);
    await flushPromises();

    expect(wrapper.find("#content-layout-brand-logo").attributes("src")).toBe(
      "https://example.com/logo.png",
    );
  });
});
