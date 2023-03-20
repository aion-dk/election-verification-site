<script setup lang="ts">
import CompactHeader from "../components/CompactHeader.vue";
import { options } from "../lib/api";
import useLocaleStore from "../stores/useLocaleStore";
import useElectionStore from "../stores/useElectionStore";
import useBoardStore from "../stores/useBoardStore";
import { onMounted, ref, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";
import BoardItem from "../components/BoardItem.vue";

const route = useRoute();
const localeStore = useLocaleStore();
const electionStore = useElectionStore();
const boardStore = useBoardStore();
const configItemsOnly = ref<boolean>(false);

watch(electionStore, () => loadPage(currentPage()));
watch(route, () => loadPage(currentPage()));
watch(configItemsOnly, () => loadPage(1));

function currentPage() {
  return parseInt(
    (route.params.page || boardStore.currentPage || 1).toString(),
    10
  );
}

function filter() {
  if (!configItemsOnly.value) return [];

  return [
    "VoterAuthorizationConfigItem",
    "VotingRoundConfigItem",
    "ThresholdConfigItem",
    "BallotConfigItem",
    "ContestConfigItem ",
    "ContestConfigItem ",
    "SegmentsConfigItem ",
    "ElectionConfigItem ",
    "GenesisItem",
  ];
}

function loadPage(page: number) {
  if (electionStore.election.slug) {
    boardStore.loadPage(electionStore.election.slug, page, filter());
  }
}

onMounted(() => loadPage(currentPage()));
</script>

<template>
  <main class="LogsView">
    <CompactHeader
      :election="electionStore.election"
      :locale="localeStore.locale"
    />

    <div class="LogsView__Header">
      <h1>{{ $t("views.logs.title") }}</h1>
      <p>{{ $t("views.logs.intro") }}</p>
      <p>
        <label>
          <input
            type="checkbox"
            name="config-items-only"
            :value="true"
            v-model="configItemsOnly"
          />
          {{ $t("views.logs.config_only") }}
        </label>
      </p>
    </div>

    <ul class="LogsView__ColumnDescriptions">
      <li class="LogsView__ColumnDescriptions--event">
        {{ $t("components.ballot_activity_list.type") }}
      </li>
      <li class="LogsView__ColumnDescriptions--time">
        {{ $t("components.ballot_activity_list.time") }}
      </li>
      <li class="LogsView__ColumnDescriptions--identifier">
        {{ $t("components.ballot_activity_list.identifier") }}
      </li>
      <li class="LogsView__ColumnDescriptions--actor">
        {{ $t("components.ballot_activity_list.actor") }}
      </li>
    </ul>

    <div role="log">
      <BoardItem v-for="(item, key) in boardStore.items" :key="key" :item="item" />
    </div>

    <div class="LogsView__Pagination">
      <RouterLink
        aria-label="Previos page"
        class="LogsView__PageLink"
        v-if="boardStore.meta.prev_page"
        :to="`/${localeStore.locale}/${electionStore.election.slug}/logs/${boardStore.meta.prev_page}`"
      >
        <font-awesome-icon icon="fa-solid fa-chevron-left" />
      </RouterLink>

      <span class="LogsView__PageLink">{{ boardStore.currentPage }}</span>
      <span class="LogsView__PageLink">/</span>
      <span class="LogsView__PageLink">{{ boardStore.meta.total_pages }}</span>

      <RouterLink
        aria-label="Next page"
        class="LogsView__PageLink"
        v-if="boardStore.meta.next_page"
        :to="`/${localeStore.locale}/${electionStore.election.slug}/logs/${boardStore.meta.next_page}`"
      >
        <font-awesome-icon icon="fa-solid fa-chevron-right" />
      </RouterLink>
    </div>

    <div class="LogsView__Footer">
      <a
        class="LogsView__DownloadButton"
        :href="`${options.baseURL}/${electionStore.election.slug}/download_log`"
      >
        <font-awesome-icon icon="fa-solid fa-download" />
        <span>
          {{ $t("views.logs.download_button") }}
        </span>
      </a>
    </div>
  </main>
</template>

<style type="text/css" scoped>
.LogsView__Pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}

.LogsView__PageLink {
  padding: 3px;
  margin: 5px;
  text-decoration: none;
  color: inherit;
}

.LogsView__PageLink--current {
  font-weight: 700;
}

.LogsView {
  width: 900px;
  margin: auto;
  font-family: "Open Sans";
}

.LogsView__Header * {
  text-align: center;
}

.LogsView h1 {
  margin-top: 47px;
  font-weight: 600;
  font-size: 26px;
}

.LogsView p {
  margin-top: 16px;
}

.LogsView__Footer {
  text-align: center;
  margin-top: 45px;
  margin-bottom: 40px;
}

.LogsView__DownloadButton {
  text-decoration: none;
  background-color: #343a40;
  color: #fff;
  padding: 10px 43px;
  border-radius: 12px;
}

.LogsView__ColumnDescriptions {
  list-style: none;
  padding: 16px;
  margin: 0;
  display: flex;
  font-size: 14px;
}

.LogsView__ColumnDescriptions--time {
  width: 170px;
}

.LogsView__ColumnDescriptions--event {
  width: 300px;
}

.LogsView__ColumnDescriptions--identifier {
  width: 170px;
}

svg {
  margin-right: 5px;
}
</style>
