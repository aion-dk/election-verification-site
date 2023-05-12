<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";
import useLocaleStore from "../stores/useLocaleStore";
import CompactHeader from "../components/CompactHeader.vue";
import Infobox from "../components/Infobox.vue";

const localeStore = useLocaleStore();
const configStore = useConfigStore();
</script>

<template>
  <div class="BallotVerifier">
    <CompactHeader
      :election="configStore.election"
      :locale="localeStore.locale"
    />

    <div class="BallotVerifier__Found">
      <Infobox class="BallotVerifier__Infobox" id="infobox">
        <h2>{{ $t("views.verifier.found.title") }}</h2>
        <p>{{ $t("views.verifier.found.description") }}</p>
      </Infobox>
    </div>
  </div>
</template>

<style type="text/css" scoped>
.BallotVerifier {
  font-family: "Open Sans";
}

.BallotVerifier__Infobox {
  margin-bottom: 20px;
}
</style>
