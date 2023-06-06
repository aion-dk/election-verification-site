<script lang="ts" setup>
import useLocaleStore from "../stores/useLocaleStore";
import useConfigStore from "../stores/useConfigStore";
import { RouterLink } from "vue-router";

const localeStore = useLocaleStore();
const configStore = useConfigStore();

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
    <RouterLink
      v-if="errorPath === 'track.invalid_code'"
      class="Error__Link"
      role="link"
      :to="`/${localeStore.locale}/${configStore.boardSlug}/verify`"
    >
      {{ $t("errors.go_to_verification") }}
    </RouterLink>
  </div>
</template>

<style type="text/css" scoped>
.Error {
  background-color: var(--av-theme-danger-background);
  color: white;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  text-align: left;
  z-index: 40;
}

.Error__Title {
  font-weight: 600;
  color: white;
}

.Error__Icon_Overrides {
  margin-right: 0.5rem;
}

.Error__Description {
  margin: 0.5rem 0 0 0;
}

.Error__Link {
  color: white;
  text-decoration: underline;
  font-weight: 600;
  margin-top: 1rem;
}
</style>
