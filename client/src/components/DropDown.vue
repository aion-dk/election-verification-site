<script lang="ts" setup>
  import { defineEmits } from "vue"

  const emit = defineEmits(["change"]);

  defineProps({
    options: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  })
</script>

<template>
  <select :disabled="disabled" @change="(event) => emit('change', event.target.value)">
    <option
      v-for="option in options"
      :value="option.value"
      :key="option.value"
      :selected="option.selected">
      {{ option.display || option.value }}
    </option>
  </select>
</template>

<style type="text/css" scoped>
  select {
    font-family: "Open Sans";
  }
</style>
