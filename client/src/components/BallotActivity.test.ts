import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import BallotActivity from "./BallotActivity.vue";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  messages: {
    en: {
      components: {
        ballot_activity: {
          some_type: {
            type: "SomeType",
            author: "Me",
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
};

test("BallotActivity mounts", async () => {
  const wrapper = mount(BallotActivity, {
    global: {
      plugins: [i18n],
      stubs,
    },
    props: {
      activity: {
        registeredAt: "2022-03-02T00:10:12+0100",
        type: "some_type",
      },
    },
  });
  expect(wrapper.text()).toContain("SomeType");
  expect(wrapper.text()).toContain("Me");
});
