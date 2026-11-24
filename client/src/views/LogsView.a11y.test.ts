import "../test-utils/setupConfig";
import { test, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { defineComponent, h } from "vue";
import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import type { LatestConfigItems } from "@/Types";
import useConfigStore from "@/stores/useConfigStore";
import { mountForA11y, i18n, defaultStubs } from "../test-utils/a11y";

const { apiGetMock } = vi.hoisted(() => ({ apiGetMock: vi.fn() }));

vi.mock("@/lib/api", () => ({
  api: { get: apiGetMock },
  options: { baseURL: "http://dbb.test" },
}));

vi.mock("@/router", () => ({ default: { push: vi.fn() } }));

const LogsView = (await import("./LogsView.vue")).default;

const Wrapper = defineComponent({
  setup() {
    return () => h("main", [h(LogsView)]);
  },
});

async function mountLogsView(electionCommittee: boolean) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const configStore = useConfigStore();
  configStore.latestConfig = {
    genesisConfig: { content: { electionCommittee } },
  } as unknown as LatestConfigItems;
  configStore.setBoardSlug("board-slug");

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:locale/:organisationSlug/:electionSlug/logs/:page?",
        component: { template: "<div />" },
      },
    ],
  });
  await router.push("/en/org_slug/election_slug/logs/2");
  await router.isReady();

  const wrapper = await mountForA11y(Wrapper, {
    global: {
      plugins: [i18n, pinia, router],
      stubs: {
        ...defaultStubs,
        BoardItem: {
          props: ["item"],
          template: "<div>{{ item.address }}</div>",
        },
      },
    },
  });
  await flushPromises();
  return wrapper;
}

beforeEach(() => {
  apiGetMock.mockResolvedValue({
    data: {
      items: [{ type: "GenesisItem", address: "addr-1" }],
      meta: { prev_page: 1, next_page: 3, total_pages: 5 },
    },
  });
});

test("LogsView has no accessibility violations", async () => {
  const wrapper = await mountLogsView(false);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("LogsView has no accessibility violations with the pending filter", async () => {
  const wrapper = await mountLogsView(true);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
