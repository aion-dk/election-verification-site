import "./test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { h, nextTick } from "vue";
import type { DefineLocaleMessage } from "vue-i18n";
import { fallbackMessages, offlineMessages } from "./assets/translations";
import { defaultTheme } from "./assets/theme";

const mocks = vi.hoisted(() => ({
  conferenceClient: {
    getStatus: vi.fn(),
    getResultsPublished: vi.fn(),
    getTranslationsData: vi.fn(),
    getStylingData: vi.fn(),
  },
  useConferenceConnector: vi.fn(),
  apiGet: vi.fn(),
  routeMounts: { count: 0 },
}));

vi.mock("@/lib/conferenceServices", () => ({
  useConferenceConnector: mocks.useConferenceConnector,
}));

vi.mock("@/lib/api", () => ({ api: { get: mocks.apiGet } }));

vi.mock("./router", async () => {
  const { createRouter, createMemoryHistory } = await import("vue-router");
  const { defineComponent: define, h: render, onMounted } = await import("vue");
  const Page = define({
    name: "PageStub",
    setup() {
      onMounted(() => {
        mocks.routeMounts.count += 1;
      });
      return () => render("p", { class: "page-stub" }, "page content");
    },
  });
  return {
    default: createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/:locale/:organisationSlug/:electionSlug", component: Page },
        {
          path: "/no-locale/:organisationSlug/:electionSlug",
          component: Page,
        },
      ],
    }),
  };
});

vi.mock("./components/Header.vue", async () => {
  const { defineComponent: define, h: render } = await import("vue");
  return {
    default: define({
      name: "HeaderStub",
      props: ["election", "electionName", "locale"],
      emits: ["changeLocale"],
      setup(props, { emit }) {
        return () =>
          render("header", { class: "header-stub" }, [
            render("span", { class: "header-name" }, props.electionName),
            render("span", { class: "header-locale" }, props.locale),
            render(
              "button",
              {
                type: "button",
                class: "header-switch",
                onClick: () => emit("changeLocale", "ar"),
              },
              "switch",
            ),
          ]);
      },
    }),
  };
});

vi.mock("./components/Footer.vue", async () => {
  const { defineComponent: define, h: render } = await import("vue");
  return {
    default: define({
      name: "FooterStub",
      setup: () => () => render("footer", { class: "footer-stub" }),
    }),
  };
});

const App = (await import("./App.vue")).default;
const router = (await import("./router")).default;
const i18n = (await import("./lib/i18n")).default;
const { setLocale } = await import("./lib/i18n");
const useConfigStore = (await import("./stores/useConfigStore")).default;

const STATUS = {
  boardSlug: "board-x",
  title: { en: "Status title", ar: "عنوان الحالة", es: "Título" },
};

function electionConfig(locales?: string[]) {
  return {
    data: {
      items: {
        electionConfig: {
          content: {
            locales,
            title: { en: "My Election", ar: "انتخاباتي", es: "Mi elección" },
          },
        },
      },
    },
  };
}

const translationsFor = (locale: string) => ({
  js: {
    components: { AVSpinner: { loading: `${locale} loading` } },
    accessibility: {
      skip_to_content: `${locale} skip content`,
      skip_navigation: `${locale} skip nav`,
    },
  },
});

const SpinnerStub = { render: () => h("span", { class: "spinner-stub" }) };

let pinia: Pinia;
let headChildren: Node[];
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

async function mountApp(path = "/en/org/el", options = {}) {
  await router.push(path);
  await router.isReady();
  const wrapper = mount(App, {
    attachTo: document.body,
    global: {
      plugins: [pinia, router, i18n],
      stubs: { AVSpinner: SpinnerStub },
    },
    ...options,
  });
  await flushPromises();
  return wrapper;
}

function addedStyleTags() {
  return Array.from(document.head.querySelectorAll("style")).filter(
    (node) => !headChildren.includes(node),
  );
}

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.routeMounts.count = 0;
    pinia = createPinia();
    setActivePinia(pinia);
    headChildren = Array.from(document.head.childNodes);
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    for (const locale of ["en", "es", "ar"]) {
      i18n.global.setLocaleMessage(
        locale,
        offlineMessages[locale] as DefineLocaleMessage,
      );
    }
    setLocale("en");
    document.title = "";

    mocks.useConferenceConnector.mockReturnValue({
      conferenceClient: mocks.conferenceClient,
    });
    mocks.conferenceClient.getStatus.mockResolvedValue(STATUS);
    mocks.conferenceClient.getResultsPublished.mockResolvedValue(true);
    mocks.conferenceClient.getTranslationsData.mockImplementation(
      async (locale: string) => translationsFor(locale),
    );
    mocks.conferenceClient.getStylingData.mockResolvedValue(
      ".custom-theme { color: red; }",
    );
    mocks.apiGet.mockResolvedValue(electionConfig(["en", "ar"]));
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-US", "en"]);
  });

  afterEach(() => {
    for (const node of Array.from(document.head.childNodes)) {
      if (!headChildren.includes(node)) node.remove();
    }
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("shows an accessible loading state until the configuration is loaded", async () => {
    let resolveStatus: (value: typeof STATUS) => void;
    mocks.conferenceClient.getStatus.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveStatus = resolve;
      }),
    );

    const wrapper = await mountApp();

    const loading = wrapper.find(".DBAS__Loading_Page");
    expect(loading.exists()).toBe(true);
    expect(loading.attributes("role")).toBe("main");
    expect(loading.find("h1").text()).toBe("Loading...");
    expect(wrapper.find(".DBAS").exists()).toBe(false);

    resolveStatus(STATUS);
    await flushPromises();

    expect(wrapper.find(".DBAS__Loading_Page").exists()).toBe(false);
    expect(wrapper.find(".DBAS").exists()).toBe(true);
    wrapper.unmount();
  });

  it("loads status, results flag, config, translations and theme for the route's election", async () => {
    const wrapper = await mountApp("/en/org/el");
    const configStore = useConfigStore();

    expect(mocks.useConferenceConnector).toHaveBeenCalledWith("org", "el");
    expect(configStore.boardSlug).toBe("board-x");
    expect(mocks.apiGet).toHaveBeenCalledWith(
      "board-x/configuration/latest_config",
    );
    expect(configStore.resultsPublished).toBe(true);
    expect(configStore.resultsPublishedLoaded).toBe(true);
    expect(configStore.electionStatus).toEqual(STATUS);

    expect(mocks.conferenceClient.getTranslationsData.mock.calls).toEqual([
      ["en"],
      ["ar"],
    ]);
    expect(i18n.global.getLocaleMessage("ar")).toEqual(translationsFor("ar"));
    expect(i18n.global.getLocaleMessage("en")).toEqual(translationsFor("en"));

    const styles = addedStyleTags();
    expect(styles).toHaveLength(1);
    expect(styles[0].innerHTML).toBe(".custom-theme { color: red; }");
    expect(configStore.electionTheme).toBe(".custom-theme { color: red; }");

    expect(wrapper.find(".DBAS").exists()).toBe(true);
    expect(wrapper.find(".header-name").text()).toBe("My Election");
    expect(wrapper.find(".header-locale").text()).toBe("en");
    expect(wrapper.find(".footer-stub").exists()).toBe(true);
    expect(wrapper.find("main.DBAS__Content .page-stub").exists()).toBe(true);
    expect(document.title).toBe("Status title");
    expect(document.documentElement.lang).toBe("en");
    expect(document.documentElement.dir).toBe("ltr");
    wrapper.unmount();
  });

  it("renders a skip navigation link to the main content", async () => {
    const wrapper = await mountApp();

    const nav = wrapper.find("nav.DBAS__Skip_Nav");
    expect(nav.attributes("aria-label")).toBe("en skip nav");
    const link = nav.find("a");
    expect(link.attributes("href")).toBe("#main_content");
    expect(link.text()).toBe("en skip content");
    wrapper.unmount();
  });

  it("uses the locale from the URL and switches the document to RTL for Arabic", async () => {
    const wrapper = await mountApp("/ar/org/el");

    expect(i18n.global.locale.value).toBe("ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(wrapper.find(".header-name").text()).toBe("انتخاباتي");
    expect(wrapper.find(".header-locale").text()).toBe("ar");
    expect(document.title).toBe("عنوان الحالة");
    wrapper.unmount();
  });

  it("falls back to a browser language supported by the election when the URL locale is not", async () => {
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["fr-CA", "ar"]);

    const wrapper = await mountApp("/fr/org/el");

    expect(i18n.global.locale.value).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    wrapper.unmount();
  });

  it("falls back to the election's first locale when neither URL nor browser match", async () => {
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["xx"]);
    mocks.apiGet.mockResolvedValue(electionConfig(["es", "en"]));

    const wrapper = await mountApp("/fr/org/el");

    expect(i18n.global.locale.value).toBe("es");
    expect(document.documentElement.lang).toBe("es");
    expect(wrapper.find(".header-name").text()).toBe("Mi elección");
    wrapper.unmount();
  });

  it("handles routes without a locale parameter", async () => {
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["ar"]);

    const wrapper = await mountApp("/no-locale/org/el");

    expect(mocks.useConferenceConnector).toHaveBeenCalledWith("org", "el");
    expect(i18n.global.locale.value).toBe("ar");
    wrapper.unmount();
  });

  it("only applies the browser locale when the election defines no locales", async () => {
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["es"]);
    mocks.apiGet.mockResolvedValue(electionConfig(undefined));

    const wrapper = await mountApp("/en/org/el");

    expect(mocks.conferenceClient.getTranslationsData).not.toHaveBeenCalled();
    expect(i18n.global.locale.value).toBe("es");
    expect(wrapper.find(".DBAS").exists()).toBe(true);
    wrapper.unmount();
  });

  it("treats results as unpublished when the results flag cannot be fetched", async () => {
    const error = new Error("results down");
    mocks.conferenceClient.getResultsPublished.mockRejectedValue(error);

    const wrapper = await mountApp();
    const configStore = useConfigStore();

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    expect(configStore.resultsPublished).toBe(false);
    expect(configStore.resultsPublishedLoaded).toBe(true);
    expect(wrapper.find(".DBAS").exists()).toBe(true);
    wrapper.unmount();
  });

  it("uses the bundled fallback messages when translations cannot be fetched", async () => {
    const error = new Error("translations down");
    mocks.apiGet.mockResolvedValue(electionConfig(["en", "es"]));
    mocks.conferenceClient.getTranslationsData.mockImplementation(
      async (locale: string) => {
        if (locale === "es") throw error;
        return translationsFor(locale);
      },
    );

    const wrapper = await mountApp();

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    expect(i18n.global.getLocaleMessage("es")).toEqual(fallbackMessages.es);
    expect(i18n.global.getLocaleMessage("en")).toEqual(translationsFor("en"));
    wrapper.unmount();
  });

  it("injects the default theme when the election theme cannot be fetched", async () => {
    const error = new Error("theme down");
    mocks.conferenceClient.getStylingData.mockRejectedValue(error);

    const wrapper = await mountApp();

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    const styles = addedStyleTags();
    expect(styles).toHaveLength(1);
    expect(styles[0].innerHTML).toBe(defaultTheme);
    expect(useConfigStore().electionTheme).toBe(defaultTheme);
    wrapper.unmount();
  });

  it("keeps going without a status when the second status fetch fails", async () => {
    const error = new Error("status down");
    mocks.conferenceClient.getStatus
      .mockResolvedValueOnce(STATUS)
      .mockRejectedValueOnce(error);

    const wrapper = await mountApp();
    const configStore = useConfigStore();

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    expect(configStore.electionStatus).toBeNull();
    expect(configStore.boardSlug).toBe("board-x");
    expect(document.title).toBe("Election Verification Site");
    expect(addedStyleTags()).toHaveLength(1);
    expect(wrapper.find(".DBAS").exists()).toBe(true);
    wrapper.unmount();
  });

  it("skips theme loading when the status and theme are already known", async () => {
    const configStore = useConfigStore();
    configStore.setElectionStatus(STATUS as never);
    configStore.setElectionTheme(".already-loaded {}");

    const wrapper = await mountApp();

    expect(mocks.conferenceClient.getStatus).toHaveBeenCalledTimes(1);
    expect(mocks.conferenceClient.getStylingData).not.toHaveBeenCalled();
    expect(addedStyleTags()).toHaveLength(0);
    expect(wrapper.find(".DBAS").exists()).toBe(true);
    wrapper.unmount();
  });

  it("stays on the loading page when the initial status request fails", async () => {
    const error = new Error("status down");
    mocks.conferenceClient.getStatus.mockRejectedValue(error);
    const errorHandler = vi.fn();

    const wrapper = await mountApp("/en/org/el", {
      global: {
        plugins: [pinia, router, i18n],
        stubs: { AVSpinner: SpinnerStub },
        config: { errorHandler },
      },
    });

    expect(errorHandler).toHaveBeenCalledWith(
      error,
      expect.anything(),
      expect.any(String),
    );
    expect(mocks.apiGet).not.toHaveBeenCalled();
    expect(wrapper.find(".DBAS__Loading_Page").exists()).toBe(true);
    expect(wrapper.find(".DBAS").exists()).toBe(false);
    wrapper.unmount();
  });

  it("switches locale from the header, updating URL, direction and title", async () => {
    const wrapper = await mountApp("/en/org/el");
    expect(document.documentElement.dir).toBe("ltr");

    await wrapper.find(".header-switch").trigger("click");
    await flushPromises();

    expect(router.currentRoute.value.fullPath).toBe("/ar/org/el");
    expect(i18n.global.locale.value).toBe("ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.title).toBe("عنوان الحالة");
    expect(wrapper.find(".header-locale").text()).toBe("ar");
    wrapper.unmount();
  });

  it("re-mounts the routed page when the store requests a page refresh", async () => {
    const wrapper = await mountApp();
    expect(mocks.routeMounts.count).toBe(1);

    useConfigStore().pageReloaded();
    await nextTick();

    expect(mocks.routeMounts.count).toBe(2);
    wrapper.unmount();
  });

  it("passes the loaded election to the header", async () => {
    const wrapper = await mountApp();

    const header = wrapper.findComponent({ name: "HeaderStub" });
    expect(header.props("election")).toEqual(
      useConfigStore().election as unknown,
    );
    expect(header.props("election").locales).toEqual(["en", "ar"]);
    wrapper.unmount();
  });
});
