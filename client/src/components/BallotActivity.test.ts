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
  AVIcon: {
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
      index: 0,
    },
  });
  expect(wrapper.text()).toContain("SomeType");
  expect(wrapper.text()).toContain("Me");
});

test("BallotActivity shows the expanded details once expanded", async () => {
  const wrapper = mount(BallotActivity, {
    global: {
      plugins: [i18n],
      stubs,
    },
    props: {
      activity: {
        registered_at: "2022-03-02T00:10:12+0100",
        type: "some_type",
      },
      index: 3,
    },
  });

  expect(wrapper.find("#ballot-activity-type-3").text()).toContain("SomeType");
  expect(wrapper.find("#ballot-activity-type-expanded-3").exists()).toBe(false);

  await wrapper.find("[role=button]").trigger("click");

  expect(wrapper.find("#ballot-activity-type-3").exists()).toBe(false);
  expect(wrapper.find("#ballot-activity-type-expanded-3").text()).toBe(
    "SomeType",
  );
  expect(wrapper.find("#ballot-activity-author-expanded-3").text()).toContain(
    "Me",
  );
  expect(
    wrapper.find("#ballot-activity-registered-at-expanded-3").exists(),
  ).toBe(true);
});
