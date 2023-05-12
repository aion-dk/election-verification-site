<script setup lang="ts">
import { watch, ref } from "vue";
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

const ballotStore = useBallotStore();
const configStore = useConfigStore();
const localeStore = useLocaleStore();
const route = useRoute();
const isLoaded = ref(false);

watch(route, async (newRoute) => {
  const slug = newRoute.params.electionSlug;

  if (slug) {
    await configStore.loadConfig(slug.toString());
    await setConfigurations(slug.toString());
  }

  const locale = newRoute.params.locale.toString();
  if (locale) localeStore.setLocale(locale);
});

watch(configStore, async () => {
  setTitle();
  if (route.params.electionSlug) {
    await configStore.loadConfig(route.params.electionSlug.toString());

    isLoaded.value = true;

    if (route.params.trackingCode) {
      await ballotStore.loadBallot(
        route.params.trackingCode.toString(),
        configStore.boardSlug
      );
    }
  }
});

function updateLocale(newLocale: Locale) {
  const newUrl = url.pathname.replace(
    `/${localeStore.locale}/`,
    `/${newLocale}/`
  );

  router.replace(newUrl);
  setLocale(newLocale)
  localeStore.setLocale(newLocale);
}

function setTitle() {
  const title = ["DBAS", configStore.election.title[localeStore.locale]].filter(
    (s) => s
  );
  if (window.top) window.top.document.title = title.join(" - ");
}

const setConfigurations = async (slug: string) => {
  let browserLocale = navigator.languages.find((locale) =>
    i18n.global.availableLocales.includes(locale as Locale)
  );
  if (browserLocale) setLocale(browserLocale as Locale);

  const { conferenceClient } = useConferenceConnector(slug);

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
