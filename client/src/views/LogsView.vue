<script setup lang="ts">
import { options } from "@/lib/api";
import useConfigStore from "@/stores/useConfigStore";
import useBoardStore from "@/stores/useBoardStore";
import { onMounted, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import BoardItem from "@/components/BoardItem.vue";
import ContentLayout from "@/components/ContentLayout.vue";
import MainIcon from "@/components/MainIcon.vue";
import router from "@/router";
import i18n from "@/lib/i18n";

const route = useRoute();
const configStore = useConfigStore();
const boardStore = useBoardStore();
const configItemsOnly = ref<boolean>(false);

const boardLink = computed(() => `${dbbLink.value}/board`);

const disableFirst = computed(() => !boardStore.meta.prev_page);

const disableLast = computed(() => !boardStore.meta.next_page);

watch(configStore, () => loadPage(currentPage.value));

watch(route, () => loadPage(currentPage.value));

watch(configItemsOnly, () => loadPage(1));

const dbbLink = computed(() => {
  return `${options.baseURL}/${configStore.boardSlug}`;
});

const currentPage = computed(() =>
  parseInt((route.params.page || boardStore.currentPage || 1).toString(), 10),
);

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
    `/${i18n.global.locale}/${route.params.organisationSlug}/${
      route.params.electionSlug
    }/logs/${page.toString()}`,
  );
};

const downloadLog = () => {
  window.location.href = `${dbbLink.value}/download_log`;
};

const downloadAttachments = () => {
  window.location.href = `${dbbLink.value}/download_attachments`;
};

onMounted(() => loadPage(currentPage.value));
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
          <AVTooltip
            :content="$t('views.logs.headers.type_tooltip')"
            :text="$t('views.logs.headers.type')"
            icon="circle-question"
            position="right"
          />
        </li>
        <li class="LogsView__ColumnDescriptions--time">
          {{ $t("views.logs.headers.time") }}
        </li>
        <li class="LogsView__ColumnDescriptions--actor">
          <AVTooltip
            :content="$t('views.logs.headers.actor_tooltip')"
            :text="$t('views.logs.headers.actor')"
            icon="circle-question"
            position="right"
          />
        </li>
      </ul>

      <BoardItem
        v-for="(item, key) in boardStore.items"
        :key="key"
        :item="item"
      />

      <div class="LogsView__Pagination">
        <div class="RTL_Rotation">
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
        </div>

        <div>
          <span class="LogsView__PageLink">{{ boardStore.currentPage }}</span>
          <span class="LogsView__PageLink">/</span>
          <span class="LogsView__PageLink">{{
            boardStore.meta.total_pages
          }}</span>
        </div>

        <div class="RTL_Rotation">
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
      </div>

      <div class="vstack pt-3 gap-2 w-100 align-items-center">
        <button
          class="btn btn-sm btn-theme rounded-3 LogsView__Button"
          type="button"
          @click="downloadLog"
        >
          <AVIcon icon="download" />
          {{ $t("views.logs.download_button") }}
        </button>

        <button
          class="btn btn-sm btn-theme rounded-3 LogsView__Button"
          type="button"
          @click="downloadAttachments"
        >
          <AVIcon icon="download" />
          {{ $t("views.logs.download_attachments") }}
        </button>
      </div>

      <p class="LogsView__Board_Link">
        {{ $t("views.logs.board_link") }}<code>{{ boardLink }}</code>
      </p>
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
  color: var(--bs-gray-800);
  margin: 0.5rem 0 1rem 0;
  text-align: center;
}

.LogsView__Subtitle {
  display: none;
}

.LogsView__Description {
  color: var(--bs-gray-700);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.LogsView__Configuration_Only {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid transparent;
  padding: 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  color: var(--bs-gray-900);
  margin: 0 0 2rem 0;
  cursor: pointer;
}

.LogsView__Configuration_Only:has(input[type="checkbox"]:checked) {
  border: 2px solid var(--bs-gray-600);
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

html[dir="ltr"] .LogsView__Icon_Set > svg:first-of-type {
  margin-right: -4px;
}

html[dir="rtl"] .LogsView__Icon_Set > svg:first-of-type {
  margin-left: -4px;
}

.RTL_Rotation {
  display: flex;
  gap: 1rem;
}

html[dir="rtl"] .RTL_Rotation {
  transform: rotate(180deg);
  flex-direction: row-reverse;
}

.LogsView__PageLink {
  color: var(--bs-gray-800);
  background: none;
  border: none;
  cursor: pointer;
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

.LogsView__Button {
  padding: 0.3rem 0.75rem;
}

.LogsView__Tooltip {
  cursor: help;
}

.LogsView__Board_Link {
  text-align: center;
  width: 100%;
  margin: 0;
  margin-top: 1rem;
  max-width: 100%;
  overflow-x: hidden;
}

.LogsView__Board_Link code {
  font-size: 0.95rem;
  user-select: all;
  margin-left: 3px;
}

@media only screen and (min-width: 48rem) {
  .LogsView__Title {
    margin: 0 0 1.5rem 0;
  }

  .LogsView__Subtitle {
    display: flex;
    color: var(--bs-gray-700);
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
    padding-inline-start: 0;
    color: var(--bs-gray-800);
  }

  .LogsView__ColumnDescriptions--event {
    margin-left: 1rem;
  }

  .LogsView__ColumnDescriptions--event,
  .LogsView__ColumnDescriptions--time,
  .LogsView__ColumnDescriptions--actor {
    width: 30%;
  }
}

@media only screen and (min-width: 80rem) {
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
}

@media only screen and (min-width: 120rem) {
  .LogsView__Title {
    font-size: 3.5rem;
  }

  .LogsView__Help_Title {
    font-size: 1.8rem;
  }

  .LogsView__Help_Description {
    font-size: 1.2rem;
  }
}
</style>
