import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import DateTime from "./DateTime.vue";
import { mountForA11y } from "../test-utils/a11y";

test("has no accessibility violations in relative format", async () => {
  const wrapper = await mountForA11y(DateTime, {
    props: { dateTime: "2024-01-15T12:00:00Z", timeZone: "UTC" },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("has no accessibility violations in absolute format", async () => {
  const wrapper = await mountForA11y(DateTime, {
    props: {
      dateTime: "2024-01-15T12:00:00Z",
      timeZone: "UTC",
      format: "absolute",
    },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
