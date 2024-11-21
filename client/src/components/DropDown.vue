<script lang="ts" setup>
import type { PropType } from "vue";
import type { DropdownOption } from "@/Types";

const emit = defineEmits(["change"]);

const selectEmit = (event: Event) => {
  emit("change", (event.target as HTMLSelectElement).value);
};

defineProps({
  options: {
    type: Array as PropType<DropdownOption[]>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <select :disabled="disabled" @change="selectEmit">
    <option
      v-for="option in options"
      :value="option.value"
      :key="option.value"
      :selected="option.selected"
    >
      {{ option.display || option.value }}
    </option>
  </select>
</template>

<style type="text/css" scoped>
select {
  font-family: "Open Sans";
}
</style>
