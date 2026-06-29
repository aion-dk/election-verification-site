import { createWebHistory, createRouter } from "vue-router";
import BallotTrackerView from "../views/BallotTrackerView.vue";
import BallotVerifierView from "../views/BallotVerifierView.vue";
import BallotVerifierFoundView from "../views/BallotVerifierFoundView.vue";
import MissingSlugView from "../views/MissingSlugView.vue";
import LogsView from "../views/LogsView.vue";
import HelpView from "../views/HelpView.vue";
import BallotUnifiedTracking from "../views/BallotUnifiedTracking.vue";
import ReceiptErrorView from "../views/ReceiptErrorView.vue";

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
    // Keep for backwards compatibility
    {
      name: "Welcome",
      path: "/:locale/:organisationSlug/:electionSlug",
      redirect: (to) => ({
        name: "BallotFinder",
        params: {
          locale: to.params.locale,
          organisationSlug: to.params.organisationSlug,
          electionSlug: to.params.electionSlug,
        },
      }),
    },
    {
      name: "BallotFinder",
      path: "/:locale/:organisationSlug/:electionSlug/find",
      component: BallotUnifiedTracking,
    },
    // Keep for backwards compatibility
    {
      name: "BallotTrackingLanding",
      path: "/:locale/:organisationSlug/:electionSlug/track",
      redirect: (to) => ({
        name: "BallotFinder",
        params: {
          locale: to.params.locale,
          organisationSlug: to.params.organisationSlug,
          electionSlug: to.params.electionSlug,
        },
      }),
    },
    {
      name: "BallotTrackerView",
      path: "/:locale/:organisationSlug/:electionSlug/track/:trackingCode",
      component: BallotTrackerView,
    },
    {
      name: "ReceiptErrorView",
      path: "/:locale/:organisationSlug/:electionSlug/receipt_error",
      component: ReceiptErrorView,
    },
    // Keep for backwards compatibility
    {
      name: "BallotVerificationLanding",
      path: "/:locale/:organisationSlug/:electionSlug/verify",
      redirect: (to) => ({
        name: "BallotFinder",
        params: {
          locale: to.params.locale,
          organisationSlug: to.params.organisationSlug,
          electionSlug: to.params.electionSlug,
        },
      }),
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
