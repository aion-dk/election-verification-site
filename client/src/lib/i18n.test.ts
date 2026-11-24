import { describe, it, expect, vi, afterEach } from "vitest";

async function loadI18nModule() {
  vi.resetModules();
  return import("./i18n");
}

describe("i18n", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    globalThis.history.replaceState({}, "", "/");
  });

  it("defaults to English when the URL has no locale segment", async () => {
    globalThis.history.replaceState({}, "", "/");
    const { default: i18n } = await loadI18nModule();

    expect(i18n.global.locale.value).toBe("en");
    expect(i18n.global.fallbackLocale.value).toBe("en");
  });

  it("takes the initial locale from the first URL path segment", async () => {
    globalThis.history.replaceState({}, "", "/da/org/election");
    const { default: i18n } = await loadI18nModule();

    expect(i18n.global.locale.value).toBe("da");
  });

  it("falls back to English when the location cannot be read", async () => {
    vi.stubGlobal("location", undefined);
    const { default: i18n } = await loadI18nModule();

    expect(i18n.global.locale.value).toBe("en");
  });

  it("loads the offline messages", async () => {
    const { default: i18n } = await loadI18nModule();
    const { offlineMessages } = await import("@/assets/translations");

    expect(i18n.global.availableLocales).toEqual(
      expect.arrayContaining(Object.keys(offlineMessages)),
    );
  });

  describe("setLocale", () => {
    it("sets the locale and a left-to-right direction on <html>", async () => {
      const { default: i18n, setLocale } = await loadI18nModule();

      setLocale("da");

      const html = document.getElementsByTagName("html")[0];
      expect(i18n.global.locale.value).toBe("da");
      expect(html.lang).toBe("da");
      expect(html.dir).toBe("ltr");
    });

    it.each(["ar", "dv", "fa", "ha", "he", "ks", "ku", "ps", "ur", "yi"])(
      "sets a right-to-left direction for %s",
      async (locale) => {
        const { default: i18n, setLocale } = await loadI18nModule();

        setLocale(locale);

        const html = document.getElementsByTagName("html")[0];
        expect(i18n.global.locale.value).toBe(locale);
        expect(html.lang).toBe(locale);
        expect(html.dir).toBe("rtl");
      },
    );
  });

  describe("loadLocaleMessages", () => {
    it("registers the messages for the locale and resolves on next tick", async () => {
      const { default: i18n, loadLocaleMessages } = await loadI18nModule();
      const messages = { greeting: "Hej" };

      const result = loadLocaleMessages("xx", messages);

      expect(result).toBeInstanceOf(Promise);
      await expect(result).resolves.toBeUndefined();
      expect(i18n.global.getLocaleMessage("xx")).toEqual(messages);
      expect(i18n.global.t("greeting", {}, { locale: "xx" })).toBe("Hej");
    });
  });
});
