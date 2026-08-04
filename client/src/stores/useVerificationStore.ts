import { defineStore } from "pinia";
import { ref } from "vue";
import useAVVerifier from "../lib/useAVVerifier";
import type { ContestSelection, EVSBallot } from "@/Types";

export default defineStore("verificationStore", () => {
  const setupAVVerifier = async (boardSlug: string) => {
    avVerifier.value = await useAVVerifier(boardSlug);
  };

  const avVerifier = ref(null);
  const ballotAddress = ref(null);
  const ballotCode = ref(null);
  const pairingCode = ref(null);
  // The Base58 tracking code, i.e. the short code of the cast request item.
  const trackingCode = ref(null);
  const ballot = ref<ContestSelection[] | null>(null);
  const ballotStatus = ref<EVSBallot>(null);

  async function decryptWhenAvailable() {
    await avVerifier.value.pollForCommitmentOpening();
    ballot.value = avVerifier.value.decryptBallot();
  }

  function reset() {
    pairingCode.value = null;
    ballot.value = null;
    ballotAddress.value = null;
    ballotCode.value = null;
    trackingCode.value = null;
    ballotStatus.value = null;
  }

  // This exists for backward compatibility reasons.
  // This is used when verifying an old receipt PDF file (containing a "trackingCode" attribute
  // rather than the new "ballotCode").
  function setTrackingCode(code: string) {
    trackingCode.value = code;
  }

  async function findBallot(code: string) {
    ballotCode.value = code;
    ballotAddress.value = await avVerifier.value.findBallot(code);
  }

  async function generatePairingCode() {
    const [decision, address] = await avVerifier.value.pollForBallotDecision();
    switch (decision) {
      case "spoiled":
        pairingCode.value = await avVerifier.value.submitVerifierKey(address);
        decryptWhenAvailable();
        break;
      case "cast":
        trackingCode.value = address;
        break;
      default:
        throw new Error(
          "Unexpected status from pollForBallotDecision: " + decision,
        );
    }
  }

  async function pollForCastBallot() {
    const [decision, address] = await avVerifier.value.pollForBallotDecision();
    if (decision === "cast") {
      trackingCode.value = address;
    } else {
      throw new Error(
        "Unexpected status from pollForBallotDecision: " + decision,
      );
    }
  }

  async function loadBallotStatus() {
    try {
      const res = await avVerifier.value.checkBallotStatus(trackingCode.value);

      ballotStatus.value = {
        ballotCode: ballotCode.value,
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
    setTrackingCode,
  };
});
