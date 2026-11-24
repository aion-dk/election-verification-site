import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";

const { routerPushMock } = vi.hoisted(() => ({ routerPushMock: vi.fn() }));

vi.mock("@/router", () => ({
  default: { push: routerPushMock },
}));

const MissingSlugView = (await import("./MissingSlugView.vue")).default;

async function mountMissingSlugView(path = "/da") {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale",
        name: "MissingSlugView",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push(path);
  await router.isReady();
  return mount(MissingSlugView, { global: { plugins: [router] } });
}

describe("MissingSlugView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("explains that the election identifier is missing", async () => {
    const wrapper = await mountMissingSlugView();

    expect(wrapper.find("#missing-slug-title").text()).toBe(
      "Error: Missing election identifier",
    );
    expect(wrapper.find("#missing-slug-description").text()).toContain(
      "you must provide the election identifier",
    );
    expect(wrapper.find("#election-slug").exists()).toBe(true);
    expect(wrapper.find("#submit-election-slug").attributes("value")).toBe(
      "Continue",
    );
  });

  it("navigates to the entered election within the current locale on submit", async () => {
    const wrapper = await mountMissingSlugView("/da");

    await wrapper.find("#election-slug").setValue("my-election");
    const event = new Event("submit", { cancelable: true, bubbles: true });
    const stopPropagation = vi.spyOn(event, "stopPropagation");
    wrapper.find("#missing-slug-form").element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(stopPropagation).toHaveBeenCalled();
    expect(routerPushMock).toHaveBeenCalledTimes(1);
    expect(routerPushMock).toHaveBeenCalledWith("/da/my-election");
  });
});
