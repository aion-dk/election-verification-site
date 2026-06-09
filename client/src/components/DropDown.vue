<script lang="ts" setup>
import type { PropType } from "vue";
import type { DropdownOption } from "@/Types";

const emit = defineEmits(["change"]);

const selectEmit = (event: Event) => {
  emit("change", (event.target as HTMLSelectElement).value);
};

defineProps({
  id: {
    type: String,
    required: false,
    default: "",
  },
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
  <div :id="id" class="Dropdown__Container">
    <select
      :disabled="disabled"
      :aria-label="$t('header.change_locale.label')"
      @change="selectEmit"
      :id="id ? `${id}-select` : undefined"
    >
      <option
        v-for="option in options"
        :value="option.value"
        :key="option.value"
        :selected="option.selected"
        :id="id ? `${id}-option-${option.value}` : undefined"
      >
        {{ option.display || option.value }}
      </option>
    </select>
  </div>
</template>

<style type="text/css" scoped>
select {
  font-family: "Open Sans", sans-serif;
}
</style>
