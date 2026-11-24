import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import type { LatestConfigItems } from "@/Types";
import useConfigStore from "@/stores/useConfigStore";
import useBoardStore from "@/stores/useBoardStore";
import { fallbackMessages } from "../assets/translations";

const { apiGetMock, routerPushMock } = vi.hoisted(() => ({
  apiGetMock: vi.fn(),
  routerPushMock: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  api: { get: apiGetMock },
  options: { baseURL: "http://dbb.test" },
}));

vi.mock("@/router", () => ({
  default: { push: routerPushMock },
}));

const LogsView = (await import("./LogsView.vue")).default;

const en = JSON.parse(JSON.stringify(fallbackMessages.en));
const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: { en },
  missingWarn: false,
  fallbackWarn: false,
});

const stubs = {
  AVIcon: { template: "<span />" },
  AVTooltip: { props: ["text"], template: "<span>{{ text }}</span>" },
  BoardItem: {
    props: ["item"],
    template: '<div class="board-item-stub">{{ item.address }}</div>',
  },
};

const CONFIG_ITEM_TYPES = [
  "ElectionCommitteeConfigItem",
  "VoterAuthorizationConfigItem",
  "VotingRoundConfigItem",
  "ThresholdConfigItem",
  "BallotConfigItem",
  "ContestConfigItem",
  "SegmentsConfigItem",
  "ElectionConfigItem",
  "GenesisItem",
];

function boardResponse(meta: Record<string, number | null>) {
  return {
    data: {
      items: [
        { type: "GenesisItem", address: "addr-1" },
        { type: "VoterSessionItem", address: "addr-2" },
      ],
      meta,
    },
  };
}

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/logs/:page?",
        name: "LogsView",
        component: { template: "<div />" },
      },
    ],
  });
}

interface MountOptions {
  path?: string;
  boardSlug?: string | null;
  electionCommittee?: boolean;
  errorHandler?: (err: unknown) => void;
}

async function mountLogsView({
  path = "/en/org_slug/election_slug/logs",
  boardSlug = "board-slug",
  electionCommittee = false,
  errorHandler,
}: MountOptions = {}) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const configStore = useConfigStore();
  configStore.latestConfig = {
    genesisConfig: { content: { electionCommittee } },
  } as unknown as LatestConfigItems;
  if (boardSlug) configStore.setBoardSlug(boardSlug);
  const boardStore = useBoardStore();

  const router = createTestRouter();
  await router.push(path);
  await router.isReady();

  const wrapper = mount(LogsView, {
    global: {
      plugins: [i18n, pinia, router],
      stubs,
      config: errorHandler ? { errorHandler } : {},
    },
  });
  await flushPromises();
  return { wrapper, router, configStore, boardStore };
}

function lastRequestedUrl() {
  return apiGetMock.mock.lastCall[0];
}

describe("LogsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiGetMock.mockResolvedValue(
      boardResponse({ prev_page: null, next_page: 2, total_pages: 5 }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the first page of the board on mount and renders its items", async () => {
    const { wrapper, boardStore } = await mountLogsView();

    expect(apiGetMock).toHaveBeenCalledTimes(1);
    expect(apiGetMock).toHaveBeenCalledWith(
      "/board-slug/board?page=1&filter[hide_pending]=false",
    );
    expect(boardStore.currentPage).toBe(1);
    const items = wrapper.findAll(".board-item-stub");
    expect(items.map((i) => i.text())).toEqual(["addr-1", "addr-2"]);
    expect(wrapper.find("#logs-current-page").text()).toBe("1");
    expect(wrapper.find("#logs-total-pages").text()).toBe("5");
  });

  it("loads the page given in the route", async () => {
    await mountLogsView({ path: "/en/org_slug/election_slug/logs/3" });

    expect(apiGetMock).toHaveBeenCalledWith(
      "/board-slug/board?page=3&filter[hide_pending]=false",
    );
  });

  it("does not request the board when no board slug is configured", async () => {
    const { wrapper } = await mountLogsView({ boardSlug: null });

    expect(apiGetMock).not.toHaveBeenCalled();
    // Still marks the view as loaded and shows the pagination shell.
    expect(wrapper.find("#logs-pagination").exists()).toBe(true);
    expect(wrapper.findAll(".board-item-stub")).toHaveLength(0);
  });

  it("still renders the page when loading the board fails", async () => {
    const errorHandler = vi.fn();
    apiGetMock.mockRejectedValue(new Error("Network error"));

    const { wrapper } = await mountLogsView({ errorHandler });

    expect(errorHandler).toHaveBeenCalledTimes(1);
    expect(errorHandler.mock.calls[0][0]).toEqual(new Error("Network error"));
    expect(wrapper.find("#logs-transition-group").exists()).toBe(true);
    expect(wrapper.findAll(".board-item-stub")).toHaveLength(0);
  });

  it("renders static content, the board link and help texts", async () => {
    const { wrapper } = await mountLogsView();

    expect(wrapper.find("#logs-subtitle").text()).toBe(en.views.logs.subtitle);
    expect(wrapper.find("#logs-title").text()).toBe(en.views.logs.title);
    expect(wrapper.find("#logs-column-event").text()).toBe(
      en.views.logs.headers.type,
    );
    expect(wrapper.find("#logs-board-link-code").text()).toBe(
      "http://dbb.test/board-slug/board",
    );
    expect(wrapper.find("#logs-help-p1-question").text()).toBe(
      en.views.logs.help.p1.question,
    );
    expect(wrapper.find("#logs-help-p3-answer").text()).toBe(
      en.views.logs.help.p3.answer,
    );
  });

  describe("pagination", () => {
    it("disables first/previous on the first page and enables next/last", async () => {
      const { wrapper } = await mountLogsView();

      for (const id of ["#logs-first-page", "#logs-prev-page"]) {
        const button = wrapper.find(id);
        expect(button.attributes("disabled")).toBeDefined();
        expect(button.classes()).toContain("LogsView__PageLink_Disabled");
      }
      for (const id of ["#logs-next-page", "#logs-last-page"]) {
        const button = wrapper.find(id);
        expect(button.attributes("disabled")).toBeUndefined();
        expect(button.classes()).not.toContain("LogsView__PageLink_Disabled");
      }
    });

    it("disables next/last on the last page and enables first/previous", async () => {
      apiGetMock.mockResolvedValue(
        boardResponse({ prev_page: 4, next_page: null, total_pages: 5 }),
      );
      const { wrapper } = await mountLogsView({
        path: "/en/org_slug/election_slug/logs/5",
      });

      expect(wrapper.find("#logs-first-page").attributes("disabled")).toBe(
        undefined,
      );
      expect(wrapper.find("#logs-prev-page").attributes("disabled")).toBe(
        undefined,
      );
      expect(
        wrapper.find("#logs-next-page").attributes("disabled"),
      ).toBeDefined();
      expect(
        wrapper.find("#logs-last-page").attributes("disabled"),
      ).toBeDefined();
    });

    it.each([
      ["#logs-first-page", "1"],
      ["#logs-prev-page", "2"],
      ["#logs-next-page", "4"],
      ["#logs-last-page", "9"],
    ])("%s navigates to page %s", async (selector, expectedPage) => {
      apiGetMock.mockResolvedValue(
        boardResponse({ prev_page: 2, next_page: 4, total_pages: 9 }),
      );
      const { wrapper } = await mountLogsView({
        path: "/en/org_slug/election_slug/logs/3",
      });

      await wrapper.find(selector).trigger("click");

      expect(routerPushMock).toHaveBeenCalledTimes(1);
      expect(routerPushMock).toHaveBeenCalledWith(
        `/en/org_slug/election_slug/logs/${expectedPage}`,
      );
    });

    it("reloads the board when the route page changes", async () => {
      const { router } = await mountLogsView();
      apiGetMock.mockClear();

      await router.push("/en/org_slug/election_slug/logs/2");
      await flushPromises();

      expect(apiGetMock).toHaveBeenCalledWith(
        "/board-slug/board?page=2&filter[hide_pending]=false",
      );
    });
  });

  describe("filters", () => {
    it("requests configuration items only from page 1 when the checkbox is ticked", async () => {
      const { wrapper } = await mountLogsView({
        path: "/en/org_slug/election_slug/logs/3",
      });
      apiGetMock.mockClear();

      await wrapper.find("#logs-config-only-checkbox").setValue(true);
      await flushPromises();

      const expectedFilter = CONFIG_ITEM_TYPES.map(
        (t) => `&filter[type][]=${t}`,
      ).join("");
      expect(apiGetMock).toHaveBeenCalledTimes(1);
      expect(lastRequestedUrl()).toBe(
        `/board-slug/board?page=1${expectedFilter}&filter[hide_pending]=false`,
      );

      await wrapper.find("#logs-config-only-checkbox").setValue(false);
      await flushPromises();
      expect(lastRequestedUrl()).toBe(
        "/board-slug/board?page=1&filter[hide_pending]=false",
      );
    });

    it("hides the 'hide pending' filter when the election has no committee", async () => {
      const { wrapper } = await mountLogsView({ electionCommittee: false });

      expect(wrapper.find("#logs-hide-pending-checkbox").exists()).toBe(false);
    });

    it("requests the board without pending items when 'hide pending' is ticked", async () => {
      const { wrapper } = await mountLogsView({ electionCommittee: true });
      apiGetMock.mockClear();

      await wrapper.find("#logs-hide-pending-checkbox").setValue(true);
      await flushPromises();

      expect(apiGetMock).toHaveBeenCalledTimes(1);
      expect(lastRequestedUrl()).toBe(
        "/board-slug/board?page=1&filter[hide_pending]=true",
      );
    });
  });

  it("reloads the board when the configuration store changes", async () => {
    const { configStore } = await mountLogsView({ boardSlug: null });
    expect(apiGetMock).not.toHaveBeenCalled();

    configStore.setBoardSlug("late-slug");
    await flushPromises();

    expect(apiGetMock).toHaveBeenCalledWith(
      "/late-slug/board?page=1&filter[hide_pending]=false",
    );
  });

  it("falls back to the board store's current page when the route has none", async () => {
    const { configStore, boardStore } = await mountLogsView({
      boardSlug: null,
    });
    boardStore.currentPage = 7;

    configStore.setBoardSlug("board-slug");
    await flushPromises();

    expect(apiGetMock).toHaveBeenCalledWith(
      "/board-slug/board?page=7&filter[hide_pending]=false",
    );
  });

  describe("downloads", () => {
    it("navigates to the full log download", async () => {
      const location = { href: "" };
      vi.stubGlobal("location", location);
      const { wrapper } = await mountLogsView();

      await wrapper.find("#logs-download-log").trigger("click");

      expect(location.href).toBe("http://dbb.test/board-slug/download_log");
    });

    it("navigates to the attachments download", async () => {
      const location = { href: "" };
      vi.stubGlobal("location", location);
      const { wrapper } = await mountLogsView();

      await wrapper.find("#logs-download-attachments").trigger("click");

      expect(location.href).toBe(
        "http://dbb.test/board-slug/download_attachments",
      );
    });
  });
});
