import "../test-utils/setupConfig";
import { describe, it, expect, vi } from "vitest";

const { AVVerifierMock, initializeMock } = vi.hoisted(() => {
  const initializeMock = vi.fn();
  const AVVerifierMock = vi.fn(function (this: any, url: string) {
    this.url = url;
    this.initialize = initializeMock;
  });
  return { AVVerifierMock, initializeMock };
});

vi.mock("@assemblyvoting/js-client", () => ({ AVVerifier: AVVerifierMock }));

const useAVVerifier = (await import("./useAVVerifier")).default;

describe("useAVVerifier", () => {
  it("creates and initializes a verifier for the board slug", async () => {
    initializeMock.mockResolvedValue(undefined);

    const verifier = await useAVVerifier("my-board");

    expect(AVVerifierMock).toHaveBeenCalledWith(
      "http://dbb.localhost:3003/my-board",
    );
    expect(initializeMock).toHaveBeenCalledTimes(1);
    expect((verifier as any).url).toBe("http://dbb.localhost:3003/my-board");
  });

  it("propagates initialization failures", async () => {
    initializeMock.mockRejectedValueOnce(new Error("init failed"));

    await expect(useAVVerifier("other")).rejects.toThrow("init failed");
  });
});
