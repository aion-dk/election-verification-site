import type { LatestConfigurationConfig } from "@aion-dk/js-client/dist/lib/av_client/types";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { api } from "@/lib/api";
import type { Meta } from "@/Types";

export default defineStore("boardStore", () => {
  const items = ref<LatestConfigurationConfig[]>([]);
  const meta = reactive<Meta>({});
  const currentPage = ref<number>(null);
  const currentFilter = ref<string[]>([]);

  const loadPage = async (slug: string, page: number, filter: string[]) => {
    if (currentPage.value === page && filter == currentFilter.value) return;

    let url = `/${slug}/board?page=${page}`;
    filter.map((f) => (url = `${url}&filter[]=${f}`));
    const { data } = await api.get(url);

    items.value = data.items;
    meta.current_page = data.meta?.current_pag;
    meta.next_page = data.meta?.next_page;
    meta.prev_page = data.meta?.prev_page;
    meta.total_count = data.meta?.total_count;
    meta.total_pages = data.meta?.total_pages;
    currentPage.value = page;
  };

  return { items, meta, loadPage, currentPage, currentFilter };
});
