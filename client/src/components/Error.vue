<script lang="ts" setup>
const props = defineProps({
  errorPath: {
    type: String,
    required: true,
  },
});

const safeId = (prefix: string) =>
  `${prefix}-${props.errorPath.replace(/\./g, "-")}`;
</script>

<template>
  <div class="Error" :id="safeId('error')">
    <span class="Error__Title" :id="safeId('error-title')">
      <AVIcon
        icon="triangle-exclamation"
        class="Error__Icon_Overrides"
        aria-hidden="true"
        :id="safeId('error-icon')"
      />
      <span :id="safeId('error-title-text')">{{
        $t(`errors.${errorPath}.title`)
      }}</span>
    </span>
    <p class="Error__Description" :id="safeId('error-description')">
      {{ $t(`errors.${errorPath}.description`) }}
    </p>
  </div>
</template>

<style type="text/css" scoped>
.Error {
  background-color: var(--av-theme-danger-background);
  color: var(--av-theme-danger-text);
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  z-index: 40;
  width: 100%;
}

html[dir="ltr"] .Error {
  text-align: left;
}

html[dir="rtl"] .Error {
  text-align: right;
}

.Error__Title {
  font-weight: 600;
  color: var(--av-theme-danger-text);
}

html[dir="ltr"] .Error__Icon_Overrides {
  margin-right: 0.5rem;
}

html[dir="rtl"] .Error__Icon_Overrides {
  margin-left: 0.5rem;
}

.Error__Description {
  margin: 0.5rem 0 0 0;
}
</style>
