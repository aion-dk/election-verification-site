import { createWebHistory, createRouter } from "vue-router";
import Welcome from "../views/Welcome.vue";
import BallotTrackerView from "../views/BallotTrackerView.vue";
import BallotVerifierView from "../views/BallotVerifierView.vue";
import BallotVerifierFoundView from "../views/BallotVerifierFoundView.vue";
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
      path: "/:locale/:organisationSlug/:electionSlug",
      component: Welcome,
    },
    {
      name: "BallotTrackingLanding",
      path: "/:locale/:organisationSlug/:electionSlug/track",
      component: BallotTrackingLanding,
    },
    {
      name: "BallotTrackerView",
      path: "/:locale/:organisationSlug/:electionSlug/track/:trackingCode",
      component: BallotTrackerView,
    },
    {
      name: "BallotVerificationLanding",
      path: "/:locale/:organisationSlug/:electionSlug/verify",
      component: BallotVerificationLanding,
    },
    {
      name: "BallotVerifierView",
      path: "/:locale/:organisationSlug/:electionSlug/verify/:pairingCode",
      component: BallotVerifierView,
    },
    {
      name: "BallotVerifierFound",
      path: "/:locale/:organisationSlug/:electionSlug/verify/:verificationCode/found",
      component: BallotVerifierFoundView,
    },
    {
      name: "LogsView",
      path: "/:locale/:organisationSlug/:electionSlug/logs",
      component: LogsView,
    },
    {
      path: "/:locale/:organisationSlug/:electionSlug/logs/:page",
      component: LogsView,
    },
    {
      name: "HelpView",
      path: "/:locale/:organisationSlug/:electionSlug/help",
      component: HelpView,
    },
  ],
});

export default router;
