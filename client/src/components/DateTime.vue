<script lang="ts" setup>
import moment from "moment";
import "moment/min/locales";
import "moment-timezone";
import { ref } from "vue";

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

const value = ref(
  props.format === "absolute"
    ? absolute(props.dateTime)
    : relative(props.dateTime)
);
const label = ref(
  props.format === "absolute"
    ? relative(props.dateTime)
    : absolute(props.dateTime)
);

function relative(date: any) {
  return moment
    .parseZone(date)
    .tz(props.timeZone)
    .locale(window.navigator.language)
    .fromNow();
}

function absolute(date: any) {
  return moment
    .parseZone(date)
    .tz(props.timeZone)
    .locale(window.navigator.language)
    .format("LLLL zz");
}
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
