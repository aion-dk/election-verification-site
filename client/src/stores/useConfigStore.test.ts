import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import type { LatestConfigItems, OptionContent } from "@/Types";

const getMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api", () => ({ api: { get: getMock } }));

const useConfigStore = (await import("./useConfigStore")).default;

const nestedOption = {
  reference: "child-2",
  children: [{ reference: "grandchild" }],
};

const latestConfigItems = {
  electionConfig: { content: { title: { en: "Election" }, bcTimeout: 30 } },
  genesisConfig: { content: { electionCommittee: true } },
  contestConfigs: {
    contest1: {
      content: {
        reference: "contest1",
        options: [
          { reference: "opt-1" },
          {
            reference: "opt-2",
            children: [{ reference: "child-1" }, nestedOption],
          },
        ],
      },
    },
  },
} as unknown as LatestConfigItems;

function storeWithConfig(config: LatestConfigItems = latestConfigItems) {
  const store = useConfigStore();
  store.latestConfig = config;
  return store;
}

describe("useConfigStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    getMock.mockReset();
  });

  it("has sensible initial state", () => {
    const store = useConfigStore();

    expect(store.boardSlug).toBeNull();
    expect(store.latestConfig).toBeNull();
    expect(store.election).toBeNull();
    expect(store.bcTimeout).toBeUndefined();
    expect(store.electionStatus).toBeNull();
    expect(store.electionTheme).toBeNull();
    expect(store.resultsPublished).toBe(false);
    expect(store.resultsPublishedLoaded).toBe(false);
    expect(store.pageRefreshIterator).toBe(0);
  });

  it("setBoardSlug sets the board slug", () => {
    const store = useConfigStore();
    store.setBoardSlug("board-1");
    expect(store.boardSlug).toBe("board-1");
  });

  it("setElectionStatus sets the election status", () => {
    const store = useConfigStore();
    const status = { slug: "e" } as any;
    store.setElectionStatus(status);
    expect(store.electionStatus).toEqual(status);
  });

  it("setElectionTheme sets the theme", () => {
    const store = useConfigStore();
    store.setElectionTheme(":root{}");
    expect(store.electionTheme).toBe(":root{}");
  });

  it.each([true, false])(
    "setResultsPublished(%s) stores the value and marks it as loaded",
    (value) => {
      const store = useConfigStore();
      store.setResultsPublished(value);
      expect(store.resultsPublished).toBe(value);
      expect(store.resultsPublishedLoaded).toBe(true);
    },
  );

  it("pageReloaded increments the refresh iterator", () => {
    const store = useConfigStore();
    store.pageReloaded();
    store.pageReloaded();
    expect(store.pageRefreshIterator).toBe(2);
  });

  describe("loadConfig", () => {
    it("fetches the latest config for the board and sets the election", async () => {
      getMock.mockResolvedValue({ data: { items: latestConfigItems } });
      const store = useConfigStore();
      store.setBoardSlug("board-1");

      await store.loadConfig();

      expect(getMock).toHaveBeenCalledWith(
        "board-1/configuration/latest_config",
      );
      expect(store.latestConfig).toEqual(latestConfigItems);
      expect(store.latestConfig).not.toBe(latestConfigItems);
      expect(store.election).toEqual(latestConfigItems.electionConfig.content);
      expect(store.bcTimeout).toBe(30);
    });

    it("propagates request errors", async () => {
      getMock.mockRejectedValue(new Error("offline"));
      const store = useConfigStore();

      await expect(store.loadConfig()).rejects.toThrow("offline");
      expect(store.latestConfig).toBeNull();
    });
  });

  it("getContest returns the contest content", () => {
    const store = storeWithConfig();
    expect(store.getContest("contest1")).toEqual(
      latestConfigItems.contestConfigs.contest1.content,
    );
  });

  describe("getContestOption", () => {
    it.each(["opt-1", "opt-2", "child-1", "child-2", "grandchild"])(
      "finds option %s at any depth",
      (reference) => {
        const store = storeWithConfig();
        expect(store.getContestOption("contest1", reference).reference).toBe(
          reference,
        );
      },
    );

    it("returns the nested option object itself", () => {
      const store = storeWithConfig();
      expect(store.getContestOption("contest1", "child-2")).toEqual(
        nestedOption,
      );
    });

    it("returns undefined for unknown options", () => {
      const store = storeWithConfig();
      expect(store.getContestOption("contest1", "missing")).toBeUndefined();
    });

    it("throws when the option tree exceeds the maximum recursion depth", () => {
      let deepest: OptionContent = { reference: "leaf" } as OptionContent;
      for (let i = 0; i < 100; i++) {
        deepest = {
          reference: `level-${i}`,
          children: [deepest],
        } as OptionContent;
      }
      const config = {
        ...latestConfigItems,
        contestConfigs: {
          deep: { content: { reference: "deep", options: [deepest] } },
        },
      } as unknown as LatestConfigItems;
      const store = storeWithConfig(config);

      expect(() => store.getContestOption("deep", "leaf")).toThrow(
        "MAX RECURSION DEPTH FOR flattenChildren REACHED",
      );
    });
  });

  describe("usesElectionCommittee", () => {
    it("is true when the genesis config enables it", () => {
      const store = storeWithConfig();
      expect(store.usesElectionCommittee).toBe(true);
    });

    it("defaults to false when the genesis config does not define it", () => {
      const store = storeWithConfig({
        ...latestConfigItems,
        genesisConfig: { content: {} },
      } as unknown as LatestConfigItems);
      expect(store.usesElectionCommittee).toBe(false);
    });
  });
});
