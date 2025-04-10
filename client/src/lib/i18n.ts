import { createI18n } from "vue-i18n";
import { nextTick } from "vue";
import type { Locale, DefineLocaleMessage } from "vue-i18n";
import { offlineMessages } from "@/assets/translations";

let locale: Locale = "en";
const rtlLanguages: Locale[] = [
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
];
const url = new URL(window.location.href);
if (url.pathname.split("/")[1]) locale = url.pathname.split("/")[1];

const i18n = createI18n({
  locale: locale,
  fallbackLocale: "en",
  warnHtmlInMessage: "off",
  messages: offlineMessages,
});

export function setLocale(locale: Locale) {
  i18n.global.locale = locale;

  document.getElementsByTagName("html")[0].lang = locale;

  rtlLanguages.includes(locale)
    ? (document.getElementsByTagName("html")[0].dir = "rtl")
    : (document.getElementsByTagName("html")[0].dir = "ltr");
}

export function loadLocaleMessages(locale: string, messages: object) {
  i18n.global.setLocaleMessage(locale, messages as DefineLocaleMessage);

  return nextTick();
}

export default i18n;
