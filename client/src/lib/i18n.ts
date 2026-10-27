import { createI18n } from "vue-i18n";
import { nextTick } from "vue";
import type { Locale, DefineLocaleMessage } from "vue-i18n";
import { offlineMessages } from "@/assets/translations";

let locale: Locale = "en";
const rtlLanguages: Set<Locale> = new Set([
  "ar",
  "dv",
  "fa",
  "ha",
  "he",
  "ks",
  "ku",
  "ps",
  "ur",
  "yi",
]);

function getLocaleFromUrl(): Locale {
  try {
    const url = new URL(globalThis.location.href);
    const segment = url.pathname.split("/")[1];
    if (segment) return segment as Locale;
  } catch {
    // SSR or test environment
  }
  return "en";
}

locale = getLocaleFromUrl();

const i18n = createI18n({
  legacy: false,
  locale: locale,
  fallbackLocale: "en",
  messages: offlineMessages,
});

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale;

  const htmlElement = document.getElementsByTagName("html")[0];
  htmlElement.lang = locale;
  htmlElement.dir = rtlLanguages.has(locale) ? "rtl" : "ltr";
}

export function loadLocaleMessages(locale: string, messages: object) {
  i18n.global.setLocaleMessage(locale, messages as DefineLocaleMessage);

  return nextTick();
}

export default i18n;
