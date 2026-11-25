import { describe, it, expect, beforeEach, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import useConfigStore from "@/stores/useConfigStore";
import { useElectionBranding } from "../useElectionBranding";
import type { SupportedLocale } from "@/Types";

vi.mock("@/lib/config", () => ({
  default: {
    dbbUrl: "http://dbb.localhost:3003",
    conferenceUrl: "http://electa.localhost:3016",
  },
}));

function createConfigStoreWithVotingPortal(
  votingPortal?: { tabName?: Record<string, string>; faviconUrl?: string },
  title?: Record<string, string>,
) {
  const configStore = useConfigStore();
  configStore.setElectionStatus({
    id: 1,
    slug: "test-election",
    title: title ?? { en: "Default Election Title", da: "Standard Valg Titel" },
    votingPortal,
  } as any);
  return configStore;
}

function mountWithBranding(
  votingPortal?: { tabName?: Record<string, string>; faviconUrl?: string },
  title?: Record<string, string>,
) {
  const pinia = createPinia();
  setActivePinia(pinia);

  createConfigStoreWithVotingPortal(votingPortal, title);

  const TestComponent = defineComponent({
    setup() {
      const branding = useElectionBranding();
      const setTitle = (locale: SupportedLocale) => {
        branding.updateDocumentTitle(locale);
      };
      const getTabName = (locale: SupportedLocale) => {
        return branding.getTabName(locale);
      };
      return { branding, setTitle, getTabName };
    },
    render() {
      return h("div", "test");
    },
  });

  const wrapper = mount(TestComponent, {
    global: { plugins: [pinia] },
  });

  return {
    wrapper,
    branding: wrapper.vm.branding,
    setTitle: wrapper.vm.setTitle,
    getTabName: wrapper.vm.getTabName,
  };
}

describe("useElectionBranding", () => {
  beforeEach(() => {
    document.title = "";

    const existingFavicon = document.querySelector("link[rel*='icon']");
    if (existingFavicon) {
      existingFavicon.remove();
    }
  });

  describe("updateDocumentTitle", () => {
    it("uses custom tab name from votingPortal when available", () => {
      const { setTitle } = mountWithBranding(
        { tabName: { en: "Custom Tab Name", da: "Brugerdefineret Fane Navn" } },
        { en: "Election Title", da: "Valg Titel" },
      );

      setTitle("en" as SupportedLocale);
      expect(document.title).toBe("Custom Tab Name");
    });

    it("uses custom tab name for specific locale", () => {
      const { setTitle } = mountWithBranding(
        { tabName: { en: "Custom Tab Name", da: "Brugerdefineret Fane Navn" } },
        { en: "Election Title", da: "Valg Titel" },
      );

      setTitle("da" as SupportedLocale);
      expect(document.title).toBe("Brugerdefineret Fane Navn");
    });

    it("falls back to English tab name when specific locale not available", () => {
      const { setTitle } = mountWithBranding(
        { tabName: { en: "English Tab Name" } },
        { en: "Election Title", da: "Valg Titel" },
      );

      setTitle("da" as SupportedLocale);
      expect(document.title).toBe("English Tab Name");
    });

    it("falls back to first available tab name when English not available", () => {
      const { setTitle } = mountWithBranding(
        { tabName: { da: "Dansk Fane Navn", fr: "Nom Onglet Français" } },
        { en: "Election Title", da: "Valg Titel" },
      );

      setTitle("en" as SupportedLocale);
      expect(document.title).toBe("Dansk Fane Navn");
    });

    it("falls back to election title when no custom tab name configured", () => {
      const { setTitle } = mountWithBranding(undefined, {
        en: "Election Title",
        da: "Valg Titel",
      });

      setTitle("en" as SupportedLocale);
      expect(document.title).toBe("Election Title");
    });

    it("falls back to election title for current locale", () => {
      const { setTitle } = mountWithBranding(undefined, {
        en: "Election Title",
        da: "Valg Titel",
      });

      setTitle("da" as SupportedLocale);
      expect(document.title).toBe("Valg Titel");
    });

    it("falls back to English election title when locale not available", () => {
      const { setTitle } = mountWithBranding(undefined, {
        en: "English Election Title",
      });

      setTitle("da" as SupportedLocale);
      expect(document.title).toBe("English Election Title");
    });

    it("falls back to default when no titles are available", () => {
      const { setTitle } = mountWithBranding({}, {});

      setTitle("en" as SupportedLocale);
      expect(document.title).toBe("Election Verification Site");
    });
  });

  describe("favicon", () => {
    it("sets custom favicon from votingPortal when available", () => {
      mountWithBranding({
        faviconUrl: "/custom-election-favicon.ico",
      });

      const faviconLink =
        document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      expect(faviconLink?.href).toContain("/custom-election-favicon.ico");
    });

    it("uses default favicon when no custom favicon configured", () => {
      mountWithBranding({});

      const faviconLink =
        document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      expect(faviconLink?.href).toContain("/favicon.ico");
    });

    it("updates existing favicon link if one exists", () => {
      const existingFavicon = document.createElement("link");
      existingFavicon.rel = "icon";
      existingFavicon.href = "/original-favicon.svg";
      document.head.appendChild(existingFavicon);

      mountWithBranding({
        faviconUrl: "/updated-favicon.ico",
      });

      const faviconLink =
        document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      expect(faviconLink?.href).toContain("/updated-favicon.ico");
    });

    it("creates favicon link element if none exists", () => {
      mountWithBranding({
        faviconUrl: "/new-favicon.ico",
      });

      const faviconLink =
        document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      expect(faviconLink).not.toBeNull();
      expect(faviconLink?.rel).toBe("icon");
      expect(faviconLink?.href).toContain("/new-favicon.ico");
    });

    it("skips DOM mutation when favicon URL is unchanged", () => {
      const { branding } = mountWithBranding({
        faviconUrl: "/custom-favicon.ico",
      });

      const faviconLink =
        document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      const originalHref = faviconLink!.href;

      branding.updateFavicon();

      expect(faviconLink!.href).toBe(originalHref);
    });
  });

  describe("resetBranding", () => {
    it("resets favicon and document title to defaults", () => {
      const { branding, setTitle } = mountWithBranding({
        faviconUrl: "/custom-favicon.ico",
        tabName: { en: "Custom Tab" },
      });
      setTitle("en");
      expect(document.title).toBe("Custom Tab");

      branding.resetBranding();

      const faviconLink =
        document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      expect(faviconLink?.href).toContain("/favicon.ico");
      expect(document.title).toBe("Election Verification Site");
    });
  });

  describe("getTabName", () => {
    it("returns custom tab name for specified locale", () => {
      const { getTabName } = mountWithBranding({
        tabName: { en: "English Tab", da: "Danish Tab" },
      });

      const result = getTabName("da" as SupportedLocale);
      expect(result).toBe("Danish Tab");
    });

    it("returns null when no custom tab name configured", () => {
      const { getTabName } = mountWithBranding({});

      const result = getTabName("en" as SupportedLocale);
      expect(result).toBeNull();
    });
  });
});

describe("useElectionBranding edge cases", () => {
  beforeEach(() => {
    document.title = "";
    document
      .querySelectorAll("link[rel*='icon']")
      .forEach((link) => link.remove());
  });

  function mountWithoutStatus() {
    const pinia = createPinia();
    setActivePinia(pinia);
    const TestComponent = defineComponent({
      setup() {
        return { branding: useElectionBranding() };
      },
      render() {
        return h("div");
      },
    });
    const wrapper = mount(TestComponent, { global: { plugins: [pinia] } });
    return { wrapper, configStore: useConfigStore() };
  }

  it("returns null when the tab name map is empty", () => {
    const { getTabName } = mountWithBranding({ tabName: {} });

    expect(getTabName("en" as SupportedLocale)).toBeNull();
  });

  it("falls back to the election title when the tab name map is empty", () => {
    const { setTitle } = mountWithBranding(
      { tabName: {} },
      { en: "Election Title" },
    );

    setTitle("en" as SupportedLocale);
    expect(document.title).toBe("Election Title");
  });

  it("falls back to the first election title when neither locale nor English exist", () => {
    const { setTitle } = mountWithBranding(undefined, { da: "Valg Titel" });

    setTitle("es" as SupportedLocale);
    expect(document.title).toBe("Valg Titel");
  });

  it("falls back to the default tab name when no election status is loaded", () => {
    const { wrapper } = mountWithoutStatus();

    wrapper.vm.branding.updateDocumentTitle("en" as SupportedLocale);
    expect(document.title).toBe("Election Verification Site");
  });

  it("does not touch the favicon until an election status is loaded", async () => {
    const { wrapper, configStore } = mountWithoutStatus();

    expect(document.querySelector("link[rel*='icon']")).toBeNull();
    expect(wrapper.vm.branding.currentFaviconUrl.value).toBe("");

    configStore.setElectionStatus({
      votingPortal: { faviconUrl: "/late-favicon.ico" },
    } as any);
    await nextTick();

    const faviconLink =
      document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    expect(faviconLink?.href).toContain("/late-favicon.ico");
    expect(wrapper.vm.branding.currentFaviconUrl.value).toBe(
      "/late-favicon.ico",
    );
  });

  it("reuses an existing link whose rel contains 'icon'", () => {
    const existing = document.createElement("link");
    existing.rel = "shortcut icon";
    document.head.appendChild(existing);

    mountWithBranding({ faviconUrl: "/shortcut.ico" });

    const links =
      document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
    expect(links).toHaveLength(1);
    expect(links[0]).toBe(existing);
    expect(links[0].rel).toBe("shortcut icon");
    expect(links[0].href).toContain("/shortcut.ico");
  });

  it("resets the title even when there is no favicon link in the document", () => {
    const { branding } = mountWithBranding({ tabName: { en: "Custom" } });
    document
      .querySelectorAll("link[rel*='icon']")
      .forEach((link) => link.remove());
    document.title = "Custom";

    branding.resetBranding();

    expect(document.title).toBe("Election Verification Site");
    expect(document.querySelector("link[rel*='icon']")).toBeNull();
    expect(branding.currentFaviconUrl.value).toBe("/favicon.ico");
  });
});
