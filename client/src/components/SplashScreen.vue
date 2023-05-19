<script setup lang="ts">
import { ref, onMounted } from "vue";
import useConfigStore from "../stores/useConfigStore";
const configStore = useConfigStore();
const bgStyle = ref(null);

onMounted(() => {
  bgStyle.value = `
      background-image: url("${configStore.electionStatus?.theme?.splash}");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    `;
});
</script>

<template>
  <header class="Splash theme-gradient" :style="bgStyle"></header>
</template>

<style scoped>
.Splash {
  min-height: 550px;
  width: 100vw;
  margin-bottom: -24rem;
}
</style>
