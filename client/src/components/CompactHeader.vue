<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  locale: {
    type: String,
    required: true,
  },
  election: {
    type: Object,
    required: true,
  },
});

const area = computed(() =>
  [props.election.jurisdiction, props.election.state]
    .filter((s) => s)
    .join(", ")
);
</script>

<template>
  <div class="CompactHeader" v-if="election">
    <h1 class="CompactHeader__Title">{{ election.title[locale] }}</h1>
    <div class="CompactHeader__CircleSpacer" v-if="area" />
    <p class="CompactHeader__Area">{{ area }}</p>
  </div>
</template>

<style type="text/css" scoped>
.CompactHeader {
  margin: 47px 0;
  display: flex;
  align-items: center;
  font-family: "Open Sans";
  color: #6c757d;
}

.CompactHeader__Title {
  font-size: 16px;
  font-weight: 600;
  padding: 0;
  margin: 0;
}

.CompactHeader__Area {
  font-size: 16px;
}

.CompactHeader__CircleSpacer {
  height: 6px;
  width: 6px;
  background-color: #ced4da;
  border-radius: 100%;
  display: block;
  margin: 0 8px;
}
</style>
