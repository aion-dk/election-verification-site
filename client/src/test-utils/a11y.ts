import { mount } from "@vue/test-utils";
import type { MountingOptions } from "@vue/test-utils";
import type { Component } from "vue";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { expect } from "vitest";
import { toHaveNoViolations } from "vitest-axe/dist/matchers.js";
import { fallbackMessages } from "../assets/translations";

expect.extend({ toHaveNoViolations });

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };

const defaultStubs = {
  AVIcon: { template: "<span />" },
  AVTooltip: { template: "<span />" },
  DateTime: { template: "<span />" },
};

const i18n = createI18n({ messages });

interface A11yMountOptions extends Omit<
  Partial<MountingOptions<any>>,
  "attachTo"
> {
  attachTo?: boolean;
}

export async function mountForA11y(
  component: Component,
  options: A11yMountOptions = {},
) {
  const { attachTo, ...rest } = options;
  const container =
    attachTo === false ? undefined : document.createElement("div");
  if (container) {
    document.body.appendChild(container);
  }
  const wrapper = mount(component, {
    ...rest,
    attachTo: container,
    global: {
      plugins: [i18n, createPinia()],
      stubs: defaultStubs,
      ...rest.global,
    },
  });

  const originalUnmount = wrapper.unmount.bind(wrapper);
  wrapper.unmount = () => {
    originalUnmount();
    if (container && container.parentElement) {
      container.parentElement.removeChild(container);
    }
  };

  return wrapper;
}

export { i18n, defaultStubs };
