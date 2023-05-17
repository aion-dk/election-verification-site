<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";
import useLocaleStore from "../stores/useLocaleStore";
import CompactHeader from "../components/CompactHeader.vue";
import Infobox from "../components/Infobox.vue";
import { watch, onMounted } from "vue";
import router from "@/router";
import useVerificationStore from "@/stores/useVerificationStore";

const localeStore = useLocaleStore();
const configStore = useConfigStore();
const verificationStore = useVerificationStore();

async function checkForPairingCode(store: any) {
  if (!store.pairingCode) return;

  await router.push({
    name: "BallotVerifierView",
    params: {
      pairingCode: store.pairingCode,
    },
  });
}

watch(verificationStore, async (store) => {
  await checkForPairingCode(store);
});

onMounted(async () => {
  await checkForPairingCode(verificationStore);
});
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
