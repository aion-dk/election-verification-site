import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import type { PublishedResult } from "@/Types";
import { fallbackMessages } from "../assets/translations";

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
    votingRoundName: "Round B",
    votingRoundClosingDate: "2025-03-15T00:00:00.000Z",
    publishedAt: "2025-03-20T10:00:00.000Z",
    pdf: btoa("%PDF-1.4 content B"),
  },
  {
    votingRoundName: "Round A",
    votingRoundClosingDate: "2025-01-10T00:00:00.000Z",
    publishedAt: "2025-01-15T10:00:00.000Z",
    pdf: btoa("%PDF-1.4 content A"),
  },
  {
    votingRoundName: "Round C",
    votingRoundClosingDate: "2025-06-01T00:00:00.000Z",
    publishedAt: "2025-06-05T10:00:00.000Z",
    pdf: btoa("%PDF-1.4 content C"),
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

async function mountResultsView() {
  setActivePinia(createPinia());
  const router = createTestRouter();
  await router.push("/en/org_slug/election_slug/results");
  await router.isReady();

  const wrapper = mount(ResultsView, {
    global: {
      plugins: [i18n, createPinia(), router],
    },
  });

  await flushPromises();
  return wrapper;
}

describe("ResultsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders results sorted by closing date ascending", async () => {
    getPublishedResultsMock.mockResolvedValue(mockResults);

    const wrapper = await mountResultsView();

    const titles = wrapper.findAll('[data-testid="result-card-title"]');
    expect(titles).toHaveLength(3);
    expect(titles[0].text()).toBe("Round A");
    expect(titles[1].text()).toBe("Round B");
    expect(titles[2].text()).toBe("Round C");
    wrapper.unmount();
  });

  it("renders empty state when no results are published", async () => {
    getPublishedResultsMock.mockResolvedValue([]);

    const wrapper = await mountResultsView();

    expect(wrapper.find("#results-empty").exists()).toBe(true);
    expect(wrapper.find('[data-testid="result-card-title"]').exists()).toBe(
      false,
    );
    wrapper.unmount();
  });

  it("renders error state with retry button when fetch fails", async () => {
    getPublishedResultsMock.mockRejectedValue(new Error("Network error"));

    const wrapper = await mountResultsView();

    expect(wrapper.find("#results-error").exists()).toBe(true);
    expect(wrapper.find("#results-retry").exists()).toBe(true);
    expect(wrapper.find('[data-testid="result-card-title"]').exists()).toBe(
      false,
    );
    wrapper.unmount();
  });
});
