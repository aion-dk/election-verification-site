<script setup lang="ts">
// import CompactHeader from "../components/CompactHeader.vue";
import { options } from "../lib/api";
import useLocaleStore from "../stores/useLocaleStore";
import useConfigStore from "../stores/useConfigStore";
import useBoardStore from "../stores/useBoardStore";
import { onMounted, ref, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";
import BoardItem from "../components/BoardItem.vue";
import ContentLayout from "../components/ContentLayout.vue";
import MainIcon from "../components/MainIcon.vue";

const route = useRoute();
const localeStore = useLocaleStore();
const configStore = useConfigStore();
const boardStore = useBoardStore();
const configItemsOnly = ref<boolean>(false);

watch(configStore, () => loadPage(currentPage()));
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
  if (configStore.boardSlug) {
    boardStore.loadPage(configStore.boardSlug, page, filter());
  }
}
onMounted(() => loadPage(currentPage()));
</script>

<template>
  <ContentLayout
    :help-title="$t('views.logs.help.title')"
    :help-title-strong="$t('views.logs.help.title_strong')"
  >
    <template v-slot:action>
      <MainIcon icon="square-poll-vertical" />
      <h3 class="LogsView__Title">
        {{ $t("views.logs.title") }}
      </h3>
      <h4 class="LogsView__Subtitle">
        {{ $t("views.logs.subtitle") }}
      </h4>
      <p class="LogsView__Description">
        {{ $t("views.logs.description") }}
      </p>

      <label class="LogsView__Configuration_Only">
        <input
          type="checkbox"
          name="config-items-only"
          :value="true"
          v-model="configItemsOnly"
        />
        {{ $t("views.logs.config_only") }}
      </label>

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

      <BoardItem
        v-for="(item, key) in boardStore.items"
        :key="key"
        :item="item"
      />

      <div class="LogsView__Pagination">
        <RouterLink
          aria-label="Previous page"
          class="LogsView__PageLink"
          v-if="boardStore.meta.prev_page"
          :to="`/${localeStore.locale}/${configStore.boardSlug}/logs/${boardStore.meta.prev_page}`"
        >
          <font-awesome-icon icon="fa-solid fa-chevron-left" />
        </RouterLink>

        <span class="LogsView__PageLink">{{ boardStore.currentPage }}</span>
        <span class="LogsView__PageLink">/</span>
        <span class="LogsView__PageLink">{{
          boardStore.meta.total_pages
        }}</span>

        <RouterLink
          aria-label="Next page"
          class="LogsView__PageLink"
          v-if="boardStore.meta.next_page"
          :to="`/${localeStore.locale}/${configStore.boardSlug}/logs/${boardStore.meta.next_page}`"
        >
          <font-awesome-icon icon="fa-solid fa-chevron-right" />
        </RouterLink>
      </div>
    </template>
    <template v-slot:help> </template>
  </ContentLayout>

  <!-- <CompactHeader
      :election="configStore.election"
      :locale="localeStore.locale"
    /> -->

  <!-- <div class="LogsView__Header">
      <h2>{{ $t("views.logs.title") }}</h2>
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

    <BoardItem
      v-for="(item, key) in boardStore.items"
      :key="key"
      :item="item"
    />

    <div class="LogsView__Pagination">
      <RouterLink
        aria-label="Previous page"
        class="LogsView__PageLink"
        v-if="boardStore.meta.prev_page"
        :to="`/${localeStore.locale}/${configStore.boardSlug}/logs/${boardStore.meta.prev_page}`"
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
        :to="`/${localeStore.locale}/${configStore.boardSlug}/logs/${boardStore.meta.next_page}`"
      >
        <font-awesome-icon icon="fa-solid fa-chevron-right" />
      </RouterLink>
    </div>

    <div class="LogsView__Footer">
      <a
        class="LogsView__DownloadButton"
        :href="`${options.baseURL}/${configStore.boardSlug}/download_log`"
      >
        <font-awesome-icon icon="fa-solid fa-download" />
        <span>
          {{ $t("views.logs.download_button") }}
        </span>
      </a>
    </div> -->
</template>

<style type="text/css" scoped>
.LogsView__Title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--slate-800);
  margin: 0.5rem 0 1rem 0;
  text-align: center;
}

.LogsView__Subtitle {
  display: none;
}

.LogsView__Description {
  color: var(--slate-700);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.LogsView__Configuration_Only {
  display: flex;
  border: 2px solid var(--slate-600);
  padding: 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  color: var(--slate-900);
  margin: 0 0 2rem 0;
}

input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: var(--av-theme-background);
}

.LogsView__ColumnDescriptions {
  display: none;
}

/* .LogsView__Pagination {
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

.LogsView h2 {
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
} */
</style>
