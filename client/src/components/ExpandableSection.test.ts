import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import ExpandableSection from "./ExpandableSection.vue";

const props = { expanded: false };
const slots = {
  collapsed: "Collapsed text",
  expanded: "Expanded text",
};
const options = { props, slots };

test("displays the collapsed text", async () => {
  const wrapper = mount(ExpandableSection, options);
  expect(wrapper.text()).toContain("Collapsed text");
});

test("displays the expanded text", async () => {
  props.expanded = true;
  const wrapper = mount(ExpandableSection, options);
  expect(wrapper.text()).toContain("Expanded text");
});
