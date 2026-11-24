import "./test-utils/setupConfig";
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { flushPromises } from "@vue/test-utils";
import { createPinia } from "pinia";
import { h } from "vue";
import { mountForA11y } from "./test-utils/a11y";

const mocks = vi.hoisted(() => ({
  conferenceClient: {
    getStatus: vi.fn(),
    getResultsPublished: vi.fn(),
    getTranslationsData: vi.fn(),
    getStylingData: vi.fn(),
  },
  apiGet: vi.fn(),
}));

vi.mock("@/lib/conferenceServices", () => ({
  useConferenceConnector: () => ({ conferenceClient: mocks.conferenceClient }),
}));

vi.mock("@/lib/api", () => ({ api: { get: mocks.apiGet } }));

vi.mock("./router", async () => {
  const { createRouter, createMemoryHistory } = await import("vue-router");
  const { h: render } = await import("vue");
  return {
    default: createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/:locale/:organisationSlug/:electionSlug",
          component: {
            render: () =>
              render("div", { id: "main_content" }, [
                render("h1", "Election page"),
                render("p", "Page content"),
              ]),
          },
        },
      ],
    }),
  };
});

vi.mock("./components/Header.vue", async () => {
  const { h: render } = await import("vue");
  return {
    default: {
      name: "HeaderStub",
      props: ["election", "electionName", "locale"],
      render: () => render("header", [render("span", "Election header")]),
    },
  };
});

vi.mock("./components/Footer.vue", async () => {
  const { h: render } = await import("vue");
  return {
    default: {
      name: "FooterStub",
      render: () => render("footer", [render("span", "Election footer")]),
    },
  };
});

const App = (await import("./App.vue")).default;
const router = (await import("./router")).default;
const i18n = (await import("./lib/i18n")).default;

const SpinnerStub = { render: () => h("span", { "aria-hidden": "true" }) };

beforeEach(async () => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.conferenceClient.getStatus.mockResolvedValue({
    boardSlug: "board-x",
    title: { en: "Status title" },
  });
  mocks.conferenceClient.getResultsPublished.mockResolvedValue(true);
  mocks.conferenceClient.getTranslationsData.mockRejectedValue(
    new Error("offline"),
  );
  mocks.conferenceClient.getStylingData.mockResolvedValue("");
  mocks.apiGet.mockResolvedValue({
    data: {
      items: {
        electionConfig: {
          content: { locales: ["en"], title: { en: "My Election" } },
        },
      },
    },
  });
  await router.push("/en/org/el");
  await router.isReady();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function mountApp() {
  return mountForA11y(App, {
    global: {
      plugins: [i18n, createPinia(), router],
      stubs: { AVSpinner: SpinnerStub },
    },
  });
}

test("App has no accessibility violations while loading", async () => {
  mocks.conferenceClient.getStatus.mockReturnValue(new Promise(() => {}));

  const wrapper = await mountApp();
  await flushPromises();

  expect(wrapper.find(".DBAS__Loading_Page").exists()).toBe(true);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});

test("App has no accessibility violations once loaded", async () => {
  const wrapper = await mountApp();
  await flushPromises();

  expect(wrapper.find(".DBAS").exists()).toBe(true);
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
