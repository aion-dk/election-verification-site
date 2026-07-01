import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import ExpandableSection from "./ExpandableSection.vue";
import { mountForA11y } from "../test-utils/a11y";

test("has no accessibility violations when collapsed", async () => {
  const wrapper = await mountForA11y(ExpandableSection, {
    props: { expanded: false },
    slots: {
      collapsed: "Collapsed content",
      expanded: "Expanded content",
    },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("has no accessibility violations when expanded", async () => {
  const wrapper = await mountForA11y(ExpandableSection, {
    props: { expanded: true },
    slots: {
      collapsed: "Collapsed content",
      expanded: "Expanded content",
    },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
