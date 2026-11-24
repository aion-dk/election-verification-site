import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import MainIcon from "./MainIcon.vue";
import { mountForA11y } from "../test-utils/a11y";

test("has no accessibility violations in default state", async () => {
  const wrapper = await mountForA11y(MainIcon, {
    props: { icon: "magnifying-glass" },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
