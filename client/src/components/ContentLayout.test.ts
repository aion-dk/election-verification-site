import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import ContentLayout from "./ContentLayout.vue";
import { createI18n } from "vue-i18n";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

test("renders correctly", async () => {
  const wrapper = mount(ContentLayout, {
    props: {
      helpTitle: "title",
      helpTitleStrong: "strong",
    },
    slots: {
      action: "something",
      help: "sidebar",
    },
    global: {
      plugins: [i18n],
    },
  });

  expect(wrapper.find("section").text()).toContain("something");
  expect(wrapper.find("h5").text()).toContain("titlestrong");
  expect(wrapper.find("aside").text()).toContain("sidebar");
  expect(wrapper.html()).to.not.contain("ContentLayout__Breadcrumb");
  expect(wrapper.html()).to.not.contain("ContentLayout__Brand_Logo");

  await wrapper.setProps({ breadcrumb: "home" });

  expect(wrapper.find(".ContentLayout__Breadcrumb").text()).to.contain("home");

  await wrapper.setProps({ logo: "imageurl.com" });

  expect(wrapper.find("img").attributes().src).to.contain("imageurl.com");
});
