<script lang="ts" setup>
import moment from "moment";
import "moment/dist/locale/es";
import "moment/dist/locale/ar";
import "moment/dist/locale/fi";
import "moment/dist/locale/da";
import "moment/dist/locale/de";
import "moment/dist/locale/fr";
import "moment/dist/locale/sv";
import "moment/dist/locale/is";
import "moment/dist/locale/ru";
import "moment/dist/locale/nl";
import "moment-timezone";
import { ref, computed } from "vue";
import i18n from "../lib/i18n";

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

const date: any = computed(() => moment(new Date(props.dateTime)).tz(props.timeZone).locale(i18n.global.locale))
const relative = computed(() => date.value.fromNow())
const absolute = computed(() => date.value.format("LLLL zz"))

const value = ref(
  props.format === "absolute"
    ? absolute
    : relative
);

const label = ref(
  props.format === "absolute"
    ? relative
    : absolute
);
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
