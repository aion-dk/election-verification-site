<script lang="ts" setup>

const lines = {
    l1x1: 1,
    l1y1: 1,
    l1x2: 5,
    l1y2: 1,
    l2x1: 1,
    l2y1: 3,
    l2x2: 5,
    l2y2: 3,
    l3x1: 1,
    l3y1: 5,
    l3x2: 5,
    l3y2: 5,
}

const props = defineProps({
  stroke: {
    type: String,
    default: "black",
  }
});
</script>

<template>
  <svg viewBox="0,0,6,6" height="1em" :stroke="props.stroke" stroke-linecap="square">
    <line
      :x1="lines.l1x1"
      :y1="lines.l1y1"
      :x2="lines.l1x2"
      :y2="lines.l1y2"
    ></line>
    <line
      :x1="lines.l2x1"
      :y1="lines.l2y1"
      :x2="lines.l2x2"
      :y2="lines.l2y2"
    ></line>
    <line
      :x1="lines.l3x1"
      :y1="lines.l3y1"
      :x2="lines.l3x2"
      :y2="lines.l3y2"
    ></line>
  </svg>
</template>
