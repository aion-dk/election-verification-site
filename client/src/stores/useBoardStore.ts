import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { api } from "@/lib/api";
import type { Meta, LatestConfigurationConfig } from "@/Types";

export default defineStore("boardStore", () => {
  const items = ref<LatestConfigurationConfig[]>([]);
  const meta = reactive<Meta>({});
  const currentPage = ref<number>(null);

  const loadPage = async (
    slug: string,
    page: number,
    filter: string[],
    hidePending: boolean = false,
  ) => {
    // Always fetch: the board is live data (pending items get confirmed), and
    // the same page can belong to another election or filter combination.
    let url = `/${slug}/board?page=${page}`;
    filter.forEach((f) => (url = `${url}&filter[type][]=${f}`));
    url += `&filter[hide_pending]=${hidePending}`;
    const { data } = await api.get(url);

    items.value = data.items;
    meta.current_page = data.meta?.current_page;
    meta.next_page = data.meta?.next_page;
    meta.prev_page = data.meta?.prev_page;
    meta.total_count = data.meta?.total_count;
    meta.total_pages = data.meta?.total_pages;
    currentPage.value = page;
  };

  return { items, meta, loadPage: loadPage, currentPage };
});
