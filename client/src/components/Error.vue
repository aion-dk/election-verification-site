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
    <span class="Error__Title">
      <AVIcon
        icon="triangle-exclamation"
        class="Error__Icon_Overrides"
        aria-hidden="true"
      />
      <span>{{ $t(`errors.${errorPath}.title`) }}</span>
    </span>
    <p class="Error__Description">
      {{ $t(`errors.${errorPath}.description`) }}
    </p>
  </div>
</template>

<style type="text/css" scoped>
.Error {
  background-color: var(--av-theme-danger-background);
  color: white;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  z-index: 40;
}

html[dir=ltr] .Error {
  text-align: left;
}

html[dir=rtl] .Error {
  text-align: right;
}

.Error__Title {
  font-weight: 600;
  color: white;
}

html[dir=ltr] .Error__Icon_Overrides {
  margin-right: 0.5rem;
}

html[dir=rtl] .Error__Icon_Overrides {
  margin-left: 0.5rem;
}


.Error__Description {
  margin: 0.5rem 0 0 0;
}
</style>
