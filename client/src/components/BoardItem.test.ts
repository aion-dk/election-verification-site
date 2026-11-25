import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import BoardItem from "./BoardItem.vue";
import { createI18n } from "vue-i18n";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

const stubs = {
  DateTime: {
    template: "<span />",
  },
  AVIcon: {
    template: "<span />",
  },
};

test("includes item type", async () => {
  const wrapper = mount(BoardItem, {
    global: {
      plugins: [i18n],
      stubs,
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
      stubs,
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

test("applies a type-specific class and shows details once expanded", async () => {
  const wrapper = mount(BoardItem, {
    global: {
      plugins: [i18n],
      stubs,
    },
    props: {
      item: {
        type: "VoterSessionItem",
        address: "abc123",
        registeredAt: "2022-03-02T00:10:12+0100",
      },
    },
  });

  expect(wrapper.classes()).toEqual(
    expect.arrayContaining(["BoardItem", "BoardItem--VoterSessionItem"]),
  );
  expect(wrapper.attributes("id")).toBe("board-item-abc123");
  expect(wrapper.find("#board-item-type-expanded-abc123").exists()).toBe(false);

  await wrapper.find("[role=button]").trigger("click");

  expect(wrapper.find("#board-item-type-abc123").exists()).toBe(false);
  expect(wrapper.find("#board-item-type-expanded-abc123").text()).toBe(
    "Voter session",
  );
  expect(wrapper.find("#board-item-date-expanded-abc123").text()).toContain(
    "Timestamp:",
  );
  expect(wrapper.find("#board-item-author-expanded-abc123").text()).toContain(
    "Voter",
  );
});

test("shows the meaning, and no encryption key, for regular items", async () => {
  const wrapper = mount(BoardItem, {
    global: { plugins: [i18n], stubs },
    props: { item: { type: "VoterSessionItem", address: "abc123" } },
  });

  await wrapper.find("[role=button]").trigger("click");

  expect(wrapper.find("#board-item-meaning-label-abc123").text()).toBe(
    "What does this mean?",
  );
  expect(wrapper.find("#board-item-meaning-text-abc123").text()).toBe(
    "A voter has authenticated",
  );
  expect(wrapper.find("#board-item-encryption-key-abc123").exists()).toBe(
    false,
  );
});

test("shows the last 7 characters of the encryption key for threshold config items", async () => {
  const wrapper = mount(BoardItem, {
    global: { plugins: [i18n], stubs },
    props: {
      item: {
        type: "ThresholdConfigItem",
        address: "def456",
        content: { encryptionKey: "0123456789abcdefABCDEFG" },
      },
    },
  });

  expect(wrapper.classes()).toContain("BoardItem--ThresholdConfigItem");
  await wrapper.find("[role=button]").trigger("click");

  const key = wrapper.find("#board-item-encryption-key-def456");
  expect(key.find("strong").text()).toBe("Encryption key:");
  expect(key.find("code").text()).toBe("ABCDEFG");
});
