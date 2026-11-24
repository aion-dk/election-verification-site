import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import { mountForA11y } from "../test-utils/a11y";
import BallotActivityList from "./BallotActivityList.vue";

test("has no accessibility violations with activities", async () => {
  const wrapper = await mountForA11y(BallotActivityList, {
    props: {
      activities: [
        {
          type: "SessionItem",
          registeredAt: "2023-01-01T10:00:00+0100",
        },
      ],
    },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
