import { watch, ref, computed } from "vue";
import useConfigStore from "@/stores/useConfigStore";
import type { SupportedLocale } from "@/Types";

const DEFAULT_FAVICON_URL = "/favicon.ico";
const DEFAULT_TAB_NAME = "Election Verification Site";

export function useElectionBranding() {
  const configStore = useConfigStore();

  const currentFaviconUrl = ref<string>("");

  const votingPortal = computed(
    () => configStore.electionStatus?.votingPortal,
  );

  const getTabName = (locale: SupportedLocale): string | null => {
    const tabNameTranslations = votingPortal.value?.tabName;
    if (!tabNameTranslations) return null;

    return (
      tabNameTranslations[locale] ??
      tabNameTranslations["en"] ??
      Object.values(tabNameTranslations)[0] ??
      null
    );
  };

  const getDefaultTabName = (locale: SupportedLocale): string | null => {
    const electionTitle = configStore.electionStatus?.title;
    if (!electionTitle) return null;

    return (
      electionTitle[locale] ??
      electionTitle["en"] ??
      Object.values(electionTitle)[0] ??
      null
    );
  };

  const updateDocumentTitle = (locale: SupportedLocale) => {
    const customTabName = getTabName(locale);
    const defaultTabName = getDefaultTabName(locale);

    document.title = customTabName ?? defaultTabName ?? DEFAULT_TAB_NAME;
  };

  const updateFavicon = () => {
    const customFaviconUrl = votingPortal.value?.faviconUrl;
    const faviconUrl = customFaviconUrl ?? DEFAULT_FAVICON_URL;

    if (currentFaviconUrl.value === faviconUrl) return;

    currentFaviconUrl.value = faviconUrl;

    const faviconLink =
      document.querySelector<HTMLLinkElement>("link[rel*='icon']") ??
      document.createElement("link");

    if (!faviconLink.parentElement) {
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }

    faviconLink.href = faviconUrl;
  };

  const resetBranding = () => {
    currentFaviconUrl.value = DEFAULT_FAVICON_URL;

    const faviconLink =
      document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (faviconLink) {
      faviconLink.href = DEFAULT_FAVICON_URL;
    }
  };

  watch(
    () => configStore.electionStatus,
    () => {
      if (configStore.electionStatus) {
        updateFavicon();
      }
    },
    { immediate: true },
  );

  return {
    updateDocumentTitle,
    updateFavicon,
    resetBranding,
    getTabName,
    currentFaviconUrl,
  };
}
