import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import Timedown from "./Timedown.vue";
import { mountForA11y } from "../test-utils/a11y";

test("has no accessibility violations in default state", async () => {
  const wrapper = await mountForA11y(Timedown, {
    props: { maxSeconds: 600, currentSeconds: 300 },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
