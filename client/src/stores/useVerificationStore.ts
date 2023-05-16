import { defineStore } from "pinia";
import { ref } from "vue";
import useAVVerifier from "../lib/useAVVerifier";

export default defineStore("verificationStore", () => {
  const setupAVVerifier = async (electionSlug: string) => {
    avVerifier.value = await useAVVerifier(electionSlug);
  };

  const avVerifier = ref(null);
  const pairingCode = ref(null);
  const ballot = ref(null);

  async function decryptWhenAvailable() {
    await avVerifier.value.pollForCommitmentOpening();
    ballot.value = avVerifier.value.decryptBallot();
  }

  function reset() {
    pairingCode.value = null;
    ballot.value = null;
  }

  async function findBallot(verificationCode: string) {
    return await avVerifier.value.findBallot(verificationCode);
  }

  async function generatePairingCode() {
    const spoilAddress = await avVerifier.value.pollForSpoilRequest();
    pairingCode.value = await avVerifier.value.submitVerifierKey(spoilAddress);

    decryptWhenAvailable();
  }

  return {
    generatePairingCode,
    setupAVVerifier,
    findBallot,
    pairingCode,
    ballot,
    reset,
  };
});
