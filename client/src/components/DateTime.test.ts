import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import DateTime from "./DateTime.vue";

const date = new Date();
date.setHours(date.getHours() - 5);

const props: any = {
  dateTime: date.toISOString(),
  timeZone: "CET",
};
const options = { props };

test("displays relative time", async () => {
  const wrapper = mount(DateTime, options);
  expect(wrapper.text()).toContain("hours ago");
});

test("displays absolute time", async () => {
  props.format = "absolute";
  props.dateTime = "2023-01-01T10:00:00+0100";
  const wrapper = mount(DateTime, options);
  expect(wrapper.text()).toContain(
    "Sunday, January 1, 2023 at 10:00 AM"
  );
});
