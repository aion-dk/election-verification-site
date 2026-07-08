<script setup lang="ts">
import { computed, toRef } from "vue";
import { useI18n } from "vue-i18n";
import type { PublishedResult } from "@/Types";
import { usePdfPreview } from "@/composables/usePdfPreview";

const props = defineProps<{
  result: PublishedResult;
}>();

const { locale } = useI18n();
const source = toRef(props, "result");

const pdfBase64 = computed(() => source.value.pdf);
const { blobUrl } = usePdfPreview(pdfBase64);

const formattedDate = computed(() => {
  try {
    return new Intl.DateTimeFormat(locale.value, {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(source.value.publishedAt));
  } catch {
    return source.value.publishedAt;
  }
});

const downloadFileName = computed(
  () => `${source.value.votingRoundName}.pdf`,
);
</script>

<template>
  <article class="ResultCard" id="result-card">
    <header class="ResultCard__Header">
      <h2 class="ResultCard__Title" id="result-card-title">
        {{ result.votingRoundName }}
      </h2>
      <p class="ResultCard__Date" id="result-card-date">
        <span class="ResultCard__Date_Label">{{
          $t("views.results.published_on")
        }}</span>
        <time :datetime="result.publishedAt">{{ formattedDate }}</time>
      </p>
    </header>

    <div class="ResultCard__Preview" id="result-card-preview">
      <object
        v-if="blobUrl"
        :data="blobUrl"
        type="application/pdf"
        class="ResultCard__Object"
        id="result-card-pdf-object"
        :title="$t('views.results.preview_unavailable')"
        :aria-label="result.votingRoundName"
      >
        <p class="ResultCard__Fallback" id="result-card-fallback">
          {{ $t("views.results.preview_unavailable") }}
        </p>
        <a
          :href="blobUrl"
          :download="downloadFileName"
          class="ResultCard__DownloadLink ResultCard__DownloadLink--fallback"
          id="result-card-fallback-download"
        >
          <AVIcon icon="download" aria-hidden="true" />
          {{ $t("views.results.download") }}
        </a>
      </object>
    </div>

    <a
      v-if="blobUrl"
      :href="blobUrl"
      :download="downloadFileName"
      class="ResultCard__DownloadLink"
      id="result-card-download"
    >
      <AVIcon icon="download" aria-hidden="true" />
      {{ $t("views.results.download") }}
    </a>
  </article>
</template>

<style scoped>
.ResultCard {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--bs-gray-300);
  border-radius: 12px;
  background-color: var(--bs-white);
}

.ResultCard__Header {
  margin-bottom: 1rem;
}

.ResultCard__Title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--bs-gray-800);
  margin: 0 0 0.5rem 0;
}

.ResultCard__Date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: var(--bs-gray-600);
  margin: 0;
}

.ResultCard__Date_Label {
  font-weight: 600;
}

.ResultCard__Preview {
  width: 100%;
  min-height: 30rem;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--bs-gray-100);
}

.ResultCard__Object {
  width: 100%;
  height: 30rem;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.ResultCard__Fallback {
  color: var(--bs-gray-700);
  text-align: center;
  margin: 0;
  padding: 1rem;
}

.ResultCard__DownloadLink {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  color: var(--bs-white);
  background-color: var(--av-theme-background);
}

.ResultCard__DownloadLink:hover {
  opacity: 0.9;
}

.ResultCard__DownloadLink--fallback {
  background-color: var(--bs-gray-700);
}

@media only screen and (min-width: 48rem) {
  .ResultCard {
    padding: 2rem;
  }

  .ResultCard__Title {
    font-size: 1.75rem;
  }

  .ResultCard__Object {
    height: 40rem;
  }

  .ResultCard__Preview {
    min-height: 40rem;
  }
}
</style>
