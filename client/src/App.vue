<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import useConfigStore from "./stores/useConfigStore";
import useBallotStore from "./stores/useBallotStore";
import { useConferenceConnector } from "./lib/conferenceServices";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import router from "./router";
import { loadLocaleMessages, setLocale } from "./lib/i18n";
import i18n from "./lib/i18n";
import type { Locale } from "vue-i18n";
import { fallbackMessages } from "./assets/translations";
import { defaultTheme } from "./assets/theme";

const ballotStore = useBallotStore();
const configStore = useConfigStore();
const route = useRoute();
const isLoaded = ref(false);

onMounted(async () => {
  const organisationSlug = route.params.organisationSlug.toString();
  const electionSlug = route.params.electionSlug.toString();
  await setConfigurations(organisationSlug, electionSlug);
  setTitle();

  if (route.params.trackingCode) {
    await ballotStore.loadBallot(
      route.params.trackingCode.toString(),
      configStore.boardSlug,
    );
  }

  isLoaded.value = true;
});

function updateLocale(newLocale: Locale) {
  const newUrl = route.fullPath.replace(
    `/${i18n.global.locale}/`,
    `/${newLocale}/`,
  );

  router.replace(newUrl);
  setLocale(newLocale);
  setTitle();
}

function setTitle() {
  const siteTitle = i18n.global.messages[i18n.global.locale].site_title;
  const title = [
    configStore.election.title[i18n.global.locale],
    siteTitle,
  ].filter((s) => s);
  if (window.top) window.top.document.title = title.join(" - ");
}

const setConfigurations = async (
  organisationSlug: string,
  electionSlug: string,
) => {
  const { conferenceClient } = useConferenceConnector(
    organisationSlug,
    electionSlug,
  );
  configStore.setBoardSlug((await conferenceClient.getStatus()).boardSlug);
  await configStore.loadConfig();
  await setLanguage(conferenceClient);
  await setTheme(conferenceClient);
};

const setLanguage = async (conferenceClient: any) => {
  const browserLocale: Locale = navigator.languages.find((locale: Locale) =>
    i18n.global.availableLocales.includes(locale),
  );

  if (browserLocale) setLocale(browserLocale);

  const paramLocale = router.currentRoute.value.params.locale?.toString();

  if (configStore.election.locales) {
    const preferredLocale = configStore.election.locales.includes(paramLocale)
      ? paramLocale
      : null;
    const browserLocale = navigator.languages.find((locale) =>
      configStore.election.locales.includes(locale),
    );
    setLocale(
      preferredLocale || browserLocale || configStore.election.locales[0],
    );

    for (let i = 0; i < configStore.election.locales.length; i++) {
      const locale = configStore.election.locales[i];
      const response = await conferenceClient
        .getTranslationsData(configStore.election.locales[i])
        .catch((err: Error) => {
          console.error(err);
        });

      response
        ? loadLocaleMessages(locale, response)
        : loadLocaleMessages(locale, fallbackMessages[locale]);
    }
  }
};

const setTheme = async (conferenceClient: any) => {
  if (!configStore.electionStatus || !configStore.electionTheme) {
    // Setting Splash Image
    const status = await conferenceClient
      .getStatus()
      .catch((err: Error) => console.error(err));
    if (status) configStore.setElectionStatus(status);

    // Setting Theme
    const themeStylingTag: HTMLStyleElement = document.createElement("style");
    configStore.setElectionTheme(
      await conferenceClient
        .getStylingData()
        .then((theme: string) => {
          themeStylingTag.innerHTML = theme.toString();
        })
        .catch((err: Error) => {
          console.error(err);
          themeStylingTag.innerHTML = defaultTheme;
        }),
    );
    document.head.appendChild(themeStylingTag);
  }
};
</script>

<template>
  <div v-if="!isLoaded" class="DBAS__Loading_Page">
    <AVSpinner size="lg" color="dark" />
  </div>
  <div class="DBAS" v-if="isLoaded">
    <a href="#main_content" class="visually-hidden-focusable">
      {{ $t("js.accessibility.skip_to_content") }}
    </a>

    <Header
      :election="configStore.election"
      :electionName="configStore.election.title[$i18n.locale]"
      :locale="$i18n.locale"
      @changeLocale="updateLocale"
    />
    <main class="DBAS__Content">
      <RouterView
        :key="`${route.fullPath}-${configStore.pageRefreshIterator}`"
      />
    </main>
    <Footer />
  </div>
</template>

<style type="text/css">
* {
  box-sizing: border-box !important;
}

body {
  font-family: "Open Sans", sans-serif;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.DBAS__Loading_Page {
  width: 100vw;
  height: 100dvh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.DBAS {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  height: 100vh;
  width: 100vw;
}

.DBAS__Content {
  height: calc(100dvh - 70px);
  height: calc(100vh - 70px);
  margin-top: 70px;
}

.popper-content-wrapper {
  max-width: 25rem;
  --vue-popper-bg: var(--bs-gray-800);
  --vue-popper-padding: 1rem;
  --vue-popper-text-color: white;
  --vue-popper-border-radius: 0px;
  --vue-popper-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.15);
}

@media only screen and (min-width: 80rem) {
  .DBAS__Loading_Page {
    height: 100dvh;
    height: 100vh;
  }
}
</style>
