import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

const getMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api", () => ({ api: { get: getMock } }));

const useBoardStore = (await import("./useBoardStore")).default;

const items = [{ address: "a1" }, { address: "a2" }];
const meta = {
  current_page: 2,
  next_page: 3,
  prev_page: 1,
  total_count: 50,
  total_pages: 5,
};

describe("useBoardStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    getMock.mockReset();
  });

  it("starts empty", () => {
    const store = useBoardStore();

    expect(store.items).toEqual([]);
    expect(store.meta).toEqual({});
    expect(store.currentPage).toBeNull();
  });

  it("loads a page with filters and stores items and pagination", async () => {
    getMock.mockResolvedValue({ data: { items, meta } });
    const store = useBoardStore();

    await store.loadPage("board-slug", 2, ["BallotCryptogramsItem", "Vote"]);

    expect(getMock).toHaveBeenCalledWith(
      "/board-slug/board?page=2&filter[type][]=BallotCryptogramsItem&filter[type][]=Vote&filter[hide_pending]=false",
    );
    expect(store.items).toEqual(items);
    expect(store.meta.next_page).toBe(3);
    expect(store.meta.prev_page).toBe(1);
    expect(store.meta.total_count).toBe(50);
    expect(store.meta.total_pages).toBe(5);
    expect(store.meta.current_page).toBe(2);
    expect(store.currentPage).toBe(2);
  });

  it("passes the hidePending flag", async () => {
    getMock.mockResolvedValue({ data: { items: [], meta } });
    const store = useBoardStore();

    await store.loadPage("slug", 1, [], true);

    expect(getMock).toHaveBeenCalledWith(
      "/slug/board?page=1&filter[hide_pending]=true",
    );
  });

  it("handles responses without meta", async () => {
    getMock.mockResolvedValue({ data: { items } });
    const store = useBoardStore();

    await store.loadPage("slug", 4, []);

    expect(store.items).toEqual(items);
    expect(store.meta).toEqual({
      current_page: undefined,
      next_page: undefined,
      prev_page: undefined,
      total_count: undefined,
      total_pages: undefined,
    });
    expect(store.currentPage).toBe(4);
  });

  it("reloads when the page changes", async () => {
    getMock.mockResolvedValue({ data: { items, meta } });
    const store = useBoardStore();

    await store.loadPage("slug", 1, []);
    await store.loadPage("slug", 2, []);

    expect(getMock).toHaveBeenCalledTimes(2);
    expect(store.currentPage).toBe(2);
  });

  it("always fetches the page again, since the board is live data", async () => {
    const fresh = [...items, { ...items[0], address: "new-item" }];
    getMock
      .mockResolvedValueOnce({ data: { items, meta } })
      .mockResolvedValueOnce({ data: { items: fresh, meta } });
    const store = useBoardStore();

    await store.loadPage("slug", 1, []);
    await store.loadPage("slug", 1, []);

    expect(getMock).toHaveBeenCalledTimes(2);
    expect(store.items).toEqual(fresh);
  });

  it("does not reuse a page loaded for another election", async () => {
    getMock.mockResolvedValue({ data: { items, meta } });
    const store = useBoardStore();

    await store.loadPage("election-a", 1, []);
    await store.loadPage("election-b", 1, []);

    expect(getMock).toHaveBeenNthCalledWith(
      2,
      "/election-b/board?page=1&filter[hide_pending]=false",
    );
  });

  it("propagates request errors without updating state", async () => {
    getMock.mockRejectedValue(new Error("network"));
    const store = useBoardStore();

    await expect(store.loadPage("slug", 1, [])).rejects.toThrow("network");
    expect(store.items).toEqual([]);
    expect(store.currentPage).toBeNull();
  });
});
