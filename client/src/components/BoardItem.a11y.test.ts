import { test, expect } from "vitest";
import { axe } from "vitest-axe";
import BoardItem from "./BoardItem.vue";
import { mountForA11y } from "../test-utils/a11y";

test("has no accessibility violations in default state", async () => {
  const wrapper = await mountForA11y(BoardItem, {
    props: {
      item: {
        type: "VoterSessionItem",
        address:
          "00dd8a9310e8d572e53fb297e96758ded086f424df7ad63dd9ee5639ce13d281",
      },
    },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
