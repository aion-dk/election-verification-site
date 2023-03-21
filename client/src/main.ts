import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VuePopper from "@kalimahapps/vue-popper";

import i18n from "./lib/i18n";
import {
  faFingerprint,
  faChevronRight,
  faChevronLeft,
  faClock,
  faUser,
  faPlus,
  faArrowUpRightFromSquare,
  faMinus,
  faDownload,
  faCircleInfo,
  faCircleQuestion,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

library.add(faFingerprint);
library.add(faClock);
library.add(faUser);
library.add(faPlus);
library.add(faMinus);
library.add(faDownload);
library.add(faCircleInfo);
library.add(faCircleQuestion);
library.add(faMagnifyingGlass);
library.add(faArrowUpRightFromSquare);
library.add(faChevronRight);
library.add(faChevronLeft);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.component("font-awesome-icon", FontAwesomeIcon);
// eslint-disable-next-line vue/multi-word-component-names
app.component("tooltip", VuePopper);

app.mount("#dbas-client");
