import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import ResultCard from "./ResultCard.vue";
import type { PublishedResult } from "@/Types";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:fake-url");
const revokeSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

const mockResult: PublishedResult = {
  votingRoundName: "Round 1 - General Election",
  votingRoundClosingDate: "2025-01-15T00:00:00.000Z",
  publishedAt: "2025-01-20T10:30:00.000Z",
  pdf: btoa("%PDF-1.4 fake pdf content"),
};

describe("ResultCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the voting round name as a heading", () => {
    const wrapper = mount(ResultCard, {
      props: { result: mockResult },
      global: { plugins: [i18n, createPinia()] },
    });

    expect(wrapper.find('[data-testid="result-card-title"]').text()).toBe(
      "Round 1 - General Election",
    );
    wrapper.unmount();
  });

  it("renders the published_at date", () => {
    const wrapper = mount(ResultCard, {
      props: { result: mockResult },
      global: { plugins: [i18n, createPinia()] },
    });

    const timeElement = wrapper.find("time");
    expect(timeElement.exists()).toBe(true);
    expect(timeElement.attributes("datetime")).toBe("2025-01-20T10:30:00.000Z");
    wrapper.unmount();
  });

  it("renders an object element for PDF preview", () => {
    const wrapper = mount(ResultCard, {
      props: { result: mockResult },
      global: { plugins: [i18n, createPinia()] },
    });

    const objectEl = wrapper.find('[data-testid="result-card-pdf-object"]');
    expect(objectEl.exists()).toBe(true);
    expect(objectEl.attributes("type")).toBe("application/pdf");
    expect(objectEl.attributes("data")).toBe("blob:fake-url");
    wrapper.unmount();
  });

  it("renders a download link", () => {
    const wrapper = mount(ResultCard, {
      props: { result: mockResult },
      global: { plugins: [i18n, createPinia()] },
    });

    const downloadLink = wrapper.find('[data-testid="result-card-download"]');
    expect(downloadLink.exists()).toBe(true);
    expect(downloadLink.attributes("href")).toBe("blob:fake-url");
    expect(downloadLink.attributes("download")).toBe(
      "Round 1 - General Election.pdf",
    );
    wrapper.unmount();
  });

  it("renders a fallback download link inside the object element", () => {
    const wrapper = mount(ResultCard, {
      props: { result: mockResult },
      global: { plugins: [i18n, createPinia()] },
    });

    const fallbackLink = wrapper.find(
      '[data-testid="result-card-fallback-download"]',
    );
    expect(fallbackLink.exists()).toBe(true);
    expect(fallbackLink.attributes("href")).toBe("blob:fake-url");
    wrapper.unmount();
  });

  it("revokes the object URL on unmount", () => {
    const wrapper = mount(ResultCard, {
      props: { result: mockResult },
      global: { plugins: [i18n, createPinia()] },
    });

    wrapper.unmount();
    expect(revokeSpy).toHaveBeenCalledWith("blob:fake-url");
  });
});

describe("ResultCard date formatting", () => {
  it("formats the published date for the current locale", () => {
    const wrapper = mount(ResultCard, {
      props: { result: mockResult },
      global: { plugins: [i18n, createPinia()] },
    });

    expect(wrapper.find("time").text()).toContain("January 20, 2025");
    wrapper.unmount();
  });

  it("falls back to the raw value when the date cannot be formatted", () => {
    const wrapper = mount(ResultCard, {
      props: { result: { ...mockResult, publishedAt: "not-a-date" } },
      global: { plugins: [i18n, createPinia()] },
    });

    expect(wrapper.find("time").text()).toBe("not-a-date");
    wrapper.unmount();
  });

  it("does not render a preview or download link without a PDF", () => {
    const wrapper = mount(ResultCard, {
      props: { result: { ...mockResult, pdf: "" } },
      global: { plugins: [i18n, createPinia()] },
    });

    expect(
      wrapper.find('[data-testid="result-card-pdf-object"]').exists(),
    ).toBe(false);
    expect(wrapper.find('[data-testid="result-card-download"]').exists()).toBe(
      false,
    );
    wrapper.unmount();
  });
});
