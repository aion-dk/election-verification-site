<script lang="ts" setup>
import useConfigStore from "@/stores/useConfigStore";
import type { CustomCosmetics } from "@/Types";
import avlogo from "../assets/avlogo.svg";
import DOMPurify from "dompurify";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const configStore = useConfigStore();
const { electionStatus } = storeToRefs(configStore);
const i18n = useI18n();

const customFooterHtml = computed(() => {
  const cosmetics = electionStatus.value?.cosmetics as
    | CustomCosmetics
    | undefined;
  const rawFooterHtml = cosmetics?.footerHtml;
  if (!rawFooterHtml) return null;

  let raw: string | null = null;
  if (typeof rawFooterHtml === "string") {
    raw = rawFooterHtml.trim() || null;
  } else if (typeof rawFooterHtml === "object") {
    const localeHtml =
      rawFooterHtml[i18n.locale.value] ??
      rawFooterHtml["en"] ??
      Object.values(rawFooterHtml)[0];
    raw = typeof localeHtml === "string" ? localeHtml.trim() || null : null;
  }

  if (!raw) return null;
  const sanitized = DOMPurify.sanitize(raw);
  const template = document.createElement("template");
  template.innerHTML = sanitized;
  template.content.querySelectorAll("a[target='_blank']").forEach((a) => {
    const existingRel = a.getAttribute("rel");
    const tokens = existingRel ? existingRel.split(/\s+/).filter(Boolean) : [];
    if (!tokens.includes("noopener")) tokens.push("noopener");
    if (!tokens.includes("noreferrer")) tokens.push("noreferrer");
    a.setAttribute("rel", tokens.join(" "));
  });
  return template.innerHTML;
});
</script>

<template>
  <footer
    id="base-footer"
    class="dark-blurry footer-padding-top pb-3"
    :class="customFooterHtml ? 'Footer Footer--custom' : 'Footer'"
  >
    <div
      v-if="customFooterHtml"
      v-html="customFooterHtml"
      id="footer-custom-content"
    />
    <div v-else class="Footer__Content" id="footer-content">
      <span class="Footer__Text" id="footer-powered-by">{{
        $t("footer.powered_by")
      }}</span>
      <a
        href="https://www.lumiglobal.com/"
        target="_blank"
        rel="noopener noreferrer"
        id="footer-av-link"
      >
        <img
          class="Footer__Image"
          :src="avlogo"
          :alt="$t('footer.av_img_alt')"
          loading="lazy"
          id="footer-av-logo"
        />
      </a>
    </div>
  </footer>
</template>

<style type="text/css" scoped>
.Footer {
  background: rgba(var(--bs-primary-rgb), 0.85);
  backdrop-filter: blur(4px);
  width: 100vw;
  height: 4rem;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  z-index: 90;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media only screen and (min-width: 48rem) {
  .Footer {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

.Footer--custom {
  height: auto;
  min-height: auto;
  align-items: flex-start;
  padding-top: 1rem;
  color: white;
}

.Footer__Content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.Footer__Text {
  color: white;
  font-size: 0.75rem;
  margin-right: 0.25rem;
}

.Footer__Image {
  max-height: 2rem;
  padding-top: 2px;
  height: auto;
}
</style>
