import { beforeAll, expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import ExpandableSection from "./ExpandableSection.vue";
import { loadLocaleMessages } from "../lib/i18n";
import { fallbackMessages } from "../assets/translations";

const props = { expanded: false };
const slots = {
  collapsed: "Collapsed text",
  expanded: "Expanded text",
};
const global = {
  stubs: {
    AVIcon: {
      template: "<span />",
    },
  },
};
const options = { props, slots, global };

test("displays the collapsed text", async () => {
  const wrapper = mount(ExpandableSection, options);
  expect(wrapper.text()).toContain("Collapsed text");
});

test("displays the expanded text", async () => {
  props.expanded = true;
  const wrapper = mount(ExpandableSection, options);
  expect(wrapper.text()).toContain("Expanded text");
});

// ExpandableSection translates through the app-wide i18n instance, which only
// ships offline messages until the locale is loaded at runtime.
beforeAll(async () => {
  await loadLocaleMessages("en", fallbackMessages.en);
});

const collapsedOptions = { props: { expanded: false }, slots, global };

test("toggles between collapsed and expanded on click", async () => {
  const wrapper = mount(ExpandableSection, collapsedOptions);
  const section = wrapper.find("[role=button]");

  expect(section.attributes("aria-expanded")).toBe("false");
  expect(section.classes()).not.toContain("ExpandableSection--expanded");
  expect(wrapper.find(".visually-hidden").text()).toBe("Click to read more");
  expect(wrapper.find(".ExpandableSection__Content").exists()).toBe(false);

  await section.trigger("click");

  expect(section.attributes("aria-expanded")).toBe("true");
  expect(section.classes()).toContain("ExpandableSection--expanded");
  expect(wrapper.find(".visually-hidden").text()).toBe("Click to read less");
  expect(wrapper.find(".ExpandableSection__Line").exists()).toBe(false);
  expect(wrapper.find(".ExpandableSection__Content").text()).toBe(
    "Expanded text",
  );

  await section.trigger("click");

  expect(section.attributes("aria-expanded")).toBe("false");
  expect(wrapper.find(".visually-hidden").text()).toBe("Click to read more");
  expect(wrapper.find(".ExpandableSection__Line").text()).toBe(
    "Collapsed text",
  );
});

test("toggles with the Enter and Space keys", async () => {
  const wrapper = mount(ExpandableSection, collapsedOptions);
  const section = wrapper.find("[role=button]");

  await section.trigger("keydown", { key: "Enter" });
  expect(section.attributes("aria-expanded")).toBe("true");

  await section.trigger("keydown", { key: " " });
  expect(section.attributes("aria-expanded")).toBe("false");

  await section.trigger("keydown", { key: "a" });
  expect(section.attributes("aria-expanded")).toBe("false");
});

test("is focusable", () => {
  const wrapper = mount(ExpandableSection, collapsedOptions);

  expect(wrapper.find("[role=button]").attributes("tabindex")).toBe("0");
});
