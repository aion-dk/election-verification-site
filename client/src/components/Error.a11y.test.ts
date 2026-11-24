import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import ErrorComponent from "./Error.vue";
import { mountForA11y } from "../test-utils/a11y";

test("has no accessibility violations in default state", async () => {
  const wrapper = await mountForA11y(ErrorComponent, {
    props: { errorPath: "verify.invalid_code" },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
