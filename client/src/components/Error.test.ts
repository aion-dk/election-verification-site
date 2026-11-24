import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import ErrorComponent from "./Error.vue";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

const AVIcon = {
  name: "AVIcon",
  props: ["icon"],
  template: "<span class='icon-stub' />",
};

function mountError(errorPath: string) {
  return mount(ErrorComponent, {
    props: { errorPath },
    global: { plugins: [i18n], stubs: { AVIcon } },
  });
}

describe("Error", () => {
  it("renders the translated title and description for the error path", () => {
    const wrapper = mountError("verify.invalid_code");

    expect(wrapper.find(".Error__Title").text()).toBe("Ballot code not found");
    expect(wrapper.find(".Error__Description").text()).toBe(
      "Verify you have entered the ballot code correctly. Be sure to match case and try again.",
    );
  });

  it("derives DOM-safe ids by replacing dots in the error path", () => {
    const wrapper = mountError("verify.invalid_code");

    expect(wrapper.find(".Error").attributes("id")).toBe(
      "error-verify-invalid_code",
    );
    expect(wrapper.find("#error-title-verify-invalid_code").exists()).toBe(
      true,
    );
    expect(wrapper.find("#error-title-text-verify-invalid_code").text()).toBe(
      "Ballot code not found",
    );
    expect(
      wrapper.find("#error-description-verify-invalid_code").exists(),
    ).toBe(true);
    expect(wrapper.findComponent(AVIcon).attributes("id")).toBe(
      "error-icon-verify-invalid_code",
    );
  });

  it("renders a warning icon hidden from assistive technology", () => {
    const wrapper = mountError("verify.invalid_code");
    const icon = wrapper.findComponent(AVIcon);

    expect(icon.props("icon")).toBe("triangle-exclamation");
    expect(icon.attributes("aria-hidden")).toBe("true");
  });

  it("falls back to the translation keys for unknown error paths", () => {
    const wrapper = mountError("unknown");

    expect(wrapper.find(".Error").attributes("id")).toBe("error-unknown");
    expect(wrapper.find(".Error__Title").text()).toBe("errors.unknown.title");
    expect(wrapper.find(".Error__Description").text()).toBe(
      "errors.unknown.description",
    );
  });
});
