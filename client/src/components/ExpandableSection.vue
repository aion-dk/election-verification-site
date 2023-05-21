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
    @click="toggle"
    class="ExpandableSection"
    :class="{
      ['ExpandableSection--expanded']: _expanded,
    }"
  >
    <div class="ExpandableSection__Line" v-if="!_expanded">
      <slot name="collapsed"></slot>
    </div>

    <div class="ExpandableSection__Content" v-if="_expanded">
      <slot name="expanded"></slot>
    </div>

    <button class="ExpandableSection__Expander" :aria-label="_label">
      <font-awesome-icon v-if="_expanded" icon="fa-solid fa-minus" />

      <font-awesome-icon v-else icon="fa-solid fa-plus" />
    </button>
  </div>
</template>

<style type="text/css" scoped>
.ExpandableSection {
  display: flex;
  border: solid 1px #dee2e6;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  flex-direction: column;
  position: relative;
  cursor: pointer;
}

.ExpandableSection:hover,
.ExpandableSection:focus-within {
  background-color: rgba(0, 0, 0, 10%);
}
.ExpandableSection:focus-within {
  outline: #317be7 2px solid;
}

.ExpandableSection__Line {
  display: flex;
}

@media (max-width: 992px) {
  .ExpandableSection__Line {
    flex-direction: column;
  }
}

.ExpandableSection__Expander {
  background-color: #343a40;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  color: #fff;
  border: none;
}
</style>
