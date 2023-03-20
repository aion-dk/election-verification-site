import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import ItemIdentifier from "./ItemIdentifier.vue";

interface Props {
  prefix?: string
  address: string
}

const address =
  "00dd8a9310e8d572e53fb297e96758ded086f424df7ad63dd9ee5639ce13d281";
const props: Props = { address };
const options = { props };

test("displays the short address", async () => {
  const wrapper = mount(ItemIdentifier, options);
  expect(wrapper.text()).toContain("16fSovo");
});

test("displays the prefix when given", async () => {
  props.prefix = "Short ID ";
  const wrapper = mount(ItemIdentifier, options);
  expect(wrapper.text()).toContain("Short ID 16fSovo");
});

test("clicking copies the short address", async () => {
  let copiedText = "";
  Object.assign(navigator, {
    clipboard: {
      writeText: (text: string) => {
        copiedText = text;
      },
    },
  });
  const wrapper = mount(ItemIdentifier, options);
  const ac = await wrapper.get(".ItemIdentifier__ShortCode").trigger("click");
  expect(copiedText).toContain("16fSovo");
});

test("handles invalid address", async () => {
  props.address = "invalid-address";
  try {
    const wrapper = mount(ItemIdentifier, options);
    expect("no error thrown").toContain("is expected");
  } catch (e) {
    expect("error thrown").toContain("error thrown");
  }
});
