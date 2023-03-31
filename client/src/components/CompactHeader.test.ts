import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import CompactHeader from "./CompactHeader.vue";

interface Content {
  title?: Object;
  state?: string;
  jurisdiction?: string;
}

const content: Content = {
  title: {
    en: "Funny Election",
    da: "Sjovt valg",
  },
};
const locale = "en";
const election = { content };

test("it displays the election title", () => {
  const wrapper = mount(CompactHeader, {
    props: {
      election,
      locale,
    },
  });
  expect(wrapper.text()).toContain("Funny Election");
});

test("it changes the election title when the locale changes", () => {
  const wrapper = mount(CompactHeader, {
    props: {
      election,
      locale: "da",
    },
  });
  expect(wrapper.text()).toContain("Sjovt valg");
});

test("it includes area information", () => {
  content.state = "Some state";
  const wrapper = mount(CompactHeader, {
    props: { election, locale },
  });
  expect(wrapper.text()).toContain("Some state");
});

test("it includes jurisdiction information", () => {
  content.jurisdiction = "Some jurisdiction";
  const wrapper = mount(CompactHeader, {
    props: { election, locale },
  });
  expect(wrapper.text()).toContain("Some jurisdiction");
});
