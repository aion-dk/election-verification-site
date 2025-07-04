<script lang="ts" setup>
import avlogo from "../assets/avlogo.svg";
</script>

<template>
  <footer class="Footer">
    <span class="Footer__Text">{{ $t("footer.powered_by") }}</span>
    <a href="https://www.lumiglobal.com/" target="_blank">
      <img
        class="Footer__Image"
        :src="avlogo"
        :alt="$t('footer.av_img_alt')"
        loading="lazy"
      />
    </a>
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
