import { resolve } from "path";
import { existsSync, watchFile } from "node:fs";

import { defineConfig, type Plugin, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";

// In devbox electa-ui's built dist is a macOS Docker bind mount living under
// node_modules, rebuilt live by the ui-library service. Vite's watcher ignores
// node_modules, and the usual `server.watch.ignored` un-ignore glob is NOT honored by
// chokidar 5 (the version resolved here; conference happens to resolve chokidar 4 where
// it does work), so rebuilds were never detected and the dev server kept serving stale,
// cached transforms even on a manual refresh. This devbox-only plugin polls the dist
// files with Node's native watchFile (polling works across the bind mount) and feeds
// changes into Vite's own watcher, so it invalidates the module and reloads exactly like
// a first-party source edit.
function electaUiLiveReload(): Plugin {
  const distDir = resolve("node_modules/@assemblyvoting/electa-ui/dist");
  return {
    name: "devbox:electa-ui-live-reload",
    apply: "serve",
    configureServer(server) {
      for (const file of [`${distDir}/index.js`, `${distDir}/styles.css`]) {
        watchFile(file, { interval: 300 }, () =>
          server.watcher.emit("change", file),
        );
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // The devbox dev environment mounts the shared library sources as siblings of this
  // app (read-only). We use the js-client mount as the signal that we're inside
  // devbox. electa-ui's built dist is bind-mounted live into node_modules and rebuilt
  // by the ui-library service (vite build --watch), so the wiring below lets Vite HMR
  // it instead of freezing it in a prebundle. js-client/types are copied into
  // node_modules by the entrypoint and need no special wiring. Outside devbox none of
  // this applies and everything resolves from node_modules like production.
  const inDevbox =
    command === "serve" && existsSync(resolve("js-client/lib/av_client.ts"));

  return {
    // evs resolves a second copy of vite nested under @vitejs/plugin-vue, so vue()'s
    // Plugin type and our plugin's Plugin type have different identities; the cast
    // reconciles them (a dev-only config concern).
    plugins: [vue(), inDevbox && electaUiLiveReload()].filter(
      Boolean,
    ) as PluginOption[],
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
    },
    resolve: {
      alias: {
        "@": resolve("src"),
        vue: resolve("node_modules/vue"),
        bootstrap: resolve(
          "node_modules/@assemblyvoting/electa-ui/dist/src/bootstrap",
        ),
      },
    },
    optimizeDeps: {
      // In devbox electa-ui's dist is live-mounted, so exclude it from prebundling to
      // let it hot-reload instead of being frozen in a prebundle at server start.
      exclude: inDevbox ? ["@assemblyvoting/electa-ui"] : [],
    },
    server: {
      port: 3010,
      // electa-ui's dist is a macOS Docker bind mount, across which inotify fs events
      // do NOT propagate, so Vite's default watcher never sees changes. Polling makes
      // Vite re-stat app source files. electa-ui (under node_modules, which Vite always
      // ignores) is handled separately by the electaUiLiveReload plugin above.
      watch: inDevbox
        ? {
            usePolling: true,
            interval: 300,
          }
        : undefined,
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: [
            "color-functions",
            "global-builtin",
            "import",
            "abs-percent",
            "if-function",
          ],
        },
      },
    },
  };
});
