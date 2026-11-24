import "../test-utils/setupConfig";
import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import ContentLayout from "./ContentLayout.vue";
import { mountForA11y } from "../test-utils/a11y";

test("has no accessibility violations in default state", async () => {
  const wrapper = await mountForA11y(ContentLayout, {
    props: {
      helpTitle: "Help title",
      helpTitleStrong: " strong part",
    },
    slots: {
      action: "<p>Action content</p>",
      help: "<p>Help content</p>",
    },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("has no accessibility violations with breadcrumb and logo", async () => {
  const wrapper = await mountForA11y(ContentLayout, {
    props: {
      helpTitle: "Help title",
      helpTitleStrong: " strong part",
      breadcrumb: "Home > Verify",
      logo: "https://example.com/logo.png",
    },
    slots: {
      action: "<p>Action content</p>",
      help: "<p>Help content</p>",
    },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
