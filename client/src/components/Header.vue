<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import config from "../lib/config";
import DropDown from "./DropDown.vue";
import { uniq } from "lodash";
import i18n from "../lib/i18n";
import type { DropdownOption, RouteGroups } from "@/Types";
import useLocaleStore from "../stores/useLocaleStore";

const { t } = i18n.global;
const route = useRoute();
const localeStore = useLocaleStore();

const props = defineProps({
  locale: {
    type: String,
    default: "en",
  },
  election: {
    type: Object,
    required: true,
  },
  displayElectionName: {
    type: Boolean,
    default: true,
  },
});

const _locales = computed(() => uniq(props.election.locales || ["en"]));
const name = computed(() => props.election.title[props.locale]);
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
  localeStore.setLocale(newLocale);
}

const routeGroups: RouteGroups = {
  track: ["BallotTrackerView", "BallotTrackerStart"],
  verify: ["BallotVerifierView", "BallotVerifierStart", "BallotVerifierFound"],
  logs: ["LogsView"],
};

function classes(name: string) {
  return {
    Header__Link: true,
    "router-link-active":
      (routeGroups[name] || []).indexOf(route.name.toString()) >= 0,
  };
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

    <RouterLink
      class="Header__Title"
      :to="`/${locale}/${election.slug}`"
      v-if="displayElectionName"
    >
      <span>{{ $t("header.dbas") }}</span>
      <span class="sub">{{ name }}</span>
    </RouterLink>

    <div class="Header__Links">
      <RouterLink
        role="menuitem"
        :class="classes('verify')"
        :to="{ name: 'BallotVerifierStart' }"
      >
        <span>{{ $t("header.check") }}</span>
      </RouterLink>

      <RouterLink
        role="menuitem"
        :class="classes('track')"
        :to="{ name: 'BallotTrackerStart' }"
      >
        <span>{{ $t("header.track") }}</span>
      </RouterLink>

      <RouterLink
        id="logs"
        role="menuitem"
        :class="classes('logs')"
        :to="{ name: 'LogsView', params: { type: 'config', page: 1 } }"
      >
        <span>{{ $t("header.logs.logs") }}</span>
        <ul id="logs-submenu">
          <li>
            <RouterLink
              :to="{ name: 'LogsView', params: { type: 'activity', page: 1 } }"
              >{{ $t("header.logs.activity") }}</RouterLink
            >
          </li>
          <li>
            <RouterLink
              :to="{ name: 'LogsView', params: { type: 'config', page: 1 } }"
              >{{ $t("header.logs.config") }}</RouterLink
            >
          </li>
        </ul>
      </RouterLink>

      <RouterLink
        :class="classes('AboutView')"
        role="menuitem"
        :to="{ name: 'AboutView' }"
      >
        <span>{{ $t("header.about") }}</span>
      </RouterLink>

      <RouterLink
        role="menuitem"
        :class="classes('HelpView')"
        :to="{ name: 'HelpView' }"
      >
        <span>{{ $t("header.help") }}</span>
      </RouterLink>

      <a
        role="menuitem"
        class="Header__Link"
        :href="config.contactUrl"
        target="_blank"
      >
        <span>
          <font-awesome-icon
            aria-hidden="true"
            icon="fa-solid fa-arrow-up-right-from-square"
          />
          {{ $t("header.contact") }}
        </span>
      </a>

      <DropDown
        class="Header__Locales"
        :options="availableLocales"
        @change="(value) => setLocale(value)"
      />
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
  height: 70px;
}

.Header__Title {
  font-weight: 600;
  font-size: 22px;
  margin: 0;
  padding: 0;
  text-decoration: none;
  color: #495057;
  display: flex;
  flex-direction: column;
}

.Header__Title .sub {
  font-size: 16px;
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
  font-size: 16px;
  text-decoration: none;
  color: #495057;
  border: none;
}

.Header__Links .router-link-active span {
  border: solid 2px #dee2e6;
  border-radius: 12px;
  padding: 7px 8px;
}

#logs-submenu {
  display: none;
  position: absolute;
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
  box-shadow: 0px 4px 10px #ccc;
  margin-top: 20px;
}

#logs-submenu a {
  display: block;
  padding: 16px 20px;
}

#logs:hover #logs-submenu {
  display: block;
}
</style>
