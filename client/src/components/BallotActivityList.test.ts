import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import BallotActivityList from "./BallotActivityList.vue";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  messages: {
    en: {
      components: {
        ballot_activity_list: {
          type: "Item type",
          time: "Item time",
          actor: "Item actor",
        },
        ballot_activity: {
          SessionItem: {
            author: "Bob the builder",
          },
        },
      },
    },
  },
});

const stubs = {
  DateTime: {
    template: "<span />",
  },
  AVTooltip: {
    template: "<span />",
  },
  AVIcon: {
    template: "<span />",
  },
};

test("that activities are listed", async () => {
  const wrapper = mount(BallotActivityList, {
    global: {
      plugins: [i18n],
      stubs,
    },
    props: {
      activities: [
        {
          type: "SessionItem",
          registeredAt: "2023-01-01T10:00:00+0100",
        },
      ],
    },
  });
  expect(wrapper.text()).toContain("Bob the builder");
});
