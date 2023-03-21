import { defineStore } from "pinia";
import { ref } from "vue";
import useAVClient from "../lib/useAVClient";
import type { Ballot } from "../Types";

export default defineStore("useBallotStore", () => {
  const ballot = ref<Ballot>(null);

  const setBallot = (newBallot: Ballot) => {
    ballot.value = newBallot;
  };

  function resetBallot() {
    ballot.value = null;
  }

  async function loadBallot(trackingCode: string, electionSlug: string) {
    console.info("Tracking ballot", trackingCode);
    resetBallot();

    try {
      const avClient = await useAVClient(electionSlug);
      const res = await avClient.checkBallotStatus(trackingCode);

      ballot.value = {
        trackingCode: trackingCode,
        status: res.status,
        activities: (res.activities as any).reverse(),
      };
    } catch (e) {
      console.log("Unable to find ballot", trackingCode);
      resetBallot();
    }
  }

  return { ballot, setBallot, loadBallot };
});
