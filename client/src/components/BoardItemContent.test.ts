import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import BoardItemContent from "./BoardItemContent.vue";
import { createI18n } from "vue-i18n";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };

const i18n = createI18n({ messages });

test("includes item description", async () => {
  const wrapper = mount(BoardItemContent, {
    global: {
      plugins: [i18n],
    },
    props: {
      item: {
        type: "VoterSessionItem",
        address:
          "00dd8a9310e8d572e53fb297e96758ded086f424df7ad63dd9ee5639ce13d281",
      },
    },
  });
  expect(wrapper.text()).toContain("A voter has authenticated");
});

test("ThresholdConfigItem includes encryption key identifier", async () => {
  const wrapper = mount(BoardItemContent, {
    global: {
      plugins: [i18n],
    },
    props: {
      item: {
        type: "ThresholdConfigItem",
        address:
          "00dd8a9310e8d572e53fb297e96758ded086f424df7ad63dd9ee5639ce13d281",
        content: {
          encryptionKey: "abcdef123",
        },
      },
    },
  });
  expect(wrapper.text()).toContain("cdef123");
});
