import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import Timedown from "./Timedown.vue";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

function mountTimedown(props: Record<string, unknown> = {}) {
  return mount(Timedown, { props, global: { plugins: [i18n] } });
}

const progressStyle = (wrapper: ReturnType<typeof mountTimedown>) =>
  wrapper.find(".Timedown__Progress").attributes("style");

describe("Timedown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the default ten minutes and a full progress bar", () => {
    const wrapper = mountTimedown();

    expect(wrapper.find(".Timedown__Text").text()).toBe(
      "The passkey will expire in 10:00",
    );
    expect(progressStyle(wrapper)).toContain("--width: 100%");
  });

  it("counts down once per second", async () => {
    const wrapper = mountTimedown();

    await vi.advanceTimersByTimeAsync(1000);
    expect(wrapper.text()).toContain("9:59");

    await vi.advanceTimersByTimeAsync(59_000);
    expect(wrapper.text()).toContain("9:00");
  });

  it("pads single-digit seconds and not double-digit ones", async () => {
    const wrapper = mountTimedown({ currentSeconds: 75 });
    expect(wrapper.text()).toContain("1:15");

    await vi.advanceTimersByTimeAsync(10_000);
    expect(wrapper.text()).toContain("1:05");
  });

  it("sizes the progress bar relative to maxSeconds", async () => {
    const wrapper = mountTimedown({ maxSeconds: 200, currentSeconds: 100 });
    expect(progressStyle(wrapper)).toContain("--width: 50%");

    await vi.advanceTimersByTimeAsync(50_000);
    expect(progressStyle(wrapper)).toContain("--width: 25%");
  });

  it("emits alert exactly when three minutes are left", async () => {
    const wrapper = mountTimedown({ currentSeconds: 182 });

    await vi.advanceTimersByTimeAsync(1000);
    expect(wrapper.emitted("alert")).toBeUndefined();

    await vi.advanceTimersByTimeAsync(1000);
    expect(wrapper.emitted("alert")).toHaveLength(1);
    expect(wrapper.text()).toContain("3:00");

    await vi.advanceTimersByTimeAsync(5000);
    expect(wrapper.emitted("alert")).toHaveLength(1);
    expect(wrapper.emitted("timeout")).toBeUndefined();
  });

  it("emits timeout once when reaching zero and stops counting", async () => {
    const wrapper = mountTimedown({ currentSeconds: 2 });

    await vi.advanceTimersByTimeAsync(1000);
    expect(wrapper.emitted("timeout")).toBeUndefined();

    await vi.advanceTimersByTimeAsync(1000);
    expect(wrapper.emitted("timeout")).toHaveLength(1);
    expect(wrapper.text()).toContain("0:00");

    await vi.advanceTimersByTimeAsync(5000);
    expect(wrapper.emitted("timeout")).toHaveLength(1);
    expect(wrapper.text()).toContain("0:00");
    expect(progressStyle(wrapper)).toContain("--width: 0%");
  });
});
