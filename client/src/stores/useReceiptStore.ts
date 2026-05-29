import { defineStore } from "pinia";
import { ref } from "vue";
import useAVVerifier from "../lib/useAVVerifier";

export default defineStore("receiptStore", () => {
  const setupAVVerifier = async (boardSlug: string) => {
    console.log("Setting up AV Verifier for receipt store");
    avVerifier.value = await useAVVerifier(boardSlug);
  };

  const avVerifier = ref(null);
  const receiptValid = ref(null);
  const trackingCodeMatching = ref(null);

  function reset() {
    receiptValid.value = null;
    trackingCodeMatching.value = null;
  }

  function validateReceipt(receipt: string) {
    try {
      avVerifier.value.validateReceipt(receipt);
      receiptValid.value = true;
    } catch (err) {
      // TODO: Catch AvClientError to mark the receipt invalid. You can use error messages to display the problem.
      console.error(err);
      receiptValid.value = false;
    }
  }

  function validateTrackingCode(receipt: string, trackingCode: string) {
    try {
      avVerifier.value.validateReceiptTrackingCode(receipt, trackingCode);
      trackingCodeMatching.value = true;
    } catch (err) {
      console.error(err);
      trackingCodeMatching.value = false;
    }
  }

  return {
    receiptValid,
    trackingCodeMatching,
    reset,
    setupAVVerifier,
    validateReceipt,
    validateTrackingCode,
  };
});
