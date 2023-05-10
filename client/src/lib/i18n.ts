import translations from "../assets/translations.json";
import { createI18n } from "vue-i18n";

let locale = "en";
const url = new URL(window.location.href);
if (url.pathname.split("/")[1]) locale = url.pathname.split("/")[1];

export default createI18n({
  locale: locale,
  fallbackLocale: "en",
  messages: translations,
});
