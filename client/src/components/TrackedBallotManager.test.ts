import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import TrackedBallotManager from "./TrackedBallotManager.vue";
import { createI18n } from "vue-i18n";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });
const props = { trackingCode: "ABDCEF", periodicedTrackingCode: "123456" };

test("displays correctly", async () => {
  const wrapper = mount(TrackedBallotManager, {
    props,
    global: {
      plugins: [i18n],
      stubs: {
        AVIcon: {
          template: "<span />",
        },
      },
    },
  });

  expect(wrapper.text()).toContain("ABDCEF");
  await wrapper.find("[data-testid=cancel]").trigger("click");
  expect(wrapper.emitted().cancel).to.exist;
});
