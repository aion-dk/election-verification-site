import { defineStore } from "pinia";
import { ref } from "vue";
import useAVVerifier from "../lib/useAVVerifier";
import type {EVSBallot} from "@/Types";

export default defineStore("verificationStore", () => {
  const setupAVVerifier = async (boardSlug: string) => {
    avVerifier.value = await useAVVerifier(boardSlug);
  };

  const avVerifier = ref(null);
  const ballotAddress = ref(null);
  const ballotCode = ref(null);
  const pairingCode = ref(null);
  const trackingCode = ref(null);
  const ballot = ref(null);
  const ballotStatus = ref<EVSBallot>(null);

  async function decryptWhenAvailable() {
    await avVerifier.value.pollForCommitmentOpening();
    ballot.value = avVerifier.value.decryptBallot();
  }

  function reset() {
    pairingCode.value = null;
    ballot.value = null;
    ballotAddress.value = null;
    trackingCode.value = null;
    ballotStatus.value = null;
  }

  async function findBallot(verificationCode: string) {
    ballotCode.value = verificationCode;
    ballotAddress.value = await avVerifier.value.findBallot(verificationCode);
  }

  async function generatePairingCode() {
    const [decision, address] = await avVerifier.value.pollForBallotDecision();
    switch(decision) {
      case "spoiled":
        pairingCode.value = await avVerifier.value.submitVerifierKey(address);
        decryptWhenAvailable();
        break;
      case "cast":
        trackingCode.value = address;
        break;
      default:
        throw new Error("Unexpected status from pollForSpoilRequest: " + decision);
    }
  }

  async function pollForCastBallot() {
    const [decision, address] = await avVerifier.value.pollForBallotDecision();
     if (decision === "cast") {
       trackingCode.value = address;
     } else {
        throw new Error("Unexpected status from pollForSpoilRequest: " + decision);
    }
  }

  async function loadBallotStatus() {
    try {
      const res = await avVerifier.value.checkBallotStatus(trackingCode.value);

      ballotStatus.value = {
        trackingCode: trackingCode.value,
        status: res.status,
        activities: (res.activities as any).reverse(),
      };
    } catch (_e) {
      console.log("Unable to find ballot", trackingCode.value);
    }
  }

  return {
    generatePairingCode,
    setupAVVerifier,
    findBallot,
    loadBallotStatus,
    pollForCastBallot,
    pairingCode,
    ballot,
    ballotAddress,
    ballotCode,
    trackingCode,
    ballotStatus,
    reset,
  };
});
