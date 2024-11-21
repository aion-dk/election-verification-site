import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "./lib/i18n";
import * as UILibrary from "@assemblyvoting/ui-library";
import "@assemblyvoting/ui-library/styles";

const app = createApp(App);

app.use(UILibrary.default, i18n);
app.use(createPinia());
app.use(router);
app.use(i18n);

app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

router.isReady().then(() => {
  app.mount("#dbas-client");
});
