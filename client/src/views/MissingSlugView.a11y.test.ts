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

test("MissingSlugView has no accessibility violations", async () => {
  const wrapper = await mountMissingSlugView();
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
