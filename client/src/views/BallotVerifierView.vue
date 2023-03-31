<script setup lang="ts">
import useElectionStore from "../stores/useElectionStore";
import useLocaleStore from "../stores/useLocaleStore";
import CompactHeader from "../components/CompactHeader.vue";
import Infobox from "../components/Infobox.vue";
import router from "../router";
import { api } from "../lib/api";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import useVerificationStore from "../stores/useVerificationStore";

const localeStore = useLocaleStore();
const electionStore = useElectionStore();
const verificationStore = useVerificationStore();
const _decryptedBallot = ref<Array<any>>([]);
const route = useRoute();

function cancel() {
  router.push(`/${route.params.locale}/${route.params.electionSlug}`);
}

function redirectUnlessPairingCode() {
  if (!verificationStore.pairingCode) cancel();
}

onMounted(redirectUnlessPairingCode);
</script>

<template>
  <div class="BallotVerifier">
    <CompactHeader
      :election="electionStore.election"
      :locale="localeStore.locale"
    />

    <div class="BallotVerifier__Spoiled" v-if="verificationStore.ballot">
      <h1 class="BallotVerifier__Title">Decrypted vote</h1>

      <pre>{{ verificationStore.ballot }}</pre>
    </div>

    <div class="BallotVerifier__InProgress" v-else>
      <h1 class="BallotVerifier__Title">Pairing code</h1>

      <p class="BallotVerifier__Info">
        Go to the voting application and confirm this pairing code match the one
        displayed there. Then follow the instructions in the voting application.
      </p>

      <code class="BallotVerifier__Code">{{
        verificationStore.pairingCode
      }}</code>
    </div>
  </div>
</template>

<style type="text/css" scoped>
.BallotVerifier {
  font-family: "Open Sans";
}

.BallotVerifier__Title {
  font-size: 26px;
  text-align: center;
}

.BallotVerifier__Info {
  text-align: center;
}

.BallotVerifier__Code {
  font-size: 40px;
  font-family: "Red Hat Mono";
  text-align: center;
  display: block;
  letter-spacing: 5px;
}
</style>
