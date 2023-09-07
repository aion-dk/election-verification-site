<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";

const emit = defineEmits(["timeout", "alert"]);

const props = defineProps({
  maxSeconds: {
    type: Number,
    default: 600,
  },
  currentSeconds: {
    type: Number,
    default: 600,
  },
});

const decrementSeconds = () => {
  if (secondsLeft.value > 0) secondsLeft.value--;
};

const msToTimeLeft = (ms: number) => {
  let min = Math.floor(ms / 60000);
  let sec = Number.parseInt(((ms % 60000) / 1000).toFixed(0));
  return min + ":" + (sec < 10 ? "0" : "") + sec;
};

const secondsLeft = ref(props.currentSeconds);
const interval = ref(null);
const miliseconds = computed(() => secondsLeft.value * 1000);
const percentageWidth = computed(
  () => (secondsLeft.value / props.maxSeconds) * 100
);
const style = computed(() => {
  return `
      --width: ${percentageWidth.value}%;
    `;
});

watch(secondsLeft, () => (secondsLeft.value === 0 ? emit("timeout") : null));

watch(secondsLeft, () => (secondsLeft.value === 180 ? emit("alert") : null));

onMounted(() => {
  interval.value = setInterval(() => decrementSeconds(), 1000);
});
</script>

<template>
  <div class="Timedown">
    <div class="Timedown__Progress" :style="style" />
    <span class="Timedown__Text">{{
      $t("components.timedown.expire_text", { time: msToTimeLeft(miliseconds) })
    }}</span>
  </div>
</template>

<style type="text/css" scoped>
.Timedown {
  background-color: var(--slate-100);
  width: 100%;
  z-index: 50;
  padding-bottom: 0.25rem;
  position: fixed;
}

.Timedown__Progress {
  width: var(--width);
  background-color: var(--av-theme-background);
  border-radius: 10px;
  box-sizing: border-box;
  min-width: 0.4rem;
  height: 0.4rem;
}

.Timedown__Text {
  color: var(--slate-600);
  font-size: 0.8rem;
  padding: 0.5rem 0.5rem 1.5rem 0.5rem;
}

@media only screen and (min-width: 48rem) {
  .Timedown {
    margin-top: 0;
  }
}

@media only screen and (min-width: 80rem) {
  .Timedown {
    background-color: white;
    width: calc(100% - 32rem);
    position: absolute;
  }
}

@media only screen and (min-width: 120rem) {
  .Timedown {
    width: calc(100% - 42rem);
  }
}
</style>
