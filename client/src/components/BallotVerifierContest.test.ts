import "../test-utils/setupConfig";
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import useConfigStore from "@/stores/useConfigStore";
import BallotVerifierContest from "./BallotVerifierContest.vue";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };

const AVPileSummary = {
  name: "AVPileSummary",
  props: ["contest", "selectionPile", "pileIndex", "totalPiles", "activeState"],
  template: "<div class='pile-summary-stub' />",
};

const contestWithQuestion = {
  reference: "contest-1",
  title: { en: "Mayor", da: "Borgmester" },
  question: { en: "Who should be mayor?", da: "Hvem skal være borgmester?" },
  options: [],
};

const contestWithoutQuestion = {
  reference: "contest-2",
  title: { en: "Council", da: "Byråd" },
  options: [],
};

const piles = [
  { multiplier: 1, optionSelections: [{ reference: "opt-1" }] },
  { multiplier: 2, optionSelections: [{ reference: "opt-2" }] },
];

let pinia: Pinia;

function mountContest(reference: string, locale = "en") {
  const i18n = createI18n({ locale, messages });
  return mount(BallotVerifierContest, {
    props: {
      contestSelection: { reference, piles } as any,
    },
    global: {
      plugins: [i18n, pinia],
      stubs: { AVPileSummary },
    },
  });
}

describe("BallotVerifierContest", () => {
  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    const configStore = useConfigStore();
    configStore.latestConfig = {
      contestConfigs: {
        "contest-1": { content: contestWithQuestion },
        "contest-2": { content: contestWithoutQuestion },
      },
    } as any;
  });

  it("renders the contest title in the current locale", () => {
    const wrapper = mountContest("contest-1");

    const title = wrapper.find("#contest-title-contest-1");
    expect(title.text()).toBe("Mayor");
    expect(wrapper.find("#ballot-verifier-contest-contest-1").exists()).toBe(
      true,
    );
  });

  it("uses the i18n locale to pick translations", () => {
    const wrapper = mountContest("contest-1", "da");

    expect(wrapper.find("#contest-title-contest-1").text()).toBe("Borgmester");
    expect(wrapper.find("#contest-question-contest-1").text()).toBe(
      "Hvem skal være borgmester?",
    );
  });

  it("renders the contest question when present", () => {
    const wrapper = mountContest("contest-1");

    expect(wrapper.find("#contest-question-contest-1").text()).toBe(
      "Who should be mayor?",
    );
  });

  it("does not render a question when the contest has none", () => {
    const wrapper = mountContest("contest-2");

    expect(wrapper.find("#contest-question-contest-2").exists()).toBe(false);
    expect(wrapper.find("p").exists()).toBe(false);
    expect((wrapper.vm as any).contestQuestion).toBeUndefined();
  });

  it("renders one pile summary per selection pile with the right props", () => {
    const wrapper = mountContest("contest-1");

    const summaries = wrapper.findAllComponents(AVPileSummary);
    expect(summaries).toHaveLength(2);

    summaries.forEach((summary, index) => {
      expect(summary.props("contest")).toEqual(contestWithQuestion);
      expect(summary.props("selectionPile")).toEqual(piles[index]);
      expect(summary.props("pileIndex")).toBe(index);
      expect(summary.props("totalPiles")).toBe(2);
      expect(summary.props("activeState")).toBe("summary");
    });

    expect(wrapper.find("#contest-piles-contest-1-0").exists()).toBe(true);
    expect(wrapper.find("#contest-piles-contest-1-1").exists()).toBe(true);
  });
});
