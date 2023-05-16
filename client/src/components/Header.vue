<script lang="ts" setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import config from "../lib/config";
import DropDown from "./DropDown.vue";
import i18n from "../lib/i18n";
import type { DropdownOption } from "@/Types";
const { t } = i18n.global;

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

function setLocale(newLocale: string) {
  emit("changeLocale", newLocale);
}
</script>

<template>
  <AVNavbar>
    <RouterLink
      class="Header__Election_Info"
      :to="`/${locale}/${election.slug}`"
    >
      <img
        class="Header__Logo"
        aria-hidden="true"
        :src="config.logoUrl"
        alt="DBAS Logo"
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
    <button class="Header__Hamburger_Btn" @click="toggleMenu">
      <AVIcon v-if="isMenuOpened" icon="xmark" />
      <AVIcon v-else icon="bars" />
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
  height: 54px;
  width: 54px;
  object-fit: cover;
  border-radius: 3px;
}

.Header__Text {
  display: flex;
  gap: 1rem;
}

.Header__Title {
  font-weight: 600;
  font-size: 1.625rem;
  line-height: 1.625rem;
  color: #495057;
}

.Header__Subtitle {
  font-size: 1.125rem;
  line-height: 1.625rem;
  color: #495057;
}

.Header__Links {
  display: block;
}

.Header__Hamburger_Btn {
  display: none;
  border: none;
  background: none;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
}

.Header__Link {
  padding: 1.25rem;
  font-size: 1.125rem;
  font-weight: 400;
  text-decoration: none;
  color: #495057;
}

.Header__Link:hover {
  color: #212529;
}

.Header__Locales {
  padding-left: 1rem;
  font-size: 1.125rem;
  font-weight: 400;
  color: #495057;
  border: none;
}

.Header__Locales:hover {
  color: #212529;
}

@media only screen and (max-width: 768px) {
  .Header__Links {
    position: absolute;
    top: 70px;
    left: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: calc(100vh - 70px);
    background-color: white;
  }

  .Header__Link {
    font-size: 1.5rem !important;
    margin-bottom: 3rem;
  }
  .Header__Locales {
    font-size: 1.5rem !important;
  }

  .Header__Hamburger_Btn {
    display: block;
  }

  .Header__Show {
    display: none;
  }
}

@media only screen and (max-width: 976px) {
  .Header__Link {
    font-size: 1rem;
    padding: 0.5rem;
  }

  .Header__Locales {
    font-size: 1rem;
    padding-left: 0.5rem;
  }
}

@media only screen and (max-width: 1440px) {
  .Header__Text {
    flex-direction: column;
    gap: 0;
  }

  .Header__Title {
    font-size: 1.2rem;
    line-height: 1.2rem;
  }

  .Header__Subtitle {
    font-size: 1rem;
    line-height: 1.2rem;
  }
}
</style>
