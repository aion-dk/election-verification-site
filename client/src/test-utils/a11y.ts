import { mount } from "@vue/test-utils";
import type { MountingOptions } from "@vue/test-utils";
import type { Component } from "vue";
import { createI18n } from "vue-i18n";
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

interface A11yMountOptions extends Omit<Partial<MountingOptions<any>>, 'attachTo'> {
  attachTo?: boolean;
}

export async function mountForA11y(
  component: Component,
  options: A11yMountOptions = {},
) {
  const { attachTo, ...rest } = options;
  const wrapper = mount(component, {
    ...rest,
    attachTo: attachTo === false ? undefined : document.body,
    global: {
      plugins: [i18n],
      stubs: defaultStubs,
      ...rest.global,
    },
  });

  return wrapper;
}

export { i18n, defaultStubs };
