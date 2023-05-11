import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("useLocaleStore", () => {
  const locale = ref("en");
  const enabledLocales = ref([]);

  const setLocale = (newLocale: string) => {
    locale.value = newLocale;
  };

  const setEnabledLocales = (response: string[]) => {
    enabledLocales.value = response;
  }

  return { locale, setLocale, enabledLocales, setEnabledLocales };
});
