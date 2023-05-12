<script lang="ts" setup>
defineProps({
  errorPath: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="Error">
    <h2 class="Error__Title">
      <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />
      <span>{{ $t(`errors.${errorPath}.title`) }}</span>
    </h2>
    <p class="Error__Description">
      {{ $t(`errors.${errorPath}.description`) }}
    </p>
  </div>
</template>

<style type="text/css" scoped>
.Error {
  background-color: #fcede9;
  border: none;
  border-left: solid 6px #ea4e2c;
  padding: 17px 36px;
  margin-bottom: 40px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
}

.Error__Title {
  font-weight: 700;
  font-size: 18px;
  color: #495057;
}

svg {
  margin-right: 5px;
  margin-left: 5px;
}
</style>
