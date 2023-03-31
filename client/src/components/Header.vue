<script lang="ts" setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import config from "../lib/config";
import DropDown from "./DropDown.vue"
import { uniq } from "lodash"
import i18n from "../lib/i18n";
const { t } = i18n.global;

const props = defineProps({
  locale: {
    type: String,
    default: "en",
  },
  election: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["changeLocale"]);

const _locales = computed(() => uniq(props.election.content?.locales || ["en"]));
const availableLocales = computed(() => {
  const arr = []
  _locales.value.map(l => {
    arr.push({
      selected: l === props.locale,
      value: l,
      display: t(`locales.${l}`),
    })
  })

  return arr
})

function setLocale(newLocale: string) {
  console.log("Setting new locale", newLocale)
  emit("changeLocale", newLocale);
}
</script>

<template>
  <nav class="Header" role="menubar">
    <img
      class="Header__Logo"
      aria-hidden="true"
      :src="config.logoUrl"
      alt="DBAS Logo"
    />

    <RouterLink class="Header__Title" :to="`/${locale}/${election.slug}`">
      {{ $t("header.dbas") }}
    </RouterLink>

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
        @change="(value) => setLocale(value)" />
    </div>
  </nav>
</template>

<style type="text/css" scoped>
.Header {
  display: flex;
  font-family: "Open Sans";
  align-items: center;
  box-shadow: 0px 4px 10px #ccc;
  position: fixed;
  width: 100%;
  z-index: 2;
  background-color: #fff;
  box-sizing: border-box;
}

.Header__Title {
  font-weight: 600;
  font-size: 26px;
  margin: 0;
  padding: 0;
  text-decoration: none;
  color: #495057;
}

.Header__Logo {
  height: 54px;
  width: 54px;
  object-fit: cover;
  margin: 8px 11px;
  border-radius: 3px;
}

.Header__Links {
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
  display: flex;
}

.Header__Link {
  padding: 20px;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  color: #495057;
}

.Header__Locales {
  margin-right: 20px;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  color: #495057;
  border: none;
}
</style>
