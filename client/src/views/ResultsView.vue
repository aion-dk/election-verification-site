<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import ContentLayout from "@/components/ContentLayout.vue";
import MainIcon from "@/components/MainIcon.vue";
import ResultCard from "@/components/ResultCard.vue";
import useConfigStore from "@/stores/useConfigStore";
import { useConferenceConnector } from "@/lib/conferenceServices";
import type { PublishedResult } from "@/Types";

const route = useRoute();
const configStore = useConfigStore();

const organisationSlug = route.params.organisationSlug.toString();
const electionSlug = route.params.electionSlug.toString();
const { conferenceClient } = useConferenceConnector(
  organisationSlug,
  electionSlug,
);

const results = ref<PublishedResult[]>([]);
const hasError = ref<boolean>(false);
const isLoaded = ref<boolean>(false);

const sortedResults = computed(() => {
  return [...results.value].sort((a, b) => {
    const dateA = a.votingRoundClosingDate || a.publishedAt;
    const dateB = b.votingRoundClosingDate || b.publishedAt;
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });
});

const loadResults = async () => {
  hasError.value = false;
  isLoaded.value = false;
  try {
    results.value = await conferenceClient.getPublishedResults();
  } catch (err) {
    console.error(err);
    hasError.value = true;
  } finally {
    isLoaded.value = true;
  }
};

onMounted(loadResults);
</script>

<template>
  <ContentLayout
    id="results-view"
    :help-title="$t('views.results.help.title')"
    :help-title-strong="$t('views.results.help.title_strong')"
    :logo="configStore.electionStatus?.theme?.logo"
  >
    <template v-slot:action>
      <MainIcon icon="square-poll-vertical" id="results-main-icon" />
      <h1 class="ResultsView__Title" id="results-title">
        {{ $t("views.results.title") }}
      </h1>
      <p class="ResultsView__Description" id="results-description">
        {{ $t("views.results.description") }}
      </p>

      <div
        v-if="isLoaded && !hasError"
        class="ResultsView__List"
        id="results-list"
      >
        <ResultCard
          v-for="result in sortedResults"
          :key="result.votingRoundName"
          :result="result"
        />

        <p
          v-if="sortedResults.length === 0"
          class="ResultsView__Empty"
          id="results-empty"
        >
          {{ $t("views.results.empty_state") }}
        </p>
      </div>

      <div
        v-if="isLoaded && hasError"
        class="ResultsView__Error"
        id="results-error"
      >
        <p class="ResultsView__Error_Text" id="results-error-text">
          {{ $t("views.results.error_state") }}
        </p>
        <button
          class="btn btn-theme rounded-3 ResultsView__Retry"
          type="button"
          @click="loadResults"
          id="results-retry"
        >
          {{ $t("views.results.retry") }}
        </button>
      </div>
    </template>
    <template v-slot:help>
      <h3
        class="ResultsView__Help_Title text-contrast"
        id="results-help-p1-question"
      >
        {{ $t("views.results.help.p1.question") }}
      </h3>
      <p
        class="ResultsView__Help_Description text-contrast"
        id="results-help-p1-answer"
      >
        {{ $t("views.results.help.p1.answer") }}
      </p>
    </template>
  </ContentLayout>
</template>

<style scoped>
.ResultsView__Title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--bs-gray-800);
  margin: 0.5rem 0 1rem 0;
  text-align: center;
}

.ResultsView__Description {
  color: var(--bs-gray-700);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.ResultsView__List {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.ResultsView__Empty {
  color: var(--bs-gray-600);
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.125rem;
}

.ResultsView__Error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
}

.ResultsView__Error_Text {
  color: var(--bs-danger);
  text-align: center;
  margin: 0;
  font-size: 1.125rem;
}

.ResultsView__Retry {
  padding: 0.5rem 1.5rem;
}

.ResultsView__Help_Title {
  text-align: center;
  font-size: 1.6rem;
  margin: 0 0 1.5rem 0;
}

.ResultsView__Help_Description {
  margin: 0 0 1.5rem 0;
}

@media only screen and (min-width: 48rem) {
  .ResultsView__Title {
    margin: 0 0 1.5rem 0;
  }
}

@media only screen and (min-width: 80rem) {
  .ResultsView__Title {
    font-size: 3.5rem;
  }

  .ResultsView__Description {
    text-align: left;
    align-self: flex-start;
  }

  .ResultsView__Help_Title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
}

@media only screen and (min-width: 120rem) {
  .ResultsView__Title {
    font-size: 3.5rem;
  }

  .ResultsView__Help_Title {
    font-size: 1.8rem;
  }

  .ResultsView__Help_Description {
    font-size: 1.2rem;
  }
}
</style>
