import { createWebHistory, createRouter } from "vue-router";
import Welcome from "../views/Welcome.vue";
import BallotTrackerView from "../views/BallotTrackerView.vue";
import BallotVerifierView from "../views/BallotVerifierView.vue";
import MissingSlugView from "../views/MissingSlugView.vue";
import BallotVerificationLanding from "../views/BallotVerificationLanding.vue";
import LogsView from "../views/LogsView.vue";
import HelpView from "../views/HelpView.vue";
import BallotTrackingLanding from "../views/BallotTrackingLanding.vue";

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
      name: "BallotTrackingLanding",
      path: "/:locale/:electionSlug/track",
      component: BallotTrackingLanding,
    },
    {
      name: "BallotTrackerView",
      path: "/:locale/:electionSlug/track/:trackingCode",
      component: BallotTrackerView,
    },
    {
      name: "BallotVerificationLanding",
      path: "/:locale/:electionSlug/verify",
      component: BallotVerificationLanding,
    },
    {
      name: "BallotVerifierView",
      path: "/:locale/:electionSlug/verify/:pairingCode",
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
  ],
});

export default router;
