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

function cancel() {
  router.push(`/${localeStore.locale}/${electionStore.election.slug}`);
}

async function redirectUnlessPairingCode() {
  if (!verificationStore.pairingCode) await cancel()
}

onMounted(redirectUnlessPairingCode)
</script>

<template>
  <div class="BallotTracker" aria-flowto="tracking-code">
    <CompactHeader
      :election="electionStore.election"
      :locale="localeStore.locale"
    />

    <p>Pairing code: <code>{{ verificationStore.pairingCode }}</code></p>

    <p>
      Go to the voting system and confirm the pairing code is correctly
      displayed there.
    </p>

    <p v-if="!verificationStore.ballot">Waiting for confirmation in the voting application</p>

    <pre v-if="verificationStore.ballot">
      {{ verificationStore.ballot }}
    </pre>
  </div>
</template>

<style type="text/css" scoped>
.BallotTracker {
  font-family: "Open Sans";
}

.BallotTracker__Row {
  display: flex;
  margin-bottom: 40px;
}

.BallotTracker__Row--stacked {
  flex-direction: column;
}

.BallotTracker__TrackingCode {
  margin-left: 40px;
  flex-grow: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.BallotTracker__Infobox {
  max-width: 350px;
}

.BallotTracker__TrackingCode h3 {
  padding: 0;
  margin: 0;
}

.BallotTracker__TrackingCode code {
  font-size: 40px;
  font-family: "Red Hat Mono";
  letter-spacing: 5px;
}

.BallotTracker__TrackingCode h3 span {
  color: #6c757d;
  font-weight: 600;
  display: block;
  margin-bottom: 20px;
}

.BallotTracker__StatusInfo {
  width: 100%;
}

.BallotTracker__StatusInfo h3 {
  font-size: 24px;
}

.BallotTracker__Cancel {
  border: none;
  background: transparent;
  position: absolute;
  top: 0;
  right: 8px;
  font-size: 40px;
  cursor: pointer;
  color: #adb5bd;
}
</style>
