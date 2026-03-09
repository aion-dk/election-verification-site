<script lang="ts" setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { intlFormatDistance } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const i18n = useI18n();

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

const date = computed(() => toZonedTime(props.dateTime, props.timeZone));

const absolute = computed(() => {
  return new Date(date.value).toLocaleString(i18n.locale.value, {
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
    locale: i18n.locale.value,
  });
});

const value = ref(props.format === "absolute" ? absolute : relative);
const label = ref(props.format === "absolute" ? relative : absolute);
</script>

<template>
  <span class="DateTime" :aria-label="label">
    <AVTooltip :content="label" :text="value" position="top" />
  </span>
</template>
