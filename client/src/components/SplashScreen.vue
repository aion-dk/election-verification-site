<script setup lang="ts">
import { watch, ref } from 'vue';
import {storeToRefs } from 'pinia'
import useConfigStore from '../stores/useConfigStore'
const configStore = useConfigStore()

const { electionStatus } = storeToRefs(configStore)
const bgStyle = ref(null);

watch(electionStatus, () => {
  if (electionStatus.value.theme?.splash) {
    bgStyle.value = `
      background-image: url("${configStore.electionStatus?.theme?.splash}");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    `
  }
});

</script>

<template>
  <header
    class="Splash theme-gradient"
    :style="bgStyle"
    >
  </header>
</template>

<style scoped>
.Splash {
  min-height: 550px;
  width: 100vw;
  margin-bottom: -24rem;
}
</style>
