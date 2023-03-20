<script lang="ts" setup>
import { hexToShortCode } from "@aion-dk/js-client/dist/lib/av_client/short_codes";
import { ref, computed } from "vue";

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
  },
});

const copied = ref(false);
const shortAddress = computed(() => hexToShortCode(props.address.slice(0, 10)));
const periodicedShortAddress = computed(() => {
  return props.item?.address?.split("")?.join(". ");
});

async function copy() {
  try {
    await navigator.clipboard.writeText(shortAddress.value);
    copied.value = true;
  } catch (e) {
    console.error("Unable to copy short address to clipboard", e);
  } finally {
    setTimeout(() => (copied.value = false), 300);
  }
}
</script>

<template>
  <span class="ItemIdentifier">
    <font-awesome-icon
      icon="fa-solid fa-fingerprint"
      class="ItemIdentifier__Icon"
    />
    <span class="ItemIdentifier__Prefix" v-if="prefix">
      {{ prefix }}
    </span>

    <tooltip hover placement="top">
      <template #default>
        <code
          class="ItemIdentifier__ShortCode"
          @click="copy"
          role="button"
          :aria-label="periodicedShortAddress"
        >
          {{ shortAddress }}
        </code>
      </template>

      <template #content>
        <span v-if="copied">
          {{ $t("components.item_identifier.copied") }}
        </span>
        <span v-else>
          {{ $t("components.item_identifier.tooltip") }}
        </span>
      </template>
    </tooltip>
  </span>
</template>

<style type="text/css" scoped>
.ItemIdentifier__Icon {
  margin-right: 5px;
}

.ItemIdentifier__ShortCode {
  font-family: "Red Hat Mono";
  letter-spacing: 3px;
  font-weight: 400;
  cursor: pointer;
}

.ItemIdentifier__Prefix {
  margin-right: 5px;
}
</style>
