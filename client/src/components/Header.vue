<script lang="ts" setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import config from "../lib/config";
import DropDown from "./DropDown.vue";
import { uniq } from "lodash";
import i18n from "../lib/i18n";
import type { DropdownOption } from "@/Types";
import HamburgerIcon from "@/components/HamburgerIcon.vue";
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

const links = [
  {
    text: "header.logs",
    route: `/${props.locale}/${props.election.slug}/logs`,
  },
];

const emit = defineEmits(["changeLocale"]);

const _locales = computed(() => uniq(props.election.locales || ["en"]));
const availableLocales = computed(() => {
  return _locales.value.map((l: unknown): DropdownOption => {
    return {
      selected: l === props.locale,
      value: l.toString(),
      display: t(`locales.${l}`),
    };
  });
});

function setLocale(newLocale: string) {
  emit("changeLocale", newLocale);
}

function toggleMobileMenu() {
  let menuButton = document.getElementById("BurgerButton");
  let menu = document.getElementById("LinksMobile");
  menuButton.classList.toggle("active");
  menu.classList.toggle("open");
}
</script>

<template>
  <AVNavbar class="Navbar">
    <div class="Header__Brand">
      <img
        class="Header__Logo"
        aria-hidden="true"
        :src="config.logoUrl"
        alt="DBAS Logo"
      />

      <RouterLink class="Header__Title" :to="`/${locale}/${election.slug}`">
        {{ $t("header.dbas") }}
      </RouterLink>
    </div>
    <button
      id="BurgerButton"
      class="Header__BurgerButton"
      @click="toggleMobileMenu"
    >
      <HamburgerIcon :stroke="'#495057'" class="Header__BurgerIcon" />
    </button>

    <div class="Header__Links">
      <RouterLink
        role="menuitem"
        class="Header__Link"
        v-for="link in links"
        :key="link.route"
        :to="link.route"
      >
        {{ $t(link.text) }}
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
  </AVNavbar>
  <div id="LinksMobile" class="Header__LinksMobile">
    <RouterLink
      role="menuitem"
      class="Header__Link"
      v-for="link in links"
      :key="link.route"
      :to="link.route"
      @click="toggleMobileMenu"
    >
      {{ $t(link.text) }}
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
      class="Header__Link"
      :options="availableLocales"
      @change="(value) => setLocale(value)"
    />
  </div>
</template>

<style type="text/css" scoped>
.AVNavbar.Navbar {
  position: relative;
  box-sizing: border-box;
  font-family: "Open Sans", sans-serif;
}

.Header__Brand {
  display: flex;
  align-items: center;
}

.Header__BurgerButton {
  display: none;
  border: 0;
  border-radius: 5px;
  padding: 1.5rem;
  margin-right: 0.5rem;
  background: transparent;
}

.Header__BurgerButton.active {
  background: #efefef;
}

.Header__BurgerIcon {
  scale: 1.5;
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

.Header__LinksMobile {
  background: white;
  display: none;
}

.Header__Link.router-link-active {
  background-color: #efefef;
}

.Header__Link {
  padding: 20px;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  color: #495057;
}

.Header__LinksMobile .Header__Link {
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  color: #495057;
  border: none;
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

@media (max-width: 992px) {
  .AVNavbar.Navbar {
    position: relative;
    min-height: 70px;
    height: 0;
  }
  .Header__Links {
    display: none;
  }

  .Header__Title {
    font-size: 20px;
  }

  .Header__BurgerButton {
    display: block;
  }

  .Header__LinksMobile.open {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
  }
}
</style>
