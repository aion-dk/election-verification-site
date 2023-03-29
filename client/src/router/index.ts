import { createWebHistory, createRouter } from "vue-router";
import Welcome from "../views/Welcome.vue";
import BallotTrackerView from "../views/BallotTrackerView.vue";
import BallotVerifierView from "../views/BallotVerifierView.vue";
import MissingSlugView from "../views/MissingSlugView.vue";
import LogsView from "../views/LogsView.vue";
import HelpView from "../views/HelpView.vue";
import AboutView from "../views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: () => "/en",
    },
    {
      path: "/:locale",
      component: MissingSlugView,
    },
    {
      name: "Welcome",
      path: "/:locale/:electionSlug",
      component: Welcome,
    },
    {
      name: "BallotTrackerView",
      path: "/:locale/:electionSlug/track/:trackingCode",
      component: BallotTrackerView,
    },
    {
      name: "BallotVerifierView",
      path: "/:locale/:electionSlug/verify/:verificationCode",
      component: BallotVerifierView,
    },
    {
      name: "LogsView",
      path: "/:locale/:electionSlug/logs",
      component: LogsView,
    },
    {
      path: "/:locale/:electionSlug/logs/:page",
      component: LogsView,
    },
    {
      name: "HelpView",
      path: "/:locale/:electionSlug/help",
      component: HelpView,
    },
    {
      name: "AboutView",
      path: "/:locale/:electionSlug/about",
      component: AboutView,
    },
  ],
});

export default router;
