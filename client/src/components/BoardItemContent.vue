<script lang="ts" setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="BoardItemContent">
    <p>{{ $t(`components.board_item.${item.type}.info`) }}</p>

    <p v-if="item.type === 'ThresholdConfigItem'">
      {{ $t(`components.board_item.${item.type}.encryption_key`) }}
      <code>{{ item.content.encryptionKey.slice(-7) }}</code>
    </p>
  </div>
</template>

<style type="text/css" scoped>
.BoardItemContent {
}

code {
  font-size: 14px;
}
</style>
