import "../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { fallbackMessages } from "../assets/translations";
import useConfigStore from "@/stores/useConfigStore";
import useVerificationStore from "@/stores/useVerificationStore";

const { pushMock, modalInstances } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  modalInstances: [] as any[],
}));

vi.mock("@/router", () => ({ default: { push: pushMock } }));
vi.mock("@assemblyvoting/electa-ui", () => ({
  Modal: class {
    selector: string;
    show = vi.fn();
    hide = vi.fn();
    constructor(selector: string) {
      this.selector = selector;
      modalInstances.push(this);
    }
  },
}));

const BallotVerifierView = (await import("./BallotVerifierView.vue")).default;

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = { en: JSON.parse(neededStrings) };
const i18n = createI18n({ messages });

const stubs = {
  AVIcon: { template: "<span />" },
  Timedown: {
    name: "Timedown",
    props: ["maxSeconds", "currentSeconds"],
    emits: ["alert", "timeout"],
    template: "<div class='timedown-stub' />",
  },
  BallotVerifierContest: {
    name: "BallotVerifierContest",
    props: ["contestSelection", "index"],
    template:
      "<div class='contest-stub'>{{ contestSelection.reference }}</div>",
  },
};

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/verify/:pairingCode",
        name: "BallotVerifierView",
        component: { template: "<div />" },
      },
    ],
  });
}

let pinia: Pinia;

async function mountView() {
  const router = createTestRouter();
  await router.push("/en/org_slug/election_slug/verify/PAIRING");
  await router.isReady();

  const wrapper = mount(BallotVerifierView, {
    global: { plugins: [i18n, pinia, router], stubs },
  });

  await flushPromises();
  return wrapper;
}

const selection = (reference: string) => ({ reference, piles: [] });

function setBallot(references: string[]) {
  useVerificationStore().ballot = references.map(selection);
}

function renderedOrder(wrapper: Awaited<ReturnType<typeof mountView>>) {
  return wrapper.findAll(".contest-stub").map((c) => c.text());
}

describe("BallotVerifierView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    modalInstances.length = 0;
    pinia = createPinia();
    setActivePinia(pinia);
    const configStore = useConfigStore();
    configStore.election = { bcTimeout: 300 } as any;
    useVerificationStore().pairingCode = "PAIRING";
  });

  describe("while waiting for the ballot", () => {
    it("shows the pairing code and the countdown", async () => {
      const wrapper = await mountView();

      expect(wrapper.find("#verifier-inprogress-content").exists()).toBe(true);
      expect(wrapper.find("#verifier-spoiled-content").exists()).toBe(false);
      expect(wrapper.find("#verifier-inprogress-help").exists()).toBe(true);
      expect(wrapper.find("#verifier-pairing-code").text()).toBe("PAIRING");
      expect(wrapper.find("#verifier-alert").exists()).toBe(false);

      const timedown = wrapper.findComponent({ name: "Timedown" });
      expect(timedown.exists()).toBe(true);
      expect(timedown.props("maxSeconds")).toBe(300);
      expect(timedown.props("currentSeconds")).toBe(300);

      expect(modalInstances).toHaveLength(1);
      expect(modalInstances[0].selector).toBe("#expiredModal");
      expect(pushMock).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("shows an alert when the countdown is about to expire", async () => {
      const wrapper = await mountView();

      wrapper.findComponent({ name: "Timedown" }).vm.$emit("alert");
      await flushPromises();

      expect(wrapper.find("#verifier-alert").exists()).toBe(true);
      expect(wrapper.find("#verifier-alert-title").text()).not.toBe("");
      wrapper.unmount();
    });

    it("opens the expired modal on timeout and restarts from it", async () => {
      const wrapper = await mountView();
      const modal = modalInstances[0];

      wrapper.findComponent({ name: "Timedown" }).vm.$emit("timeout");
      expect(modal.show).toHaveBeenCalledTimes(1);

      await wrapper.find("#restart-process").trigger("click");
      expect(modal.hide).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith({ name: "Welcome" });
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

  it("redirects to the election welcome page without a pairing code", async () => {
    useVerificationStore().pairingCode = null;

    const wrapper = await mountView();

    expect(pushMock).toHaveBeenCalledWith("/en/org_slug/election_slug");
    wrapper.unmount();
  });

  describe("with a decrypted ballot", () => {
    it("shows the spoiled ballot and finishes the session", async () => {
      setBallot(["c1"]);

      const wrapper = await mountView();

      expect(wrapper.find("#verifier-spoiled-content").exists()).toBe(true);
      expect(wrapper.find("#verifier-spoiled-help").exists()).toBe(true);
      expect(wrapper.find("#verifier-inprogress-content").exists()).toBe(false);
      expect(wrapper.findComponent({ name: "Timedown" }).exists()).toBe(false);
      expect(renderedOrder(wrapper)).toEqual(["c1"]);

      await wrapper.find("#finish-session").trigger("click");
      expect(modalInstances[0].hide).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith({ name: "Welcome" });
      wrapper.unmount();
    });

    it("keeps the ballot order when no configuration is loaded", async () => {
      setBallot(["c2", "c1"]);

      const wrapper = await mountView();

      expect(renderedOrder(wrapper)).toEqual(["c2", "c1"]);
      wrapper.unmount();
    });

    it("keeps the ballot order when the configuration has no ballot or voting round configs", async () => {
      useConfigStore().latestConfig = {} as any;
      setBallot(["c2", "c1"]);

      const wrapper = await mountView();

      expect(renderedOrder(wrapper)).toEqual(["c2", "c1"]);
      wrapper.unmount();
    });

    it("orders contests by the exactly matching ballot config", async () => {
      useConfigStore().latestConfig = {
        ballotConfigs: {
          noRefs: { content: {} },
          superset: { content: { contestReferences: ["c3", "c2", "c1"] } },
          exact: { content: { contestReferences: ["c1", "c3"] } },
        },
      } as any;
      setBallot(["c3", "c1"]);

      const wrapper = await mountView();

      expect(renderedOrder(wrapper)).toEqual(["c1", "c3"]);
      wrapper.unmount();
    });

    it("falls back to a ballot config containing every contest", async () => {
      useConfigStore().latestConfig = {
        ballotConfigs: {
          other: { content: { contestReferences: ["c1", "c9"] } },
          superset: { content: { contestReferences: ["c3", "c2", "c1"] } },
        },
      } as any;
      setBallot(["c1", "c3"]);

      const wrapper = await mountView();

      expect(renderedOrder(wrapper)).toEqual(["c3", "c1"]);
      wrapper.unmount();
    });

    it("orders contests by the positions of the voting round containing them all", async () => {
      useConfigStore().latestConfig = {
        ballotConfigs: {
          exact: { content: { contestReferences: ["c1", "c2", "c3"] } },
        },
        votingRoundConfigs: {
          noRefs: { content: {} },
          all: {
            content: {
              contestReferences: ["c1", "c2", "c3"],
              contestPositions: { c1: 3, c2: 1, c3: 2 },
            },
          },
        },
      } as any;
      setBallot(["c1", "c2", "c3"]);

      const wrapper = await mountView();

      expect(renderedOrder(wrapper)).toEqual(["c2", "c3", "c1"]);
      wrapper.unmount();
    });

    it("uses a partially matching voting round and puts unpositioned contests last", async () => {
      useConfigStore().latestConfig = {
        ballotConfigs: {
          exact: { content: { contestReferences: ["c1", "c2", "c3"] } },
        },
        votingRoundConfigs: {
          unrelated: { content: { contestReferences: ["x"] } },
          partial: {
            content: {
              contestReferences: ["c3", "c2"],
              contestPositions: { c3: 1 },
            },
          },
        },
      } as any;
      setBallot(["c2", "c1", "c3"]);

      const wrapper = await mountView();

      // c3 has a position; c1 and c2 fall back to the ballot config order
      expect(renderedOrder(wrapper)).toEqual(["c3", "c1", "c2"]);
      wrapper.unmount();
    });

    it("ignores voting rounds without positions or matching contests", async () => {
      useConfigStore().latestConfig = {
        votingRoundConfigs: {
          unrelated: { content: { contestReferences: ["x"] } },
          noPositions: { content: { contestReferences: ["c1", "c2"] } },
        },
      } as any;
      setBallot(["c2", "c1"]);

      const wrapper = await mountView();

      expect(renderedOrder(wrapper)).toEqual(["c2", "c1"]);
      wrapper.unmount();
    });

    it("keeps the ballot order when no voting round matches", async () => {
      useConfigStore().latestConfig = {
        votingRoundConfigs: {
          unrelated: { content: { contestReferences: ["x"] } },
        },
      } as any;
      setBallot(["c2", "c1"]);

      const wrapper = await mountView();

      expect(renderedOrder(wrapper)).toEqual(["c2", "c1"]);
      wrapper.unmount();
    });
  });
});
