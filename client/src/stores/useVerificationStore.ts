import { defineStore } from "pinia";
import { ref } from "vue";
import useAVVerifier from "../lib/useAVVerifier";
import { api } from "../lib/api";

export default defineStore("verificationStore", () => {
  const pairingCode = ref(null);
  const ballot = ref(null)

  async function generatePairingCode(electionSlug, verificationCode) {
    const avVerifier = await useAVVerifier(electionSlug);
    const ballotAddress = await avVerifier.findBallot(verificationCode);
    const path = `${electionSlug}/verification/spoil_status?id=${ballotAddress}`;
    const { data } = await api.get(path);

    pairingCode.value = await avVerifier.submitVerifierKey(data.item.address);

    await avVerifier.pollForCommitmentOpening();
    ballot.value = await avVerifier.decryptBallot();
  }

  return { generatePairingCode, pairingCode, ballot };
});
