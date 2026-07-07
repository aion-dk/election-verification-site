<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import DropDown from "./DropDown.vue";
import { useI18n } from "vue-i18n";
import type { DropdownOption } from "@/Types";
import useConfigStore from "@/stores/useConfigStore";

const i18n = useI18n();
const { t } = i18n;
const configStore = useConfigStore();
const route = useRoute();
const contactUrl = computed(
  () =>
    configStore.electionStatus?.electionVerificationSite?.contactUrl[
      i18n.locale.value
    ] || null,
);

const props = defineProps({
  locale: {
    type: String,
    required: true,
  },
  election: {
    type: Object,
    required: true,
  },
  electionName: {
    type: String,
    default: "",
  },
});

const isMenuOpened = ref<boolean>(false);

const toggleMenu = (force = false) => {
  if (force) configStore.pageReloaded();
  isMenuOpened.value = !isMenuOpened.value;
};

const emit = defineEmits(["changeLocale"]);

const availableLocales = computed(() => {
  return props.election.locales.map((lang: unknown): DropdownOption => {
    return {
      selected: lang === props.locale,
      value: lang.toString(),
      display: t(`locales.${lang}`),
    };
  });
});

const setLocale = (newLocale: string) => {
  emit("changeLocale", newLocale);
};

const onResize = () => (isMenuOpened.value = false);

onMounted(() => {
  globalThis.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  globalThis.removeEventListener("resize", onResize);
});
</script>

<template>
  <header
    class="Header__Navbar bg-white shadow-sm px-3 px-md-4 py-0"
    id="header-navbar"
  >
    <RouterLink
      class="Header__Election_Info"
      :to="`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}`"
      id="header-election-info-link"
    >
      <img
        id="header-logo"
        v-if="configStore.electionStatus?.theme?.logo"
        class="Header__Logo"
        :src="configStore.electionStatus?.theme?.logo"
        :alt="$t('header.election_logo_alt')"
        loading="lazy"
        style="height: 2.75rem; max-width: 12rem; object-fit: scale-down"
      />
      <span v-else class="Header__Title" id="header-title">{{
        $t("header.dbas")
      }}</span>
    </RouterLink>

    <nav
      class="Header__Links"
      :aria-label="$t('accessibility.main_navigation')"
      :class="{
        Header__Show: !isMenuOpened,
      }"
      id="header-nav"
    >
      <RouterLink
        v-if="!configStore.electionStatus?.canadianChallenge"
        class="Header__Link"
        activeClass="active"
        :to="`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/verify`"
        @click="toggleMenu(true)"
        id="header-link-verification"
      >
        {{ $t("header.verification") }}
      </RouterLink>

      <RouterLink
        class="Header__Link"
        activeClass="active"
        :to="`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/track`"
        @click="toggleMenu(true)"
        id="header-link-tracking"
      >
        {{ $t("header.tracking") }}
      </RouterLink>

      <RouterLink
        class="Header__Link"
        activeClass="active"
        :to="`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/logs`"
        @click="toggleMenu()"
        id="header-link-logs"
      >
        {{ $t("header.logs") }}
      </RouterLink>

      <RouterLink
        class="Header__Link"
        activeClass="active"
        :to="`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/help`"
        @click="toggleMenu()"
        id="header-link-help"
      >
        {{ $t("header.help") }}
      </RouterLink>

      <a
        v-if="contactUrl"
        class="Header__Link"
        :href="contactUrl"
        target="_blank"
        rel="noopener noreferrer"
        id="header-link-contact"
      >
        {{ $t("header.contact") }}
        <AVIcon icon="arrow-up-right-from-square" aria-hidden="true" />
      </a>

      <DropDown
        id="localizationDropdownMenu"
        class="Header__Locales"
        :options="availableLocales"
        @change="(value) => setLocale(value)"
      />
    </nav>

    <div class="Header__Hamburger_Btn" id="header-hamburger-btn">
      <AVAnimatedMenuButton
        variant="cross"
        theme="light"
        class="bg-white"
        v-model:is-opened="isMenuOpened"
        id="header-hamburger-menu-button"
      />
    </div>
  </header>
</template>

<style type="text/css" scoped>
.Header__Navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100vw;
}

.Header__Election_Info {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 1rem;
}

.Header__Logo {
  width: auto;
  object-fit: scale-down;
}

.Header__Text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.Header__Title {
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.25rem;
  color: var(--bs-gray-800);
}

.Header__Subtitle {
  font-size: 1rem;
  color: var(--bs-gray-700);
}

.Header__Hamburger_Btn {
  display: block;
}

.Header__Link {
  padding: 1.25rem;
  font-size: 1.125rem;
  font-weight: 400;
  text-decoration: none;
  color: var(--bs-gray-700);

  &.active {
    font-weight: 600;
    color: var(--bs-gray-800);
  }
}

.Header__Link:hover {
  color: var(--bs-gray-900);
}

.Header__Locales {
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--bs-gray-700);
  border: none;
  background-color: white;
}

:deep(.Header__Locales select) {
  border: none;
  background: transparent;
  appearance: none;
  padding: 0.3rem 1rem;
}

html[dir="ltr"] .Header__Locales {
  padding: 1rem 0 1rem 1rem;
}

html[dir="rtl"] .Header__Locales {
  padding: 1rem 1rem 1rem 0;
}

.Header__Locales:hover {
  color: var(--bs-gray-900);
}

.Header__Links {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100dvh;
  padding-top: 5rem;
  padding-bottom: 3rem;
  background-color: white;
}

.Header__Show {
  display: none;
}

@media only screen and (min-width: 48rem) {
  .Header__Link {
    font-size: 1.2rem;
    margin: 0.5rem 0;
  }

  .Header__Link:first-of-type {
    font-size: 1.2rem;
    margin: 0 0 0.5rem 0;
  }

  .Header__Locales {
    font-size: 1.2rem;
    margin: 0.5rem 0;
  }

  .Header__Logo {
    height: 2.75rem;
    max-width: 12rem;
    object-fit: scale-down;
    display: block;
  }
}

@media only screen and (min-width: 80rem) {
  .Header__Hamburger_Btn {
    display: none;
  }

  .Header__Logo {
    height: 2.75rem;
    max-width: 12rem;
    object-fit: scale-down;
    display: block;
  }

  .Header__Links {
    position: static;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: auto;
    padding-top: 0;
    padding-bottom: 0;
  }

  .Header__Link {
    padding: 1rem;
    font-size: 1.125rem;
    font-weight: 400;
    text-decoration: none;
  }

  .Header__Link:first-of-type {
    margin: 0;
    font-size: 1.125rem;
  }

  .Header__Locales {
    font-size: 1.125rem;
    padding-left: 1rem;
  }

  .Header__Link:hover {
    color: var(--bs-gray-900);
  }

  .Header__Locales:hover {
    color: var(--bs-gray-900);
  }
}
</style>
