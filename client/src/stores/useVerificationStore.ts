import { defineStore } from "pinia";
import { ref } from "vue";
import useAVVerifier from "../lib/useAVVerifier";

export default defineStore("verificationStore", () => {
  const pairingCode = ref(null);
  const ballot = ref(null);

  async function decryptWhenAvailable(avVerifier: any) {
    await avVerifier.pollForCommitmentOpening();
    ballot.value = await avVerifier.decryptBallot();
  }

  function reset() {
    pairingCode.value = null;
    ballot.value = null;
  }

  async function generatePairingCode(
    electionSlug: string,
    verificationCode: string
  ) {
    const avVerifier = await useAVVerifier(electionSlug);
    await avVerifier.findBallot(verificationCode);

    const spoilAddress = await avVerifier.pollForSpoilRequest();
    pairingCode.value = await avVerifier.submitVerifierKey(spoilAddress);

    decryptWhenAvailable(avVerifier);
  }

  return { generatePairingCode, pairingCode, ballot, reset };
});
