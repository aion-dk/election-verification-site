<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import useConfigStore from "./stores/useConfigStore";
import useBallotStore from "./stores/useBallotStore";
import { useConferenceConnector } from "./lib/conferenceServices";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import router from "./router";
import { loadLocaleMessages, setLocale } from "./lib/i18n";
import i18n from "./lib/i18n";
import type { Locale } from "./Types";
import { fallbackMessages } from "./assets/translations";
import { defaultTheme } from "./assets/theme";

const ballotStore = useBallotStore();
const configStore = useConfigStore();
const route = useRoute();
const isLoaded = ref(false);
const electionName = ref("");

onMounted(async () => {
  const slug = route.params.electionSlug.toString();
  await configStore.loadConfig(slug);
  await setConfigurations(slug);
  setTitle();

  if (route.params.trackingCode) {
    await ballotStore.loadBallot(
      route.params.trackingCode.toString(),
      configStore.boardSlug
    );
  }

  isLoaded.value = true;
});

function updateLocale(newLocale: Locale) {
  const newUrl = route.fullPath.replace(
    `/${i18n.global.locale}/`,
    `/${newLocale}/`
  );

  router.replace(newUrl);
  setLocale(newLocale);
}

function setTitle() {
  const title = ["EVS", configStore.election.title[i18n.global.locale]].filter(
    (s) => s
  );
  if (window.top) window.top.document.title = title.join(" - ");
  electionName.value = configStore.election.title[i18n.global.locale];
}

const setConfigurations = async (slug: string) => {
  const { conferenceClient } = useConferenceConnector(slug);
  await setLanguage(conferenceClient);
  await setTheme(conferenceClient);
};

const setLanguage = async (conferenceClient: any) => {
  let browserLocale = navigator.languages.find((locale) =>
    i18n.global.availableLocales.includes(locale as Locale)
  );

  if (browserLocale) setLocale(browserLocale as Locale);

  let paramLocale = router.currentRoute.value.params.locale?.toString();

  if (configStore.election.locales) {
    let preferredLocale = configStore.election.locales.includes(paramLocale)
      ? paramLocale
      : null;
    let browserLocale = navigator.languages.find((locale) =>
      configStore.election.locales.includes(locale)
    );
    setLocale(
      preferredLocale || browserLocale || configStore.election.locales[0]
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
        : loadLocaleMessages(locale, (fallbackMessages as any)[locale]);
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
        })
    );
    document.head.appendChild(themeStylingTag);
  }
};
</script>

<template>
  <div v-if="!isLoaded" class="DBAS__Loading_Page">
    <AVSpinner size="xlarge" color="neutral" />
  </div>
  <div class="DBAS" v-if="isLoaded">
    <a href="#main" class="DBAS_SkipToContentLink">Skip to main content</a>

    <Header
      :election="configStore.election"
      :electionName="electionName"
      :locale="$i18n.locale"
      @changeLocale="updateLocale"
    />
    <main class="DBAS__Content" id="main">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style type="text/css">
* {
  box-sizing: border-box !important;
}

body {
  /* Neutral colors from AV design system */
  --slate-100: #f7f7f7;
  --slate-200: #e9ecef;
  --slate-300: #dee2e6;
  --slate-400: #ced4da;
  --slate-500: #adb5bd;
  --slate-600: #6c757d;
  --slate-700: #495057;
  --slate-800: #343a40;
  --slate-900: #212529;

  font-family: "Open Sans", sans-serif;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.DBAS__Loading_Page {
  width: 100vw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.DBAS {
  display: flex;
  flex-direction: column;
}

.DBAS__Content {
  height: calc(100vh - 70px);
  margin-top: 70px;
}

.popper-content-wrapper {
  max-width: 25rem;
  --vue-popper-bg: var(--slate-800);
  --vue-popper-padding: 1rem;
  --vue-popper-text-color: white;
  --vue-popper-border-radius: 0px;
  --vue-popper-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.15);
}

.Tooltip {
  cursor: help;
}

.DBAS_SkipToContentLink {
  position: absolute;
  margin-top: -6rem;
}

.DBAS_SkipToContentLink:focus {
  margin-top: 6rem;
  margin-left: 2rem;
}

@media only screen and (min-width: 80rem) and (min-height: 45rem) {
  .DBAS__Loading_Page {
    height: 100vh;
  }
}
</style>
