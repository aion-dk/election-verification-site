import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import DropDown from "./DropDown.vue";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

const options = [
  { value: "en", display: "English", selected: false },
  { value: "da", display: "Dansk", selected: true },
  { value: "es", display: "", selected: false },
];

function mountDropDown(props: Record<string, unknown> = {}) {
  return mount(DropDown, {
    props: { options, ...props },
    global: { plugins: [i18n] },
  });
}

describe("DropDown", () => {
  it("renders an option per entry, falling back to the value when there is no display text", () => {
    const wrapper = mountDropDown();
    const rendered = wrapper.findAll("option");

    expect(rendered).toHaveLength(3);
    expect(rendered.map((o) => o.attributes("value"))).toEqual([
      "en",
      "da",
      "es",
    ]);
    expect(rendered.map((o) => o.text())).toEqual(["English", "Dansk", "es"]);
  });

  it("marks the selected option", () => {
    const wrapper = mountDropDown();
    const select = wrapper.find("select").element as HTMLSelectElement;

    expect(select.value).toBe("da");
    expect(
      (wrapper.findAll("option")[1].element as HTMLOptionElement).selected,
    ).toBe(true);
  });

  it("emits change with the selected value", async () => {
    const wrapper = mountDropDown();

    await wrapper.find("select").setValue("es");

    expect(wrapper.emitted("change")).toEqual([["es"]]);
  });

  it("is enabled by default and can be disabled", async () => {
    const wrapper = mountDropDown();
    expect(wrapper.find("select").attributes("disabled")).toBeUndefined();

    await wrapper.setProps({ disabled: true });
    expect(wrapper.find("select").attributes("disabled")).toBeDefined();
  });

  it("uses a visually hidden label and derived ids when an id is given", () => {
    const wrapper = mountDropDown({ id: "lang" });

    expect(wrapper.find("div").attributes("id")).toBe("lang");
    const label = wrapper.find("label");
    expect(label.exists()).toBe(true);
    expect(label.classes()).toContain("visually-hidden");
    expect(label.attributes("for")).toBe("lang-select");
    expect(label.text()).toBe("Switch language");

    const select = wrapper.find("select");
    expect(select.attributes("id")).toBe("lang-select");
    expect(select.attributes("aria-label")).toBeUndefined();
    expect(wrapper.findAll("option").map((o) => o.attributes("id"))).toEqual([
      "lang-option-en",
      "lang-option-da",
      "lang-option-es",
    ]);
  });

  it("uses an aria-label and no ids when no id is given", () => {
    const wrapper = mountDropDown();

    expect(wrapper.find("div").attributes("id")).toBeUndefined();
    expect(wrapper.find("label").exists()).toBe(false);

    const select = wrapper.find("select");
    expect(select.attributes("id")).toBeUndefined();
    expect(select.attributes("aria-label")).toBe("Switch language");
    wrapper
      .findAll("option")
      .forEach((o) => expect(o.attributes("id")).toBeUndefined());
  });
});
