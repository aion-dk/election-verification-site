import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

const { useAVVerifierMock, verifier } = vi.hoisted(() => {
  const verifier = {
    findBallot: vi.fn(),
    pollForBallotDecision: vi.fn(),
    submitVerifierKey: vi.fn(),
    pollForCommitmentOpening: vi.fn(),
    decryptBallot: vi.fn(),
    checkBallotStatus: vi.fn(),
  };
  return { verifier, useAVVerifierMock: vi.fn(async () => verifier) };
});

vi.mock("@/lib/useAVVerifier", () => ({ default: useAVVerifierMock }));

const useVerificationStore = (await import("./useVerificationStore")).default;

async function setupStore() {
  const store = useVerificationStore();
  await store.setupAVVerifier("board-1");
  return store;
}

describe("useVerificationStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    Object.values(verifier).forEach((fn) => fn.mockReset());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with empty state", () => {
    const store = useVerificationStore();

    expect(store.pairingCode).toBeNull();
    expect(store.ballot).toBeNull();
    expect(store.ballotAddress).toBeNull();
    expect(store.ballotCode).toBeNull();
    expect(store.trackingCode).toBeNull();
    expect(store.ballotStatus).toBeNull();
  });

  it("setupAVVerifier creates a verifier for the board", async () => {
    await setupStore();
    expect(useAVVerifierMock).toHaveBeenCalledWith("board-1");
  });

  it("findBallot stores the ballot code and the found address", async () => {
    verifier.findBallot.mockResolvedValue("ballot-address");
    const store = await setupStore();

    await store.findBallot("code-1");

    expect(verifier.findBallot).toHaveBeenCalledWith("code-1");
    expect(store.ballotCode).toBe("code-1");
    expect(store.ballotAddress).toBe("ballot-address");
  });

  it("setTrackingCode sets the tracking code", () => {
    const store = useVerificationStore();
    store.setTrackingCode("legacy-code");
    expect(store.trackingCode).toBe("legacy-code");
  });

  describe("generatePairingCode", () => {
    it("submits the verifier key and decrypts the ballot when spoiled", async () => {
      const ballot = [{ reference: "contest1", optionSelections: [] }];
      verifier.pollForBallotDecision.mockResolvedValue([
        "spoiled",
        "spoil-address",
      ]);
      verifier.submitVerifierKey.mockResolvedValue("PAIR-123");
      verifier.pollForCommitmentOpening.mockResolvedValue(undefined);
      verifier.decryptBallot.mockReturnValue(ballot);
      const store = await setupStore();

      await store.generatePairingCode();

      expect(verifier.submitVerifierKey).toHaveBeenCalledWith("spoil-address");
      expect(store.pairingCode).toBe("PAIR-123");
      expect(store.trackingCode).toBeNull();

      await flushPromises();

      expect(verifier.pollForCommitmentOpening).toHaveBeenCalledTimes(1);
      expect(verifier.decryptBallot).toHaveBeenCalledTimes(1);
      expect(store.ballot).toEqual(ballot);
    });

    it("stores the tracking code when the ballot was cast", async () => {
      verifier.pollForBallotDecision.mockResolvedValue(["cast", "TRACK-1"]);
      const store = await setupStore();

      await store.generatePairingCode();

      expect(store.trackingCode).toBe("TRACK-1");
      expect(store.pairingCode).toBeNull();
      expect(verifier.submitVerifierKey).not.toHaveBeenCalled();
    });

    it("throws on an unexpected decision", async () => {
      verifier.pollForBallotDecision.mockResolvedValue(["weird", "x"]);
      const store = await setupStore();

      await expect(store.generatePairingCode()).rejects.toThrow(
        "Unexpected status from pollForBallotDecision: weird",
      );
    });
  });

  describe("pollForCastBallot", () => {
    it("stores the tracking code when the ballot was cast", async () => {
      verifier.pollForBallotDecision.mockResolvedValue(["cast", "TRACK-2"]);
      const store = await setupStore();

      await store.pollForCastBallot();

      expect(store.trackingCode).toBe("TRACK-2");
    });

    it("throws when the ballot was not cast", async () => {
      verifier.pollForBallotDecision.mockResolvedValue(["spoiled", "addr"]);
      const store = await setupStore();

      await expect(store.pollForCastBallot()).rejects.toThrow(
        "Unexpected status from pollForBallotDecision: spoiled",
      );
      expect(store.trackingCode).toBeNull();
    });
  });

  describe("loadBallotStatus", () => {
    it("stores the status with activities in reverse order", async () => {
      verifier.checkBallotStatus.mockResolvedValue({
        status: "accepted",
        activities: [{ type: "voterSessionItem" }, { type: "castRequestItem" }],
      });
      const store = await setupStore();
      store.ballotCode = "code-1";
      store.setTrackingCode("TRACK-3");

      await store.loadBallotStatus();

      expect(verifier.checkBallotStatus).toHaveBeenCalledWith("TRACK-3");
      expect(store.ballotStatus).toEqual({
        ballotCode: "code-1",
        status: "accepted",
        activities: [{ type: "castRequestItem" }, { type: "voterSessionItem" }],
      });
    });

    it("logs and keeps the previous status when the ballot cannot be found", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      verifier.checkBallotStatus.mockRejectedValue(new Error("not found"));
      const store = await setupStore();
      store.setTrackingCode("TRACK-4");

      await expect(store.loadBallotStatus()).resolves.toBeUndefined();

      expect(store.ballotStatus).toBeNull();
      expect(logSpy).toHaveBeenCalledWith("Unable to find ballot", "TRACK-4");
    });
  });

  it("reset clears all ballot state", async () => {
    verifier.findBallot.mockResolvedValue("addr");
    verifier.pollForBallotDecision.mockResolvedValue(["cast", "TRACK-5"]);
    verifier.checkBallotStatus.mockResolvedValue({
      status: "accepted",
      activities: [],
    });
    const store = await setupStore();
    await store.findBallot("code");
    await store.generatePairingCode();
    await store.loadBallotStatus();
    store.pairingCode = "PAIR";
    store.ballot = [];

    store.reset();

    expect(store.pairingCode).toBeNull();
    expect(store.ballot).toBeNull();
    expect(store.ballotAddress).toBeNull();
    expect(store.ballotCode).toBeNull();
    expect(store.trackingCode).toBeNull();
    expect(store.ballotStatus).toBeNull();
  });
});
