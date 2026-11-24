import "../test-utils/setupConfig";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import useConfigStore from "@/stores/useConfigStore";
import DOMPurify from "dompurify";
import Footer from "./Footer.vue";
import { fallbackMessages } from "../assets/translations";

const neededStrings = JSON.stringify(fallbackMessages.en);
const messages = {
  en: JSON.parse(neededStrings),
  da: JSON.parse(neededStrings),
  es: JSON.parse(neededStrings),
};

let pinia: Pinia;

function mountFooter(footerHtml?: unknown, locale = "en") {
  if (footerHtml !== undefined) {
    useConfigStore().setElectionStatus({
      cosmetics: { footerHtml },
    } as any);
  }
  const i18n = createI18n({ legacy: false, locale, messages });
  return mount(Footer, { global: { plugins: [i18n, pinia] } });
}

function isDefaultFooter(wrapper: ReturnType<typeof mountFooter>) {
  const classes = wrapper.find("footer").classes();
  return (
    !wrapper.find("#footer-custom-content").exists() &&
    wrapper.find("#footer-content").exists() &&
    classes.includes("Footer") &&
    !classes.includes("Footer--custom")
  );
}

describe("Footer", () => {
  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("default footer", () => {
    it("renders the 'powered by' text and logo link when no election status is loaded", () => {
      const wrapper = mountFooter();

      expect(isDefaultFooter(wrapper)).toBe(true);
      expect(wrapper.find("#footer-powered-by").text()).toBe("Powered by");
      const link = wrapper.find("#footer-av-link");
      expect(link.attributes("href")).toBe("https://www.lumiglobal.com/");
      expect(link.attributes("target")).toBe("_blank");
      expect(link.attributes("rel")).toBe("noopener noreferrer");
      const img = wrapper.find("#footer-av-logo");
      expect(img.attributes("alt")).toBe("Lumi global logo");
      expect(img.attributes("src")).toBeTruthy();
    });

    it("renders the default footer when cosmetics have no footerHtml", () => {
      useConfigStore().setElectionStatus({ cosmetics: {} } as any);
      const i18n = createI18n({ legacy: false, locale: "en", messages });
      const wrapper = mount(Footer, { global: { plugins: [i18n, pinia] } });

      expect(isDefaultFooter(wrapper)).toBe(true);
    });

    it("renders the default footer when footerHtml is a blank string", () => {
      expect(isDefaultFooter(mountFooter("   \n  "))).toBe(true);
    });

    it("renders the default footer when the localized footerHtml is blank", () => {
      expect(isDefaultFooter(mountFooter({ en: "   " }))).toBe(true);
    });

    it("renders the default footer when the localized footerHtml is not a string", () => {
      expect(isDefaultFooter(mountFooter({ en: 42 }))).toBe(true);
    });

    it("renders the default footer when the footerHtml map is empty", () => {
      expect(isDefaultFooter(mountFooter({}))).toBe(true);
    });

    it("renders the default footer when footerHtml is neither a string nor an object", () => {
      expect(isDefaultFooter(mountFooter(123))).toBe(true);
    });
  });

  describe("custom footer", () => {
    it("renders a string footerHtml, trimmed, instead of the default footer", () => {
      const wrapper = mountFooter("  <p>Custom footer</p>  ");

      const custom = wrapper.find("#footer-custom-content");
      expect(custom.html()).toContain("<p>Custom footer</p>");
      expect(wrapper.find("#footer-content").exists()).toBe(false);
      expect(wrapper.find("footer").classes()).toEqual(
        expect.arrayContaining(["Footer", "Footer--custom"]),
      );
    });

    it("uses the footerHtml for the current locale", () => {
      const wrapper = mountFooter(
        { en: "<p>English</p>", da: "<p>Dansk</p>" },
        "da",
      );

      expect(wrapper.find("#footer-custom-content").text()).toBe("Dansk");
    });

    it("falls back to the English footerHtml when the locale is missing", () => {
      const wrapper = mountFooter(
        { en: "<p>English</p>", da: "<p>Dansk</p>" },
        "es",
      );

      expect(wrapper.find("#footer-custom-content").text()).toBe("English");
    });

    it("falls back to the first footerHtml when neither locale nor English exist", () => {
      const wrapper = mountFooter({ da: "<p>Dansk</p>" }, "es");

      expect(wrapper.find("#footer-custom-content").text()).toBe("Dansk");
    });

    it("sanitizes dangerous markup", () => {
      const wrapper = mountFooter(
        '<p onclick="alert(1)">Safe</p><script>alert("x")</script><img src="x" onerror="alert(2)">',
      );

      const html = wrapper.find("#footer-custom-content").html();
      expect(html).toContain("Safe");
      expect(html).not.toContain("<script");
      expect(html).not.toContain("onclick");
      expect(html).not.toContain("onerror");
    });

    it("strips target attributes with the default sanitizer configuration", () => {
      const wrapper = mountFooter(
        '<a href="https://example.com" target="_blank">Example</a>',
      );

      const link = wrapper.find("#footer-custom-content a");
      expect(link.attributes("href")).toBe("https://example.com");
      expect(link.attributes("target")).toBeUndefined();
      expect(link.attributes("rel")).toBeUndefined();
    });
  });

  // DOMPurify drops "target" by default, so the rel hardening below only takes
  // effect when the sanitizer is configured to keep it.
  describe("custom footer with target attributes kept by the sanitizer", () => {
    beforeEach(() => {
      DOMPurify.setConfig({ ADD_ATTR: ["target"] });
    });

    afterEach(() => {
      DOMPurify.clearConfig();
    });

    it("adds noopener and noreferrer to links opening in a new tab", () => {
      const wrapper = mountFooter(
        '<a href="https://example.com" target="_blank">Example</a>',
      );

      const link = wrapper.find("#footer-custom-content a");
      expect(link.attributes("rel")).toBe("noopener noreferrer");
    });

    it("keeps existing rel tokens without duplicating noopener/noreferrer", () => {
      const wrapper = mountFooter(
        '<a href="https://a.com" target="_blank" rel="nofollow  noopener">A</a>' +
          '<a href="https://b.com" target="_blank" rel="noreferrer">B</a>',
      );

      const links = wrapper.findAll("#footer-custom-content a");
      expect(links[0].attributes("rel")).toBe("nofollow noopener noreferrer");
      expect(links[1].attributes("rel")).toBe("noreferrer noopener");
    });

    it("leaves links that do not open in a new tab untouched", () => {
      const wrapper = mountFooter('<a href="https://example.com">Example</a>');

      const link = wrapper.find("#footer-custom-content a");
      expect(link.attributes("rel")).toBeUndefined();
    });
  });
});
