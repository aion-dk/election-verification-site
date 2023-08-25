<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <AVIcon :icon="icon" class="MainIcon" aria-hidden="true" />
</template>

<style scoped>
.MainIcon {
  opacity: 1;
  font-size: 5rem;
  position: static;
  color: var(--av-theme-background);
  margin-bottom: 0.5rem;
  pointer-events: none;
}

@media only screen and (min-width: 48rem) {
  .MainIcon {
    margin-bottom: 2rem;
  }
}

@media only screen and (min-width: 80rem) {
  .MainIcon {
    opacity: 0.05;
    font-size: 20rem;
    position: absolute;
    top: 3rem;
    color: var(--av-theme-background);
  }

  html[dir=ltr] .MainIcon {
    right: 3rem;
  }

  html[dir=rtl] .MainIcon {
    left: 3rem;
  }
}
</style>
