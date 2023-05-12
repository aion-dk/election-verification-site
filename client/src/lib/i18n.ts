import { createI18n } from "vue-i18n";
import { nextTick } from "vue";
import type { Locale } from "../Types";
import router from '../router';

let locale = "en";
const url = new URL(window.location.href);
if (url.pathname.split("/")[1]) locale = url.pathname.split("/")[1];

const i18n = createI18n({
  locale: locale,
  fallbackLocale: "en",
  messages: {},
  datetimeFormats: {
    en: {
      short: {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
      long: {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
      },
    },
    da: {
      short: {
        year: "numeric",
        day: "numeric",
      },
      long: {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
      },
    },
  },
});

export function setLocale(newLocale: Locale, oldLocale: string) {
  i18n.global.locale = locale as Locale;

  const newUrl = url.pathname.replace(
    `/${oldLocale}/`,
    `/${newLocale}/`
  );

  router.replace(newUrl);
}

export function loadLocaleMessages(locale: string, messages: object) {
  i18n.global.setLocaleMessage(locale, messages as any);

  return nextTick();
}

export default i18n;
