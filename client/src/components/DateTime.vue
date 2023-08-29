<script lang="ts" setup>
import { ref, computed } from "vue";
import i18n from "../lib/i18n";
import { intlFormatDistance } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const props = defineProps({
  dateTime: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: "relative",
    validate: (s: string) => ["absolute", "relative"].indexOf(s) >= 0,
  },
  timeZone: {
    type: String,
    default: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

const date = computed(() => utcToZonedTime(props.dateTime, props.timeZone));

const absolute = computed(() => {
  return new Date(date.value).toLocaleString(i18n.global.locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "shortGeneric",
  });
});

const relative = computed(() => {
  return intlFormatDistance(new Date(date.value), new Date(), {
    locale: i18n.global.locale,
  });
});

const value = ref(props.format === "absolute" ? absolute : relative);
const label = ref(props.format === "absolute" ? relative : absolute);
</script>

<template>
  <span class="DateTime" :aria-label="label">
    <tooltip hover placement="top">
      <template #default>
        {{ value }}
      </template>

      <template #content>
        {{ label }}
      </template>
    </tooltip>
  </span>
</template>
