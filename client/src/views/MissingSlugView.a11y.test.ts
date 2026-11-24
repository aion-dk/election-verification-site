import { test, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { defineComponent, h } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { mountForA11y } from "../test-utils/a11y";

vi.mock("@/router", () => ({ default: { push: vi.fn() } }));

const MissingSlugView = (await import("./MissingSlugView.vue")).default;

const Wrapper = defineComponent({
  setup() {
    return () => h("main", [h(MissingSlugView)]);
  },
});

async function mountMissingSlugView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:locale", component: { template: "<div />" } }],
  });
  await router.push("/en");
  await router.isReady();

  return mountForA11y(Wrapper, {
    global: { plugins: [router] },
  });
}

test("MissingSlugView has no accessibility violations besides the known missing label", async () => {
  const wrapper = await mountMissingSlugView();
  const results = await axe(wrapper.element, {
    rules: { label: { enabled: false } },
  });
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

// KNOWN ISSUE: the election slug text input has no associated <label>,
// aria-label or title (WCAG 1.3.1 / 4.1.2). This test documents the gap; once
// the source is fixed, delete it and drop the rule override above.
test("MissingSlugView election slug input is reported as unlabelled", async () => {
  const wrapper = await mountMissingSlugView();
  const results = await axe(wrapper.element);
  expect(results.violations.map((v) => v.id)).toEqual(["label"]);
  expect(results.violations[0].nodes.map((n) => n.target)).toEqual([
    ["#election-slug"],
  ]);
  wrapper.unmount();
});
