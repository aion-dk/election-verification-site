import { defineStore } from "pinia";
import { ref } from "vue";
import useAVVerifier from "../lib/useAVVerifier";

export default defineStore("verificationStore", () => {
  const setupAVVerifier = async (boardSlug: string) => {
    avVerifier.value = await useAVVerifier(boardSlug);
  };

  const avVerifier = ref(null);
  const ballotAddress = ref(null);
  const pairingCode = ref(null);
  const ballot = ref(null);

  async function decryptWhenAvailable() {
    await avVerifier.value.pollForCommitmentOpening();
    ballot.value = avVerifier.value.decryptBallot();
  }

  function reset() {
    pairingCode.value = null;
    ballot.value = null;
    ballotAddress.value = null;
  }

  async function findBallot(verificationCode: string) {
    ballotAddress.value = await avVerifier.value.findBallot(verificationCode);
    return ballotAddress.value;
  }

  async function generatePairingCode() {
    const spoilAddress = await avVerifier.value.pollForSpoilRequest();
    pairingCode.value = await avVerifier.value.submitVerifierKey(spoilAddress);

    decryptWhenAvailable();
  }

  function isReceiptValid(receipt: string, trackingCode: string) {
    try {
      avVerifier.value.validateReceipt(receipt, trackingCode)
    } catch (err) {
      console.error(err.message)
      return false
    }

    return true
  }

  return {
    generatePairingCode,
    setupAVVerifier,
    findBallot,
    pairingCode,
    ballot,
    ballotAddress,
    reset,
    isReceiptValid
  };
});
