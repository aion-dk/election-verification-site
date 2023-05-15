<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import useLocaleStore from "./stores/useLocaleStore";
import useConfigStore from "./stores/useConfigStore";
import useBallotStore from "./stores/useBallotStore";
import { useConferenceConnector } from "./lib/conferenceServices";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import router from "./router";
import { loadLocaleMessages, setLocale } from "./lib/i18n";
import i18n from "./lib/i18n";
import type { Locale } from "./Types";
import defaultSplashImg from "./assets/splash.jpg";

const ballotStore = useBallotStore();
const configStore = useConfigStore();
const localeStore = useLocaleStore();
const route = useRoute();
const isLoaded = ref(false);

onMounted(async () => {
  await router.isReady();
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
})

watch(route, async (newRoute) => {
  localeStore.setLocale(newRoute.params.locale.toString());
});

function updateLocale(newLocale: Locale) {
  const newUrl = route.fullPath.replace(
    `/${localeStore.locale}/`,
    `/${newLocale}/`
  );

  router.replace(newUrl);
  setLocale(newLocale);
  localeStore.setLocale(newLocale);
}

function setTitle() {
  const title = ["DBAS", configStore.election.title[localeStore.locale]].filter(
    (s) => s
  );
  if (window.top) window.top.document.title = title.join(" - ");
}

const setConfigurations = async (slug: string) => {
  const { conferenceClient } = useConferenceConnector(slug);
  setLanguage(conferenceClient);
  setTheme(conferenceClient);
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
      loadLocaleMessages(
        configStore.election.locales[i],
        await conferenceClient.getTranslationsData(
          configStore.election.locales[i]
        )
      );
    }
  }
};

const setTheme = async (conferenceClient: any) => {
  if (!configStore.electionStatus || !configStore.electionTheme) {
    // Setting Splash Image
    configStore.setElectionStatus(await conferenceClient.getStatus());

    const splashStyle = `\n
      .election-banner {
        position: absolute;
        top: 70px;
        left: 0;
        z-index: -99;
        min-height: 580px;
        width: 100vw;
        background-image: url("${
          configStore.electionStatus?.theme?.splash
            ? configStore.electionStatus?.theme?.splash
            : defaultSplashImg
        }");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      } \n`;

    // Setting Theme
    configStore.setElectionTheme(
      await conferenceClient
        .getStylingData()
        .then((theme: string) => (theme += splashStyle))
    );

    const themeStylingTag: HTMLStyleElement = document.createElement("style");
    themeStylingTag.innerHTML = splashStyle.toString();
    document.head.appendChild(themeStylingTag);
  }
};
</script>

<template>
  <div class="DBAS" v-if="isLoaded">
    <!-- <a href="#main" class="DBAS_SkipToContentLink">Skip to main content</a> -->

    <Header
      :election="configStore.election"
      :locale="localeStore.locale"
      @changeLocale="updateLocale"
    />
    <main class="DBAS__Content" id="main">
      <RouterView class="DBAS__InnerContent" />
    </main>
    <Footer />
  </div>
</template>

<style type="text/css">
body {
  padding: 0;
  margin: 0;
}

.DBAS {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.DBAS__Content {
  height: calc(100vh - 120px);
  margin-top: 80px;
  overflow-y: scroll;
}

.DBAS__InnerContent {
  width: 80vw;
  margin: auto;
  padding: 0;
}

.popper-content-wrapper {
  max-width: 400px;
  --vue-popper-bg: #000;
  --vue-popper-padding: 6px;
  --vue-popper-text-color: #fff;
  --vue-popper-border-radius: 3px;
}

.Tooltip {
  cursor: help;
}

.DBAS_SkipToContentLink {
  position: absolute;
  margin-top: -100px;
}

.DBAS_SkipToContentLink:focus {
  margin-top: 100px;
}
</style>
