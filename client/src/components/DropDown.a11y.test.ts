import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import DropDown from "./DropDown.vue";
import { mountForA11y } from "../test-utils/a11y";

const options = [
  { value: "en", display: "English", selected: true },
  { value: "da", display: "Dansk", selected: false },
];

test("has no accessibility violations with an id (visible label)", async () => {
  const wrapper = await mountForA11y(DropDown, {
    props: { id: "lang", options },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("has no accessibility violations without an id (aria-label)", async () => {
  const wrapper = await mountForA11y(DropDown, {
    props: { options, disabled: true },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
