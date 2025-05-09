<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import DropDown from "./DropDown.vue";
import i18n from "@/lib/i18n";
import type { DropdownOption } from "@/Types";
import useConfigStore from "@/stores/useConfigStore";

const { t } = i18n.global;
const configStore = useConfigStore();
const route = useRoute();
const contactUrl = computed(
  () =>
    configStore.electionStatus?.electionVerificationSite?.contactUrl[
      i18n.global.locale
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
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
});
</script>

<template>
  <div class="Header__Navbar">
    <RouterLink
      class="Header__Election_Info"
      :to="`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}`"
    >
      <img
        v-if="configStore.electionStatus?.theme?.logo"
        class="Header__Logo"
        :src="configStore.electionStatus?.theme?.logo"
        :alt="$t('header.election_logo_alt')"
        loading="lazy"
      />
      <div class="Header__Text">
        <span class="Header__Title">{{ $t("header.dbas") }}</span>
        <span class="Header__Subtitle">{{ electionName }}</span>
      </div>
    </RouterLink>

    <nav
      class="Header__Links"
      :class="{
        Header__Show: !isMenuOpened,
      }"
    >
      <RouterLink
        class="Header__Link"
        activeClass="active"
        :to="`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/verify`"
        @click="toggleMenu(true)"
      >
        {{ $t("header.verification") }}
      </RouterLink>

      <RouterLink
        class="Header__Link"
        activeClass="active"
        :to="`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/track`"
        @click="toggleMenu(true)"
      >
        {{ $t("header.tracking") }}
      </RouterLink>

      <RouterLink
        class="Header__Link"
        activeClass="active"
        :to="`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/logs`"
        @click="toggleMenu()"
      >
        {{ $t("header.logs") }}
      </RouterLink>

      <RouterLink
        class="Header__Link"
        activeClass="active"
        :to="`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/help`"
        @click="toggleMenu()"
      >
        {{ $t("header.help") }}
      </RouterLink>

      <a
        v-if="contactUrl"
        class="Header__Link"
        :href="contactUrl"
        target="_blank"
      >
        {{ $t("header.contact") }}
        <AVIcon icon="arrow-up-right-from-square" aria-hidden="true" />
      </a>

      <DropDown
        class="Header__Locales"
        :options="availableLocales"
        @change="(value) => setLocale(value)"
      />
    </nav>

    <div class="Header__Hamburger_Btn">
      <AVAnimatedMenuButton
        variant="cross"
        theme="light"
        class="bg-white"
        v-model:is-opened="isMenuOpened"
      />
    </div>
  </div>
</template>

<style type="text/css" scoped>
.Header__Navbar {
  padding-right: 1.5rem;
  padding-left: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  background-color: white;
  box-sizing: border-box;
  width: 100vw;
  height: 70px;
  box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.15);
}

.Header__Election_Info {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 1rem;
}

.Header__Logo {
  display: none;
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
  position: absolute;
  top: 70px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: calc(100dvh - 70px);
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
    height: 3rem;
    max-width: 12rem;
    object-fit: contain;
    display: block;
  }
}

@media only screen and (min-width: 80rem) {
  .Header__Navbar_Overrides {
    padding-right: 1.5rem !important;
    padding-left: 1rem !important;
  }

  .Header__Hamburger_Btn {
    display: none;
  }

  .Header__Logo {
    height: 3rem;
    object-fit: contain;
    display: block;
  }

  .Header__Links {
    display: block;
    position: static;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 2.5rem;
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
