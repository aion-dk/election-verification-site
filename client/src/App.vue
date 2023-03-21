<script setup lang="ts">
import { watch, computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import useLocaleStore from "./stores/useLocaleStore";
import useElectionStore from "./stores/useElectionStore";
import useBallotStore from "./stores/useBallotStore";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import router from "./router";
import i18n from "./lib/i18n";

const ballotStore = useBallotStore();
const electionStore = useElectionStore();
const localeStore = useLocaleStore();
const route = useRoute();

watch(route, async (newRoute) => {
  const slug = newRoute.params.electionSlug;
  if (slug) electionStore.loadElection(slug.toString());

  const locale = newRoute.params.locale as string;
  if (locale) localeStore.setLocale(locale);
});

watch(electionStore, () => {
  setTitle();
  if (route.params.electionSlug) {
    electionStore.loadElection(route.params.electionSlug as string);

    if (route.params.trackingCode) {
      ballotStore.loadBallot(
        route.params.trackingCode as string,
        electionStore.election.slug
      );
    }
  }
});

const locale = computed(() => localeStore.locale);

function setTitle() {
  const title = [
    "DBAS",
    electionStore.election?.content?.title[localeStore.locale],
  ].filter((s) => s);
  if (window.top) window.top.document.title = title.join(" - ");
}

type Locale = `en` | `es`;

function changeLocale(newLocale: Locale) {
  console.log(newLocale);
  const url = new URL(window.location.href);
  const newUrl = url.pathname.replace(
    `/${localeStore.locale}/`,
    `/${newLocale}/`
  );

  i18n.global.locale = newLocale;
  localeStore.setLocale(newLocale);
  router.replace(newUrl);
}
</script>

<template>
  <div class="DBAS">
    <!-- <a href="#main" class="DBAS_SkipToContentLink">Skip to main content</a> -->

    <Header
      :election="electionStore.election"
      :locale="locale"
      @changeLocale="changeLocale"
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
