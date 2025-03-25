import { resolve } from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
  },
  resolve: {
    alias: {
      "@": resolve("src"),
      vue: resolve("node_modules/vue"),
      bootstrap: resolve("node_modules/@assemblyvoting/electa-ui/dist/src/bootstrap"),
    },
  },
  server: {
    port: 3010,
  },
});
