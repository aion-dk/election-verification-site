import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "./lib/i18n";
import * as UILibrary from "@assemblyvoting/ui-library";
import "@assemblyvoting/ui-library/styles";

// @ts-ignore
import VuePopper from "@kalimahapps/vue-popper";

const app = createApp(App);

app.use(UILibrary.default);
app.use(createPinia());
app.use(router);
app.use(i18n);

app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

app.component("tooltip", VuePopper);

router.isReady().then(() => {
  app.mount("#dbas-client");
});
