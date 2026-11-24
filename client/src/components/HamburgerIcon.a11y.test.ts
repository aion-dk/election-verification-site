import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import HamburgerIcon from "./HamburgerIcon.vue";
import { mountForA11y } from "../test-utils/a11y";

test("has no accessibility violations in default state", async () => {
  const wrapper = await mountForA11y(HamburgerIcon, {
    props: { stroke: "white" },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
