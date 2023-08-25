<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import DropDown from "./DropDown.vue";
import i18n from "../lib/i18n";
import type { DropdownOption } from "@/Types";
import useConfigStore from "../stores/useConfigStore";

const { t } = i18n.global;
const configStore = useConfigStore();
const contactUrl = ref(null);

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

const toggleMenu = () => {
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

watch(i18n, () => {
  contactUrl.value =
    configStore.electionStatus?.electionVerificationSite?.contactUrl[
      i18n.global.locale
    ];
});

onMounted(() => {
  if (configStore.electionStatus?.electionVerificationSite?.contactUrl)
    contactUrl.value =
      configStore.electionStatus?.electionVerificationSite?.contactUrl[
        i18n.global.locale
      ];
});
</script>

<template>
  <AVNavbar class="Header__Navbar_Overrides">
    <RouterLink
      class="Header__Election_Info"
      :to="`/${locale}/${election.slug}`"
    >
      <img
        v-if="configStore.electionStatus?.theme?.logo"
        class="Header__Logo"
        aria-hidden="true"
        :src="configStore.electionStatus?.theme?.logo"
        :alt="$t('header.election_logo_alt')"
        loading="lazy"
      />
      <div class="Header__Text">
        <span class="Header__Title">{{ $t("header.dbas") }}</span>
        <span class="Header__Subtitle">{{ electionName }}</span>
      </div>
    </RouterLink>

    <div
      class="Header__Links"
      :class="{
        Header__Show: !isMenuOpened,
      }"
    >
      <RouterLink
        class="Header__Link"
        role="menuitem"
        :to="`/${locale}/${election.slug}/verify`"
        @click="toggleMenu"
      >
        {{ $t("header.verification") }}
      </RouterLink>

      <RouterLink
        class="Header__Link"
        role="menuitem"
        :to="`/${locale}/${election.slug}/track`"
        @click="toggleMenu"
      >
        {{ $t("header.tracking") }}
      </RouterLink>

      <RouterLink
        role="menuitem"
        class="Header__Link"
        :to="`/${locale}/${election.slug}/logs`"
        @click="toggleMenu"
      >
        {{ $t("header.logs") }}
      </RouterLink>

      <RouterLink
        role="menuitem"
        class="Header__Link"
        :to="`/${locale}/${election.slug}/help`"
        @click="toggleMenu"
      >
        {{ $t("header.help") }}
      </RouterLink>

      <a
        v-if="contactUrl"
        role="menuitem"
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
    </div>
    <button
      class="Header__Hamburger_Btn"
      :aria-label="
        isMenuOpened
          ? $t('header.close_menu_aria_label')
          : $t('header.open_menu_aria_label')
      "
      @click="toggleMenu"
    >
      <AVIcon
        v-if="isMenuOpened"
        icon="xmark"
        class="Header__Hamburger_Icon"
        aria-hidden="true"
      />
      <AVIcon
        v-else
        icon="bars"
        class="Header__Hamburger_Icon"
        aria-hidden="true"
      />
    </button>
  </AVNavbar>
</template>

<style type="text/css" scoped>
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
  color: var(--slate-800);
}

.Header__Subtitle {
  font-size: 1rem;
  color: var(--slate-700);
}

.Header__Hamburger_Btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  color: var(--slate-800);
}

.Header__Link {
  padding: 1.25rem;
  font-size: 1.125rem;
  font-weight: 400;
  text-decoration: none;
  color: var(--slate-700);
}

.Header__Link:hover {
  color: var(--slate-900);
}

.Header__Locales {
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--slate-700);
  border: none;
}

html[dir=ltr] .Header__Locales {
  padding: 1rem 0 1rem 1rem;
}

html[dir=rtl] .Header__Locales {
  padding: 1rem 1rem 1rem 0;
}

.Header__Locales:hover {
  color: var(--slate-900);
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

@media only screen and (min-width: 48rem) and (min-height: 50rem) {
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
}

@media only screen and (min-width: 48rem) and (min-height: 68rem) {
  .Header__Logo {
    height: 3rem;
    max-width: 12rem;
    object-fit: contain;
    display: block;
  }

  .Header__Link {
    font-size: 1.5rem;
    margin: 1rem 0;
  }

  .Header__Link:first-of-type {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
  }

  .Header__Locales {
    font-size: 1.5rem;
    margin: 1rem 0;
  }
}

@media only screen and (min-width: 80rem) {
  .Header__Navbar_Overrides {
    padding-right: 1.5rem !important;
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
    color: var(--slate-900);
  }

  .Header__Locales:hover {
    color: var(--slate-900);
  }
}
</style>
