<script lang="ts" setup>
import { RouterLink } from "vue-router";
import DropDown from '@/components/DropDown.vue'

defineProps({

});
</script>

<template>
  <div class="Header__Links">
    <RouterLink
      class="Header__Link"
      role="menuitem"
      :to="`/${locale}/${election.slug}/about`"
    >
      {{ $t("header.about") }}
    </RouterLink>

    <RouterLink
      role="menuitem"
      class="Header__Link"
      :to="`/${locale}/${election.slug}/logs`"
    >
      {{ $t("header.logs") }}
    </RouterLink>

    <RouterLink
      role="menuitem"
      class="Header__Link"
      :to="`/${locale}/${election.slug}/help`"
    >
      {{ $t("header.help") }}
    </RouterLink>

    <a
      role="menuitem"
      class="Header__Link"
      :href="config.contactUrl"
      target="_blank"
    >
      {{ $t("header.contact") }}
      <font-awesome-icon
        aria-hidden="true"
        icon="fa-solid fa-arrow-up-right-from-square"
      />
    </a>

    <DropDown
      class="Header__Locales"
      :options="availableLocales"
      @change="(value) => setLocale(value)"
    />
  </div>
</template>

<style type="text/css" scoped>
select {
  font-family: "Open Sans";
}
</style>
