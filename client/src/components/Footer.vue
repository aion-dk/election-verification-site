<script lang="ts" setup>
import avlogo from "../assets/avlogo.png";
</script>

<template>
  <footer class="Footer">
    <div class="Footer__Info">
      <span class="Footer__Headline">{{ $t("footer.headline") }}</span>
      <span class="Footer__Text">{{ $t("footer.text") }}</span>
    </div>

    <a href="https://assemblyvoting.com" target="_blank">
      <img class="Footer__Image" :src="avlogo" alt="Assembly Voting Logo" />
    </a>
  </footer>
</template>

<style type="text/css" scoped>
.Footer {
  box-sizing: border-box;
  background-color: #0d1d46;
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 11rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 2rem;
  padding-right: 2rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
}

.Footer__Info {
  display: flex;
  flex-direction: column;
  max-width: 25rem;
}

.Footer__Headline {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.Footer__Text {
  color: white;
  font-size: 0.75rem;
}

.Footer__Image {
  max-height: 2.5rem;
}

@media only screen and (max-width: 768px) {
  .Footer {
    height: 3rem;
    justify-content: center;
  }

  .Footer__Image {
    max-height: 1.5rem;
  }

  .Footer__Info {
    display: none;
  }
}
</style>
