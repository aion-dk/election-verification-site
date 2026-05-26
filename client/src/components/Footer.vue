<script lang="ts" setup>
import useConfigStore from "@/stores/useConfigStore";
import type { CustomCosmetics } from "@/Types";
import avlogo from "../assets/avlogo.svg";
import DOMPurify from "dompurify";
import { computed } from "vue";
import { storeToRefs } from "pinia";

const configStore = useConfigStore();
const { electionStatus } = storeToRefs(configStore);

const customFooterHtml = computed(() => {
  const cosmetics = electionStatus.value?.cosmetics as CustomCosmetics | undefined;
  const raw = cosmetics?.footerHtml?.trim() || null;
  return raw ? DOMPurify.sanitize(raw) : null;
});

console.log(customFooterHtml);



</script>

<template>
  <footer id="base-footer" :class="customFooterHtml ? 'Footer Footer--custom Footer__Text' : 'Footer'">
    <div v-if="customFooterHtml" v-html="customFooterHtml" />
    <div v-else class="Footer__Content">
      <span class="Footer__Text">{{ $t("footer.powered_by") }}</span>
      <a href="https://www.lumiglobal.com/" target="_blank">
        <img
          class="Footer__Image"
          :src="avlogo"
          :alt="$t('footer.av_img_alt')"
          loading="lazy"
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
  height: 3rem;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  z-index: 90;
}

.Footer--custom {
  height: auto;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem;
}

.Footer__Content {
  display: flex;
  justify-content: center;
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
