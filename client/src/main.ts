import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "./lib/i18n";
import * as UILibrary from "@assemblyvoting/ui-library";
import "@assemblyvoting/ui-library/styles";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

// eslint-disable-next-line vue/multi-word-component-names
app.component("tooltip", VuePopper);

router.isReady().then(() => {
  app.mount("#dbas-client");
});
