<script lang="ts" setup>
import { ref } from "vue";
import i18n from "../lib/i18n";
const { t } = i18n.global;

const props = defineProps({
  expanded: {
    type: Boolean,
    default: false,
  },
});

const _expanded = ref(props.expanded);
const _label = ref(t("components.board_item.expand"));

function toggle() {
  _expanded.value = !_expanded.value;
  _label.value = _expanded.value
    ? t("components.board_item.collapse")
    : t("components.board_item.expand");
}
</script>

<template>
  <div
    :class="{
      ExpandableSection: true,
      ['ExpandableSection--expanded']: _expanded,
    }"
  >
    <div class="ExpandableSection__Line" v-if="!_expanded">
      <slot name="collapsed"></slot>
    </div>

    <div class="ExpandableSection__Content" v-if="_expanded">
      <slot name="expanded"></slot>
    </div>

    <button
      class="ExpandableSection__Expander"
      @click="toggle"
      :aria-label="_label"
    >
      <AVIcon v-if="_expanded" icon="minus" />

      <AVIcon v-else icon="plus" />
    </button>
  </div>
</template>

<style type="text/css" scoped>
.ExpandableSection {
  display: flex;
  border: solid 1px var(--slate-200);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  flex-direction: column;
  position: relative;
}

.ExpandableSection__Line {
  display: flex;
  flex-direction: column;
}

.ExpandableSection__Expander {
  background-color: var(--slate-600);
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: white;
  border: none;
}

@media only screen and (min-width: 48rem) {
  .ExpandableSection__Line {
    flex-direction: row;
  }

  .ExpandableSection {
    margin-bottom: 1rem;
  }
}
</style>
