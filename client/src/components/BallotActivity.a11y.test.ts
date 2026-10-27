import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import { mountForA11y } from "../test-utils/a11y";
import BallotActivity from "./BallotActivity.vue";

test("has no accessibility violations in default state", async () => {
  const wrapper = await mountForA11y(BallotActivity, {
    props: {
      activity: {
        registeredAt: "2022-03-02T00:10:12+0100",
        type: "some_type",
      },
      index: 0,
    },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
