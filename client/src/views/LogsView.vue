<script setup lang="ts">
import { options } from "../lib/api";
import useLocaleStore from "../stores/useLocaleStore";
import useConfigStore from "../stores/useConfigStore";
import useBoardStore from "../stores/useBoardStore";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import BoardItem from "../components/BoardItem.vue";
import ContentLayout from "../components/ContentLayout.vue";
import MainIcon from "../components/MainIcon.vue";
import router from "@/router";

const route = useRoute();
const localeStore = useLocaleStore();
const configStore = useConfigStore();
const boardStore = useBoardStore();
const configItemsOnly = ref<boolean>(false);
const disableFirst = ref<boolean>(true);
const disableLast = ref<boolean>(false);

watch(configStore, () => loadPage(currentPage()));
watch(route, () => {
  route.params.page === "1"
    ? (disableFirst.value = true)
    : (disableFirst.value = false);
  route.params.page === boardStore.meta.total_pages.toString()
    ? (disableLast.value = true)
    : (disableLast.value = false);
  loadPage(currentPage());
});
watch(configItemsOnly, () => loadPage(1));

const currentPage = () => {
  return parseInt(
    (route.params.page || boardStore.currentPage || 1).toString(),
    10
  );
};

const filter = () => {
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
};

const loadPage = (page: number) => {
  if (configStore.boardSlug) {
    boardStore.loadPage(configStore.boardSlug, page, filter());
  }
};

const navigate = (page: number) => {
  router.push(
    `/${localeStore.locale}/${configStore.boardSlug}/logs/${page.toString()}`
  );
};

const downloadLog = () => {
  window.location.href = `${options.baseURL}/${configStore.boardSlug}/download_log`;
};

onMounted(() => loadPage(currentPage()));
</script>

<template>
  <ContentLayout
    :help-title="$t('views.logs.help.title')"
    :help-title-strong="$t('views.logs.help.title_strong')"
    :logo="configStore.electionStatus?.theme?.logo"
  >
    <template v-slot:action>
      <MainIcon icon="square-poll-vertical" />
      <h3 class="LogsView__Subtitle">
        {{ $t("views.logs.subtitle") }}
      </h3>
      <h4 class="LogsView__Title">
        {{ $t("views.logs.title") }}
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
          <span class="LogsView__Tooltip">
            <tooltip hover placement="right">
              <template #default>
                {{ $t("views.logs.headers.type") }}
                <AVIcon
                  icon="circle-question"
                  class="LogsView__Tooltip_Icon"
                  aria-hidden="true"
                />
              </template>

              <template #content>
                <span id="tracking-code-tooltip">
                  {{ $t("views.logs.headers.type_tooltip") }}
                </span>
              </template>
            </tooltip>
          </span>
        </li>
        <li class="LogsView__ColumnDescriptions--time">
          <span class="LogsView__Tooltip">
            <tooltip hover placement="right">
              <template #default>
                {{ $t("views.logs.headers.time") }}
                <AVIcon
                  icon="circle-question"
                  class="LogsView__Tooltip_Icon"
                  aria-hidden="true"
                />
              </template>

              <template #content>
                <span id="tracking-code-tooltip">
                  {{ $t("views.logs.headers.time_tooltip") }}
                </span>
              </template>
            </tooltip>
          </span>
        </li>
        <li class="LogsView__ColumnDescriptions--actor">
          <span class="LogsView__Tooltip">
            <tooltip hover placement="right">
              <template #default>
                {{ $t("views.logs.headers.actor") }}
                <AVIcon
                  icon="circle-question"
                  class="LogsView__Tooltip_Icon"
                  aria-hidden="true"
                />
              </template>

              <template #content>
                <span id="tracking-code-tooltip">
                  {{ $t("views.logs.headers.actor_tooltip") }}
                </span>
              </template>
            </tooltip>
          </span>
        </li>
      </ul>

      <BoardItem
        v-for="(item, key) in boardStore.items"
        :key="key"
        :item="item"
      />

      <div class="LogsView__Pagination">
        <button
          :aria-label="$t('views.logs.aria_labels.first_page')"
          :class="{
            LogsView__PageLink: true,
            LogsView__PageLink_Disabled: disableFirst,
          }"
          :disabled="disableFirst"
          @click="navigate(1)"
        >
          <div class="LogsView__Icon_Set">
            <AVIcon icon="chevron-left" aria-hidden="true" />
            <AVIcon icon="chevron-left" aria-hidden="true" />
          </div>
        </button>

        <button
          :aria-label="$t('views.logs.aria_labels.prev_page')"
          :class="{
            LogsView__PageLink: true,
            LogsView__PageLink_Disabled: disableFirst,
          }"
          :disabled="disableFirst"
          @click="navigate(boardStore.meta.prev_page)"
        >
          <AVIcon icon="chevron-left" aria-hidden="true" />
        </button>

        <span class="LogsView__PageLink">{{ boardStore.currentPage }}</span>
        <span class="LogsView__PageLink">/</span>
        <span class="LogsView__PageLink">{{
          boardStore.meta.total_pages
        }}</span>

        <button
          :aria-label="$t('views.logs.aria_labels.next_page')"
          :class="{
            LogsView__PageLink: true,
            LogsView__PageLink_Disabled: disableLast,
          }"
          :disabled="disableLast"
          @click="navigate(boardStore.meta.next_page)"
        >
          <AVIcon icon="chevron-right" aria-hidden="true" />
        </button>

        <button
          :aria-label="$t('views.logs.aria_labels.last_page')"
          :class="{
            LogsView__PageLink: true,
            LogsView__PageLink_Disabled: disableLast,
          }"
          :disabled="disableLast"
          @click="navigate(boardStore.meta.total_pages)"
        >
          <div class="LogsView__Icon_Set">
            <AVIcon icon="chevron-right" aria-hidden="true" />
            <AVIcon icon="chevron-right" aria-hidden="true" />
          </div>
        </button>
      </div>

      <AVButton
        @click="downloadLog"
        size="small"
        type="neutral"
        class="LogsView__Button_Overrides"
        iconLeft
        icon="download"
        :label="$t('views.logs.download_button')"
      />
    </template>
    <template v-slot:help>
      <h3 class="LogsView__Help_Title text-contrast">
        {{ $t("views.logs.help.p1.question") }}
      </h3>
      <p class="LogsView__Help_Description text-contrast">
        {{ $t("views.logs.help.p1.answer") }}
      </p>
      <h3 class="LogsView__Help_Title text-contrast">
        {{ $t("views.logs.help.p2.question") }}
      </h3>
      <p class="LogsView__Help_Description text-contrast">
        {{ $t("views.logs.help.p2.answer") }}
      </p>
      <h3 class="LogsView__Help_Title text-contrast">
        {{ $t("views.logs.help.p3.question") }}
      </h3>
      <p class="LogsView__Help_Description text-contrast">
        {{ $t("views.logs.help.p3.answer") }}
      </p>
    </template>
  </ContentLayout>
</template>

<style type="text/css" scoped>
.LogsView__Title {
  font-size: 2.5rem;
  font-weight: 600;
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
  border: 2px solid transparent;
  padding: 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  color: var(--slate-900);
  margin: 0 0 2rem 0;
}

.LogsView__Configuration_Only:has(input[type="checkbox"]:checked) {
  border: 2px solid var(--slate-600);
}

input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: var(--av-theme-background);
}

.LogsView__ColumnDescriptions {
  display: none;
}

.LogsView__Pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 12rem;
  margin: 1rem 0 0 0;
}

.LogsView__Icon_Set > svg:first-of-type {
  margin-right: -4px;
}

.LogsView__PageLink {
  color: var(--slate-800);
  background: none;
  border: none;
}

.LogsView__PageLink_Disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.LogsView__Help_Title {
  text-align: center;
  font-size: 1.6rem;
  margin: 0 0 1.5rem 0;
}

.LogsView__Help_Description {
  margin: 0 0 1.5rem 0;
}

.LogsView__Help_Description:last-of-type {
  margin: 0;
}

.LogsView__Button_Overrides {
  font-size: 0.75rem !important;
  padding: 0.5rem 0.8rem !important;
  margin-top: 2rem;
  align-self: center;
}

.LogsView__Tooltip {
  cursor: help;
}

@media only screen and (min-width: 48rem) {
  .LogsView__Title {
    margin: 0 0 1.5rem 0;
  }

  .LogsView__Subtitle {
    display: flex;
    color: var(--slate-700);
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    text-align: center;
  }

  .LogsView__ColumnDescriptions {
    list-style: none;
    margin: 1rem 0;
    display: flex;
    width: 100%;
    font-size: 0.75rem;
    padding-inline-start: 0;
    color: var(--slate-600);
  }

  .LogsView__ColumnDescriptions--event {
    margin-left: 1rem;
  }

  .LogsView__ColumnDescriptions--event,
  .LogsView__ColumnDescriptions--time,
  .LogsView__ColumnDescriptions--actor {
    width: 30%;
  }

  .LogsView__Button_Overrides {
    font-size: 0.875rem !important;
    padding: 0.5rem 1.5rem !important;
    margin-top: 4rem;
  }
}

@media only screen and (min-width: 80rem) and (min-height: 45rem) {
  .LogsView__Title {
    font-size: 3.5rem;
  }

  .LogsView__Subtitle {
    padding-top: 5rem;
  }

  .LogsView__Description {
    text-align: left;
    align-self: flex-start;
  }

  .LogsView__Pagination {
    align-self: center;
    margin-top: 2rem;
  }

  .LogsView__Help_Title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .LogsView__Help_Description:not(.LogsView__Help_Description:last-of-type) {
    margin-bottom: 0.5rem;
  }

  .LogsView__Button_Overrides {
    font-size: 1rem !important;
    padding: 0.6rem 2rem !important;
  }
}

@media only screen and (min-width: 120rem) and (min-height: 68rem) {
  .LogsView__Title {
    font-size: 3.5rem;
  }

  .LogsView__Help_Title {
    font-size: 1.8rem;
  }

  .LogsView__Help_Description {
    font-size: 1.2rem;
  }

  .LogsView__Button_Overrides {
    font-size: 1.125rem !important;
    padding: 0.75rem 2.75rem !important;
  }
}
</style>
