import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import BoardItem from "./BoardItem.vue";
import { createI18n } from "vue-i18n";
import { translations } from "../../e2e/mocks";

const neededStrings = JSON.stringify(
  translations.translations.en.js.ballot_verification_site
);
const messages = { en: JSON.parse(neededStrings) };

const i18n = createI18n({ messages });

test("includes short address", async () => {
  const wrapper = mount(BoardItem, {
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
  expect(wrapper.text()).toContain("16fSovo");
});

test("includes item type", async () => {
  const wrapper = mount(BoardItem, {
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
  expect(wrapper.text()).toContain("Voter session");
});

test("includes item author", async () => {
  const wrapper = mount(BoardItem, {
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
  expect(wrapper.text()).toContain("Voter");
});
