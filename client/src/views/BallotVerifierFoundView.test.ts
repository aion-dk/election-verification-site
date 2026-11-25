import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { fallbackMessages } from "../assets/translations";
import useConfigStore from "@/stores/useConfigStore";
import useVerificationStore from "@/stores/useVerificationStore";

const { pushMock, useAVVerifierMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  useAVVerifierMock: vi.fn(),
}));

vi.mock("@/router", () => ({ default: { push: pushMock } }));
vi.mock("@/lib/useAVVerifier", () => ({ default: useAVVerifierMock }));

const BallotVerifierFoundView = (await import("./BallotVerifierFoundView.vue"))
  .default;

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

const stubs = { AVIcon: { template: "<span />" } };

function createVerifier(overrides: Record<string, any> = {}) {
  return {
    findBallot: vi.fn().mockResolvedValue("ballot-address"),
    pollForBallotDecision: vi.fn().mockResolvedValue(["spoiled", "addr"]),
    submitVerifierKey: vi.fn().mockResolvedValue("PAIRING"),
    // never resolves: decryption is not part of this view's concern
    pollForCommitmentOpening: vi.fn(() => new Promise(() => {})),
    decryptBallot: vi.fn(),
    ...overrides,
  };
}

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/verify/:verificationCode/found",
        name: "BallotVerifierFound",
        component: { template: "<div />" },
      },
    ],
  });
}

let pinia: Pinia;

async function mountView() {
  const router = createTestRouter();
  await router.push("/en/org_slug/election_slug/verify/CODE42/found");
  await router.isReady();

  const wrapper = mount(BallotVerifierFoundView, {
    global: { plugins: [i18n, pinia, router], stubs },
  });

  await flushPromises();
  return wrapper;
}

describe("BallotVerifierFoundView", () => {
  let verifier: ReturnType<typeof createVerifier>;

  beforeEach(() => {
    vi.clearAllMocks();
    pinia = createPinia();
    setActivePinia(pinia);
    useConfigStore().setBoardSlug("board-slug");
    verifier = createVerifier();
    useAVVerifierMock.mockResolvedValue(verifier);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the found ballot content and help steps", async () => {
    verifier.pollForBallotDecision.mockReturnValue(new Promise(() => {}));

    const wrapper = await mountView();

    expect(wrapper.find("#current-ballot-code").text()).toBe("CODE42");
    expect(wrapper.find("#verifier-found-title").exists()).toBe(true);
    expect(wrapper.find("#verifier-found-step-1").exists()).toBe(true);
    expect(wrapper.find("#verifier-found-step-2").exists()).toBe(true);
    expect(wrapper.find("#verifier-found-step-3").exists()).toBe(false);
    expect(wrapper.find("#content-layout-breadcrumb").text()).toContain(
      "Ballot Finder",
    );
    expect(pushMock).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("looks the ballot up and goes to the verifier once a pairing code is issued", async () => {
    const wrapper = await mountView();
    const store = useVerificationStore();

    expect(useAVVerifierMock).toHaveBeenCalledWith("board-slug");
    expect(verifier.findBallot).toHaveBeenCalledWith("CODE42");
    expect(verifier.submitVerifierKey).toHaveBeenCalledWith("addr");
    expect(store.pairingCode).toBe("PAIRING");
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith({
      name: "BallotVerifierView",
      params: { pairingCode: "PAIRING" },
    });
    wrapper.unmount();
  });

  it("goes to the tracker when the ballot turns out to be cast", async () => {
    verifier.pollForBallotDecision.mockResolvedValue(["cast", "TRACK"]);

    const wrapper = await mountView();

    expect(useVerificationStore().trackingCode).toBe("TRACK");
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(
      "/en/org_slug/election_slug/track/CODE42",
    );
    wrapper.unmount();
  });

  it("redirects to the verification landing when the lookup fails", async () => {
    verifier.findBallot.mockRejectedValue(new Error("not found"));

    const wrapper = await mountView();

    expect(console.error).toHaveBeenCalledWith(new Error("not found"));
    expect(pushMock).toHaveBeenCalledWith({
      name: "BallotVerificationLanding",
    });
    expect(verifier.pollForBallotDecision).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("reuses an already found ballot and forwards its pairing code", async () => {
    const store = useVerificationStore();
    await store.setupAVVerifier("board-slug");
    await store.findBallot("CODE42");
    await store.generatePairingCode();
    vi.clearAllMocks();

    const wrapper = await mountView();

    expect(useAVVerifierMock).not.toHaveBeenCalled();
    expect(verifier.findBallot).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith({
      name: "BallotVerifierView",
      params: { pairingCode: "PAIRING" },
    });
    wrapper.unmount();
  });

  it("navigates back to the ballot finder on cancel", async () => {
    verifier.pollForBallotDecision.mockReturnValue(new Promise(() => {}));
    const wrapper = await mountView();

    await wrapper.find("[data-testid=cancel]").trigger("click");

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith("/en/org_slug/election_slug/find");
    wrapper.unmount();
  });
});
