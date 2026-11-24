import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { fallbackMessages } from "../assets/translations";
import useConfigStore from "@/stores/useConfigStore";
import useReceiptStore from "@/stores/useReceiptStore";
import useVerificationStore from "@/stores/useVerificationStore";

const { pushMock, useAVVerifierMock, extractor } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  useAVVerifierMock: vi.fn(),
  extractor: {
    files: [] as File[],
    extract: null as () => Promise<void>,
    receipt: undefined as string,
    trackingCode: undefined as string,
    ballotCode: undefined as string,
  },
}));

vi.mock("@/router", () => ({ default: { push: pushMock } }));
vi.mock("@/lib/useAVVerifier", () => ({ default: useAVVerifierMock }));
vi.mock("@/lib/receiptPDFExtractor", () => ({
  ReceiptPDFExtractor: class {
    receipt: string;
    trackingCode: string;
    ballotCode: string;
    constructor(file: File) {
      extractor.files.push(file);
    }
    async extract() {
      await extractor.extract();
      this.receipt = extractor.receipt;
      this.trackingCode = extractor.trackingCode;
      this.ballotCode = extractor.ballotCode;
    }
  },
}));

const BallotUnifiedTracking = (await import("./BallotUnifiedTracking.vue"))
  .default;

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

const stubs = {
  AVIcon: { template: "<span />" },
  AVFileInput: {
    name: "AVFileInput",
    props: ["error", "disabled", "accept", "showPreview"],
    emits: ["update"],
    template: "<div class='file-input-stub' />",
  },
};

const BASE = "/en/org_slug/election_slug";

function createVerifier() {
  return {
    findBallot: vi.fn().mockResolvedValue("ballot-address"),
    pollForBallotDecision: vi.fn().mockResolvedValue(["spoiled", "addr"]),
    submitVerifierKey: vi.fn().mockResolvedValue("PAIRING"),
    pollForCommitmentOpening: vi.fn(() => new Promise(() => {})),
    decryptBallot: vi.fn(),
    validateReceipt: vi.fn(),
    validateReceiptTrackingCode: vi.fn(),
  };
}

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/find",
        name: "BallotFinder",
        component: { template: "<div />" },
      },
    ],
  });
}

let pinia: Pinia;

async function mountView() {
  const router = createTestRouter();
  await router.push(`${BASE}/find`);
  await router.isReady();

  const wrapper = mount(BallotUnifiedTracking, {
    attachTo: document.body,
    global: {
      plugins: [i18n, pinia, router],
      stubs,
      directives: { tooltip: {} },
    },
  });

  await flushPromises();
  return wrapper;
}

type Wrapper = Awaited<ReturnType<typeof mountView>>;

async function uploadReceipt(wrapper: Wrapper, files: File[]) {
  wrapper.findComponent({ name: "AVFileInput" }).vm.$emit("update", files);
  await flushPromises();
}

const receiptFile = new File(["%PDF"], "receipt.pdf", {
  type: "application/pdf",
});

describe("BallotUnifiedTracking", () => {
  let verifier: ReturnType<typeof createVerifier>;

  beforeEach(() => {
    vi.clearAllMocks();
    pinia = createPinia();
    setActivePinia(pinia);
    useConfigStore().setBoardSlug("board-slug");
    verifier = createVerifier();
    useAVVerifierMock.mockResolvedValue(verifier);
    extractor.files = [];
    extractor.extract = () => Promise.resolve();
    extractor.receipt = "RECEIPT";
    extractor.trackingCode = undefined;
    extractor.ballotCode = undefined;
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("on mount", () => {
    it("resets the stores, prepares the verifier and focuses the code input", async () => {
      const receiptStore = useReceiptStore();
      receiptStore.validateReceipt("stale");
      expect(receiptStore.receiptValid).toBe(false);

      const wrapper = await mountView();

      expect(receiptStore.receiptValid).toBeNull();
      expect(useAVVerifierMock).toHaveBeenCalledWith("board-slug");
      expect(document.activeElement).toBe(
        wrapper.find("#unified-code").element,
      );
      expect(wrapper.find("h1").text()).not.toBe("");
      expect(wrapper.findAll(".UnifiedLanding__Step")).toHaveLength(2);
      wrapper.unmount();
    });

    it("ignores store changes made before it is ready", async () => {
      useVerificationStore().pairingCode = "STALE";

      const wrapper = await mountView();

      expect(useVerificationStore().pairingCode).toBeNull();
      expect(pushMock).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("tracks by the tracking code when the store gets one without a ballot code", async () => {
      const wrapper = await mountView();

      useVerificationStore().setTrackingCode("LEGACY");
      await flushPromises();

      expect(pushMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith(`${BASE}/track/LEGACY`);
      wrapper.unmount();
    });

    it("shows the election logo from the election status theme", async () => {
      useConfigStore().setElectionStatus({
        theme: { logo: "https://example.com/logo.png" },
      } as any);

      const wrapper = await mountView();

      expect(wrapper.find("#content-layout-brand-logo").attributes("src")).toBe(
        "https://example.com/logo.png",
      );
      wrapper.unmount();
    });
  });

  describe("inputs", () => {
    it("enables the lookup button only once a code is typed and locks the receipt input", async () => {
      const wrapper = await mountView();
      const button = wrapper.find("#initiate-tracking");
      const fileInput = wrapper.findComponent({ name: "AVFileInput" });

      expect(button.attributes("disabled")).toBeDefined();
      expect(fileInput.props("disabled")).toBe(false);

      await wrapper.find("#unified-code").setValue("CODE42");

      expect(button.attributes("disabled")).toBeUndefined();
      expect(fileInput.props("disabled")).toBe(true);
      wrapper.unmount();
    });

    it("locks the code input while a receipt is selected and unlocks it when cleared", async () => {
      extractor.extract = () => new Promise(() => {});
      const wrapper = await mountView();
      const input = wrapper.find("#unified-code");

      await uploadReceipt(wrapper, [receiptFile]);

      expect(input.attributes("disabled")).toBeDefined();
      expect(
        wrapper.find("#initiate-tracking").attributes("disabled"),
      ).toBeUndefined();

      await uploadReceipt(wrapper, []);

      expect(input.attributes("disabled")).toBeUndefined();
      expect(
        wrapper.find("#initiate-tracking").attributes("disabled"),
      ).toBeDefined();
      wrapper.unmount();
    });
  });

  describe("looking up a ballot code", () => {
    it("goes to the found page when no decision arrives within two seconds", async () => {
      vi.useFakeTimers();
      verifier.pollForBallotDecision.mockReturnValue(new Promise(() => {}));
      const wrapper = await mountView();

      await wrapper.find("#unified-code").setValue("CODE42");
      await wrapper.find("#initiate-tracking").trigger("click");
      await flushPromises();

      expect(verifier.findBallot).toHaveBeenCalledWith("CODE42");
      expect(pushMock).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(2000);

      expect(pushMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith({
        name: "BallotVerifierFound",
        params: { verificationCode: "CODE42" },
      });
      wrapper.unmount();
    });

    it("goes to the verifier when the ballot was spoiled", async () => {
      vi.useFakeTimers();
      const wrapper = await mountView();

      await wrapper.find("#unified-code").setValue("CODE42");
      await wrapper.find("#initiate-tracking").trigger("click");
      await flushPromises();

      expect(pushMock).toHaveBeenCalledWith({
        name: "BallotVerifierView",
        params: { pairingCode: "PAIRING" },
      });

      pushMock.mockClear();
      await vi.advanceTimersByTimeAsync(2000);
      expect(pushMock).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("goes to the tracker when the ballot was cast", async () => {
      vi.useFakeTimers();
      verifier.pollForBallotDecision.mockResolvedValue(["cast", "TRACK"]);
      const wrapper = await mountView();

      await wrapper.find("#unified-code").setValue("CODE42");
      await wrapper.find("#initiate-tracking").trigger("click");
      await flushPromises();

      expect(pushMock).toHaveBeenCalledWith(`${BASE}/track/CODE42`);

      pushMock.mockClear();
      await vi.advanceTimersByTimeAsync(2000);
      expect(pushMock).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("shows an error for an unknown code and clears it with the receipt input", async () => {
      verifier.findBallot.mockRejectedValue(new Error("not found"));
      const wrapper = await mountView();

      await wrapper.find("#unified-code").setValue("WRONG");
      await wrapper.find("#initiate-tracking").trigger("click");
      await flushPromises();

      expect(console.error).toHaveBeenCalledWith(new Error("not found"));
      expect(wrapper.find("#error-verify-invalid_code").text()).toContain(
        "Ballot code not found",
      );
      expect(
        wrapper.findComponent({ name: "AVFileInput" }).props("error"),
      ).toBe(true);
      expect(pushMock).not.toHaveBeenCalled();

      await uploadReceipt(wrapper, []);

      expect(wrapper.find(".Error").exists()).toBe(false);
      expect(
        (wrapper.find("#unified-code").element as HTMLInputElement).value,
      ).toBe("");
      wrapper.unmount();
    });
  });

  describe("uploading a receipt", () => {
    it("shows an error when the file cannot be read", async () => {
      extractor.extract = () => Promise.reject(new Error("bad pdf"));
      const wrapper = await mountView();

      await uploadReceipt(wrapper, [receiptFile]);

      expect(extractor.files).toEqual([receiptFile]);
      const error = wrapper.find("#error-receipt-invalid_file_format");
      expect(error.exists()).toBe(true);
      // The offline fallback messages include this error.
      expect(error.text()).toContain("Invalid receipt file");
      expect(pushMock).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("redirects to the receipt error page for an invalid receipt", async () => {
      extractor.ballotCode = "CODE42";
      verifier.validateReceipt.mockImplementation(() => {
        throw new Error("invalid");
      });
      const wrapper = await mountView();

      await uploadReceipt(wrapper, [receiptFile]);

      expect(verifier.validateReceipt).toHaveBeenCalledWith("RECEIPT");
      expect(pushMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith(`${BASE}/receipt_error`);
      expect(verifier.findBallot).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("does nothing for a valid receipt without any code", async () => {
      const wrapper = await mountView();

      await uploadReceipt(wrapper, [receiptFile]);

      expect(verifier.validateReceipt).toHaveBeenCalledWith("RECEIPT");
      expect(verifier.validateReceiptTrackingCode).not.toHaveBeenCalled();
      expect(pushMock).not.toHaveBeenCalled();
      expect(wrapper.find(".Error").exists()).toBe(false);
      wrapper.unmount();
    });

    describe("with a ballot code", () => {
      beforeEach(() => {
        extractor.ballotCode = "CODE42";
        verifier.pollForBallotDecision.mockResolvedValue(["cast", "TRACK"]);
      });

      it("tracks the ballot when the receipt matches its tracking code", async () => {
        const wrapper = await mountView();

        await uploadReceipt(wrapper, [receiptFile]);

        expect(verifier.findBallot).toHaveBeenCalledWith("CODE42");
        expect(verifier.validateReceiptTrackingCode).toHaveBeenCalledWith(
          "RECEIPT",
          "TRACK",
        );
        // Navigates once: the store watcher stays quiet while the receipt is processed.
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith(`${BASE}/track/CODE42`);
        wrapper.unmount();
      });

      it("ends on the receipt error page when the tracking code does not match", async () => {
        verifier.validateReceiptTrackingCode.mockImplementation(() => {
          throw new Error("mismatch");
        });
        const wrapper = await mountView();

        await uploadReceipt(wrapper, [receiptFile]);

        // Goes straight to the error page, without passing through /track first.
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith(`${BASE}/receipt_error`);
        wrapper.unmount();
      });

      it("ends on the receipt error page when the ballot cannot be found", async () => {
        verifier.findBallot.mockRejectedValue(new Error("not found"));
        const wrapper = await mountView();

        await uploadReceipt(wrapper, [receiptFile]);

        expect(verifier.validateReceiptTrackingCode).not.toHaveBeenCalled();
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith(`${BASE}/receipt_error`);
        wrapper.unmount();
      });
    });

    describe("with a legacy tracking code", () => {
      beforeEach(() => {
        extractor.trackingCode = "LEGACY";
      });

      it("tracks the ballot by its tracking code when the receipt matches", async () => {
        const wrapper = await mountView();

        await uploadReceipt(wrapper, [receiptFile]);

        expect(verifier.validateReceiptTrackingCode).toHaveBeenCalledWith(
          "RECEIPT",
          "LEGACY",
        );
        expect(useVerificationStore().trackingCode).toBe("LEGACY");
        expect(verifier.findBallot).not.toHaveBeenCalled();
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith(`${BASE}/track/LEGACY`);
        wrapper.unmount();
      });

      it("redirects to the receipt error page when the receipt does not match", async () => {
        verifier.validateReceiptTrackingCode.mockImplementation(() => {
          throw new Error("mismatch");
        });
        const wrapper = await mountView();

        await uploadReceipt(wrapper, [receiptFile]);

        expect(useVerificationStore().trackingCode).toBeNull();
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith(`${BASE}/receipt_error`);
        wrapper.unmount();
      });
    });
  });
});
