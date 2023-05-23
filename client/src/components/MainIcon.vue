<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <AVIcon :icon="icon" class="MainIcon" />
</template>

<style scoped>
.MainIcon {
  opacity: 0.05;
  font-size: 20rem;
  position: absolute;
  right: 3rem;
  top: 3rem;
  color: var(--av-theme-background);
}

@media only screen and (max-width: 976px) {
  .MainIcon {
    opacity: 1;
    font-size: 5rem;
    position: static;
  }
}
</style>
