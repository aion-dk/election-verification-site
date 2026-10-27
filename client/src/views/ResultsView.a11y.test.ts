import "../test-utils/setupConfig";
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { toHaveNoViolations } from "vitest-axe/dist/matchers.js";
import { mount, flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { defineComponent, h } from "vue";
import type { PublishedResult } from "@/Types";
import { fallbackMessages } from "../assets/translations";

expect.extend({ toHaveNoViolations });

const getPublishedResultsMock = vi.fn();

vi.mock("@/lib/conferenceServices", () => ({
  useConferenceConnector: () => ({
    conferenceClient: { getPublishedResults: getPublishedResultsMock },
  }),
}));

const ResultsView = (await import("./ResultsView.vue")).default;

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:fake-url");
vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

const mockResults: PublishedResult[] = [
  {
    votingRoundName: "Round A",
    votingRoundClosingDate: "2025-01-10T00:00:00.000Z",
    publishedAt: "2025-01-15T10:00:00.000Z",
    pdf: btoa("%PDF-1.4 content A"),
  },
];

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/results",
        name: "ResultsView",
        component: { template: "<div />" },
      },
    ],
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  getPublishedResultsMock.mockResolvedValue(mockResults);
});

afterEach(() => {
  vi.clearAllMocks();
});

test("ResultsView has no accessibility violations with results", async () => {
  const router = createTestRouter();
  await router.push("/en/org_slug/election_slug/results");
  await router.isReady();

  const Wrapper = defineComponent({
    setup() {
      return () => h("main", [h(ResultsView)]);
    },
  });

  const wrapper = mount(Wrapper, {
    global: { plugins: [i18n, createPinia(), router] },
  });

  await flushPromises();
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("ResultsView has no accessibility violations in empty state", async () => {
  getPublishedResultsMock.mockResolvedValue([]);

  const router = createTestRouter();
  await router.push("/en/org_slug/election_slug/results");
  await router.isReady();

  const Wrapper = defineComponent({
    setup() {
      return () => h("main", [h(ResultsView)]);
    },
  });

  const wrapper = mount(Wrapper, {
    global: { plugins: [i18n, createPinia(), router] },
  });

  await flushPromises();
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("ResultsView has no accessibility violations in error state", async () => {
  getPublishedResultsMock.mockRejectedValue(new Error("Network error"));

  const router = createTestRouter();
  await router.push("/en/org_slug/election_slug/results");
  await router.isReady();

  const Wrapper = defineComponent({
    setup() {
      return () => h("main", [h(ResultsView)]);
    },
  });

  const wrapper = mount(Wrapper, {
    global: { plugins: [i18n, createPinia(), router] },
  });

  await flushPromises();
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
