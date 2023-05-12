<script setup lang="ts">
  import { computed, ref, onMounted } from "vue"
  import humanizeDuration from "humanize-duration"

  const props = defineProps({
    maxSeconds: {
      type: Number,
      default: 600,
    },
    currentSeconds: {
      type: Number,
      default: 600,
    },
  })

  const secondsLeft = ref(props.currentSeconds)
  const interval = ref(null);
  const miliseconds = computed(() => secondsLeft.value * 1000)
  const displayValue = computed(() => humanizeDuration(miliseconds.value))
  const percentageWidth = computed(() => {
    if (secondsLeft.value <= 0) {
      clearInterval(interval.value)
      return 0
    }
    return secondsLeft.value / props.maxSeconds * 100
  })
  const style = computed(() => {
    return `
      --width: ${percentageWidth.value}%;
    `
  })

  onMounted(() => {
    interval.value = setInterval(() => secondsLeft.value --, 1000)
  })
</script>

<template>
  <div class="Timedown">
    <div class="Timedown__Progress" :style="style">
      {{ displayValue }}
    </div>
  </div>
</template>

<style type="text/css" scoped>
  .Timedown {
    height: 24px;
    background-color: #333;
    width: 100%;
    padding: 2px;
    border-radius: 14px;
    box-sizing: border-box;
  }

  .Timedown__Progress {
    width: var(--width);
    background-color: #fff;
    border-radius: 10px;
    text-align: right;
    padding: 0 5px;
    box-sizing: border-box;
  }
</style>
