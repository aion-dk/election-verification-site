<script setup lang="ts">
import useElectionStore from "../stores/useElectionStore";
import useLocaleStore from "../stores/useLocaleStore";
import CompactHeader from "../components/CompactHeader.vue";
import Infobox from "../components/Infobox.vue";
import router from "../router";
import useAVVerifier from "@/lib/useAVVerifier";
import { api } from "@/lib/api";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const localeStore = useLocaleStore();
const electionStore = useElectionStore();
const _pairingCode = ref<string | null>(null);
const _decryptedBallot = ref<Array<any>>([]);
const route = useRoute();
const avVerifier = ref(null);

watch(electionStore, () => startSpoiling());

function cancel() {
  router.push(`/${localeStore.locale}/${electionStore.election.slug}`);
}

async function createAvVerifier() {
  avVerifier.value ||= await useAVVerifier(electionStore.election.slug);
}

async function startSpoiling() {
  console.log(electionStore.election.slug);
  if (!electionStore.election?.slug) return;
  // console.log(avVerifier)
  // const pollResult = avVerifier.pollForSpoilRequest();

  await createAvVerifier();
  const address = await avVerifier.value.findBallot(
    route.params.verificationCode as string
  );
  const path = `${electionStore.election.slug}/verification/spoil_status?id=${address}`;

  const { data } = await api.get(path);

  _pairingCode.value = await avVerifier.value.submitVerifierKey(
    data.item.address
  );

  pollForCommitmentOpening();
}

async function pollForCommitmentOpening() {
  await createAvVerifier();

  await avVerifier.value.pollForCommitmentOpening();
  _decryptedBallot.value = await avVerifier.value.decryptBallot();
}

onMounted(startSpoiling);
</script>

<template>
  <div class="BallotTracker" aria-flowto="tracking-code">
    <CompactHeader
      :election="electionStore.election"
      :locale="localeStore.locale"
    />

    <div>
      <p>
        Go to the voting system and confirm the pairing code is correctly
        displayed there.
      </p>
      {{ _pairingCode }}
    </div>

    <div>
      {{ _decryptedBallot }}
    </div>
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
