<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import useConfigStore from "@/stores/useConfigStore";
import type { SupportedLocale } from "@/Types";

const configStore = useConfigStore();
const i18n = useI18n();

const electionName = computed(
  () =>
    configStore.election?.title?.[i18n.locale.value as SupportedLocale] ?? "",
);
</script>

<template>
  <div class="PageTitle" id="page-title">
    <span class="PageTitle__Label" id="page-title-label">{{
      $t("header.dbas")
    }}</span>
    <h1
      v-if="electionName"
      class="PageTitle__Name"
      id="page-title-name"
    >
      {{ electionName }}
    </h1>
  </div>
</template>

<style type="text/css" scoped>
.PageTitle {
  display: flex;
  flex-direction: column;
  gap: 0;
  background-color: white;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--bs-gray-200);
}

.PageTitle__Label {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--bs-gray-800);
  line-height: 1.25rem;
}

.PageTitle__Name {
  font-size: 1rem;
  font-weight: 400;
  color: var(--bs-gray-700);
  margin: 0;
}

@media only screen and (min-width: 48rem) {
  .PageTitle {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style>
