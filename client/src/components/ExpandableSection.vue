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

const toggle = () => {
  _expanded.value = !_expanded.value;
  _label.value = _expanded.value
    ? t("components.board_item.collapse")
    : t("components.board_item.expand");
};
</script>

<template>
  <div
    @click="toggle"
    class="ExpandableSection"
    :class="{
      ['ExpandableSection--expanded']: _expanded,
    }"
    role="button"
  >
    <div class="ExpandableSection__Line" v-if="!_expanded">
      <slot name="collapsed"></slot>
    </div>

    <div class="ExpandableSection__Content" v-if="_expanded">
      <slot name="expanded"></slot>
    </div>

    <button class="ExpandableSection__Expander" :aria-label="_label">
      <AVIcon v-if="_expanded" icon="minus" aria-hidden="true" />

      <AVIcon v-else icon="plus" aria-hidden="true" />
    </button>
  </div>
</template>

<style type="text/css" scoped>
.ExpandableSection {
  display: flex;
  border: solid 1px var(--gray-200);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  flex-direction: column;
  position: relative;
  background-color: white;
  z-index: 10;
  cursor: pointer;
}

.ExpandableSection__Line {
  display: flex;
  flex-direction: column;
}

.ExpandableSection__Expander {
  background-color: white;
  border: solid 1px var(--gray-600);
  color: var(--gray-600);
  border-radius: 99px;
  height: 1.5rem;
  width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: calc(1rem - 1px);
  cursor: pointer;
}

html[dir="ltr"] .ExpandableSection__Expander {
  right: 1rem;
}

html[dir="rtl"] .ExpandableSection__Expander {
  left: 1rem;
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
