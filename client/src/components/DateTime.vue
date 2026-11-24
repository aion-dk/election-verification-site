<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { intlFormatDistance } from "date-fns";

const i18n = useI18n();

const props = defineProps({
  dateTime: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: "relative",
    validator: (s: string) => ["absolute", "relative"].includes(s),
  },
  timeZone: {
    type: String,
    default: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

// Keep the real instant: the time zone only affects how it is displayed.
const date = computed(() => new Date(props.dateTime));

const absolute = computed(() => {
  return date.value.toLocaleString(i18n.locale.value, {
    timeZone: props.timeZone,
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
  return intlFormatDistance(date.value, new Date(), {
    locale: i18n.locale.value,
  });
});

const value = computed(() =>
  props.format === "absolute" ? absolute.value : relative.value,
);
const label = computed(() =>
  props.format === "absolute" ? relative.value : absolute.value,
);
</script>

<template>
  <span class="DateTime">
    <span class="visually-hidden">{{ label }}</span>
    <AVTooltip :content="label" :text="value" position="top" />
  </span>
</template>
