import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

const { useAVVerifierMock, verifier } = vi.hoisted(() => {
  const verifier = {
    validateReceipt: vi.fn(),
    validateReceiptTrackingCode: vi.fn(),
  };
  return { verifier, useAVVerifierMock: vi.fn(async () => verifier) };
});

vi.mock("@/lib/useAVVerifier", () => ({ default: useAVVerifierMock }));

const useReceiptStore = (await import("./useReceiptStore")).default;

describe("useReceiptStore", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    setActivePinia(createPinia());
    vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    verifier.validateReceipt.mockReset();
    verifier.validateReceiptTrackingCode.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function setupStore() {
    const store = useReceiptStore();
    await store.setupAVVerifier("board-1");
    return store;
  }

  it("starts with no validation results", () => {
    const store = useReceiptStore();
    expect(store.receiptValid).toBeNull();
    expect(store.trackingCodeMatching).toBeNull();
  });

  it("setupAVVerifier creates a verifier for the board", async () => {
    await setupStore();
    expect(useAVVerifierMock).toHaveBeenCalledWith("board-1");
  });

  it("marks a receipt as valid when validation succeeds", async () => {
    const store = await setupStore();

    store.validateReceipt("receipt");

    expect(verifier.validateReceipt).toHaveBeenCalledWith("receipt");
    expect(store.receiptValid).toBe(true);
  });

  it("marks a receipt as invalid when validation throws", async () => {
    const error = new Error("bad signature");
    verifier.validateReceipt.mockImplementation(() => {
      throw error;
    });
    const store = await setupStore();

    store.validateReceipt("receipt");

    expect(store.receiptValid).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(error);
  });

  it("marks the receipt invalid when no verifier has been set up", () => {
    const store = useReceiptStore();

    store.validateReceipt("receipt");

    expect(store.receiptValid).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(expect.any(TypeError));
  });

  it("marks the tracking code as matching when validation succeeds", async () => {
    const store = await setupStore();

    store.validateTrackingCode("receipt", "code");

    expect(verifier.validateReceiptTrackingCode).toHaveBeenCalledWith(
      "receipt",
      "code",
    );
    expect(store.trackingCodeMatching).toBe(true);
  });

  it("marks the tracking code as not matching when validation throws", async () => {
    const error = new Error("mismatch");
    verifier.validateReceiptTrackingCode.mockImplementation(() => {
      throw error;
    });
    const store = await setupStore();

    store.validateTrackingCode("receipt", "code");

    expect(store.trackingCodeMatching).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(error);
  });

  it("reset clears the validation results", async () => {
    const store = await setupStore();
    store.validateReceipt("receipt");
    store.validateTrackingCode("receipt", "code");

    store.reset();

    expect(store.receiptValid).toBeNull();
    expect(store.trackingCodeMatching).toBeNull();
  });
});
