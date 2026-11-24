import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import DateTime from "./DateTime.vue";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };

const AVTooltip = {
  name: "AVTooltip",
  props: ["content", "text", "position"],
  template: "<span class='tooltip-stub'>{{ text }}</span>",
};

// Monday 15 January 2024, 12:00 UTC. Tests use the default (local) time zone
// unless stated otherwise, so relative distances are independent of the host.
const DATE_TIME = "2024-01-15T12:00:00Z";

function mountDateTime(props: Record<string, unknown>, locale = "en") {
  const i18n = createI18n({ legacy: false, locale, messages });
  return mount(DateTime, {
    props: { dateTime: DATE_TIME, ...props },
    global: { plugins: [i18n], stubs: { AVTooltip } },
  });
}

describe("DateTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Two hours after DATE_TIME
    vi.setSystemTime(new Date("2024-01-15T14:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the relative time by default, with the absolute time as label", () => {
    const wrapper = mountDateTime({});
    const tooltip = wrapper.findComponent(AVTooltip);

    expect(tooltip.props("text")).toBe("2 hours ago");
    expect(tooltip.props("position")).toBe("top");
    expect(tooltip.props("content")).toContain("Monday");
    expect(tooltip.props("content")).toContain("January 15, 2024");
    expect(wrapper.find(".visually-hidden").text()).toBe(
      tooltip.props("content"),
    );
  });

  it("shows the absolute time when format is absolute, with the relative time as label", () => {
    const wrapper = mountDateTime({ format: "absolute" });
    const tooltip = wrapper.findComponent(AVTooltip);

    expect(tooltip.props("text")).toContain("Monday");
    expect(tooltip.props("text")).toContain("January 15, 2024");
    expect(tooltip.props("content")).toBe("2 hours ago");
    expect(wrapper.find(".visually-hidden").text()).toBe("2 hours ago");
  });

  it("formats in the given time zone", () => {
    const wrapper = mountDateTime({
      format: "absolute",
      timeZone: "Asia/Tokyo",
    });

    // 12:00 UTC is 21:00 in Tokyo
    expect(wrapper.findComponent(AVTooltip).props("text")).toContain("09:00");
  });

  it("computes the relative time from the real instant in any time zone", () => {
    const wrapper = mountDateTime({ timeZone: "UTC" });
    const tokyo = mountDateTime({ timeZone: "Asia/Tokyo" });

    expect(wrapper.findComponent(AVTooltip).props("text")).toBe("2 hours ago");
    expect(tokyo.findComponent(AVTooltip).props("text")).toBe("2 hours ago");
  });

  it("names the given time zone in the absolute time", () => {
    const wrapper = mountDateTime({ format: "absolute", timeZone: "UTC" });

    const text = wrapper.findComponent(AVTooltip).props("text");
    expect(text).toContain("12:00");
    expect(text).toMatch(/UTC|GMT/);
  });

  it("uses the active i18n locale for formatting", () => {
    const wrapper = mountDateTime({}, "es");

    expect(wrapper.findComponent(AVTooltip).props("text")).toBe("hace 2 horas");
    expect(wrapper.findComponent(AVTooltip).props("content")).toContain(
      "lunes",
    );
  });

  it("describes future dates relative to now", () => {
    vi.setSystemTime(new Date("2024-01-12T12:00:00Z"));
    const wrapper = mountDateTime({});

    expect(wrapper.findComponent(AVTooltip).props("text")).toBe("in 3 days");
  });

  it("declares a format validator accepting only absolute or relative", () => {
    const formatProp = (DateTime as any).props.format;

    expect(formatProp.default).toBe("relative");
    expect(formatProp.validator("absolute")).toBe(true);
    expect(formatProp.validator("relative")).toBe(true);
    expect(formatProp.validator("other")).toBe(false);
  });
});
