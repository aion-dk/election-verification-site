import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MainIcon from "./MainIcon.vue";

const AVIcon = {
  name: "AVIcon",
  props: ["icon"],
  template: "<i class='icon-stub' />",
};

describe("MainIcon", () => {
  it("passes the icon to AVIcon and hides it from assistive technology", () => {
    const wrapper = mount(MainIcon, {
      props: { icon: "magnifying-glass" },
      global: { stubs: { AVIcon } },
    });

    const icon = wrapper.findComponent(AVIcon);
    expect(icon.props("icon")).toBe("magnifying-glass");
    expect(icon.attributes("aria-hidden")).toBe("true");
    expect(icon.classes()).toContain("MainIcon");
    expect(wrapper.find(".main-icon").exists()).toBe(true);
  });

  it("forwards non-prop attributes to the outer wrapper only", () => {
    const wrapper = mount(MainIcon, {
      props: { icon: "lock" },
      attrs: { id: "hero-icon", class: "extra", "data-test": "x" },
      global: { stubs: { AVIcon } },
    });

    const root = wrapper.element as HTMLElement;
    expect(root.id).toBe("hero-icon");
    expect(root.classList.contains("extra")).toBe(true);
    expect(root.getAttribute("data-test")).toBe("x");

    const inner = wrapper.find(".main-icon");
    expect(inner.attributes("id")).toBeUndefined();
    expect(inner.attributes("data-test")).toBeUndefined();
    expect(wrapper.findComponent(AVIcon).attributes("id")).toBeUndefined();
  });
});
