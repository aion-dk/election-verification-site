import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import TrackedBallotManager from "./TrackedBallotManager.vue";
import { mountForA11y } from "../test-utils/a11y";

test("has no accessibility violations with tracking code", async () => {
  const wrapper = await mountForA11y(TrackedBallotManager, {
    props: { trackingCode: "ABDCEF" },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
