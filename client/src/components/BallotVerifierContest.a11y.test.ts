import "../test-utils/setupConfig";
import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import { createPinia, setActivePinia } from "pinia";
import useConfigStore from "@/stores/useConfigStore";
import BallotVerifierContest from "./BallotVerifierContest.vue";
import { createI18n } from "vue-i18n";
import { mountForA11y, defaultStubs } from "../test-utils/a11y";
import { fallbackMessages } from "../assets/translations";

// The shared a11y i18n instance uses the default "en-US" locale; these
// components look up localized content by the exact locale, so use "en".
const i18n = createI18n({
  locale: "en",
  messages: { en: JSON.parse(JSON.stringify(fallbackMessages.en)) },
});

test("has no accessibility violations in default state", async () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  useConfigStore().latestConfig = {
    contestConfigs: {
      "contest-1": {
        content: {
          reference: "contest-1",
          title: { en: "Mayor" },
          question: { en: "Who should be mayor?" },
          options: [],
        },
      },
    },
  } as any;

  const wrapper = await mountForA11y(BallotVerifierContest, {
    props: {
      contestSelection: {
        reference: "contest-1",
        piles: [{ multiplier: 1, optionSelections: [] }],
      } as any,
    },
    global: {
      plugins: [i18n, pinia],
      stubs: { ...defaultStubs, AVPileSummary: { template: "<div />" } },
    },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
