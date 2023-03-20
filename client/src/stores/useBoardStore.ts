import type { LatestConfigurationConfig } from "@aion-dk/js-client/dist/lib/av_client/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../lib/api";
import type { Meta } from "../Types";

export default defineStore("boardStore", () => {
  const items = ref<LatestConfigurationConfig[]>([]);
  const meta = ref<Meta>({});
  const currentPage = ref<number>(null);
  const currentFilter = ref<string[]>([]);

  const loadPage = async (slug: string, page: number, filter: string[]) => {

    if (currentPage.value === page && filter == currentFilter.value) return;

    let url = `/${slug}/board?page=${page}`;
    filter.map((f) => (url = `${url}&filter[]=${f}`));
    const { data } = await api.get(url);

    items.value = data.items;
    meta.value = data.meta;
    currentPage.value = page;
  };

  return { items, meta, loadPage, currentPage, currentFilter };
});
