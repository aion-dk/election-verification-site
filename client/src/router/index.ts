import {
  createWebHistory,
  createRouter,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from "vue-router";
import Welcome from "../views/Welcome.vue";
import BallotTrackerView from "../views/BallotTrackerView.vue";
import BallotVerifierView from "../views/BallotVerifierView.vue";
import BallotVerifierFoundView from "../views/BallotVerifierFoundView.vue";
import MissingSlugView from "../views/MissingSlugView.vue";
import LogsView from "../views/LogsView.vue";
import HelpView from "../views/HelpView.vue";
import ResultsView from "../views/ResultsView.vue";
import BallotUnifiedTracking from "../views/BallotUnifiedTracking.vue";
import ReceiptErrorView from "../views/ReceiptErrorView.vue";
import useConfigStore from "@/stores/useConfigStore";
import type { BasicElectionStatus } from "@/Types";
import axios from "axios";
import config from "@/lib/config";

const verifyGuard = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const configStore = useConfigStore();

  if (!configStore.electionStatus) {
    const organisationSlug = to.params.organisationSlug as string;
    const electionSlug = to.params.electionSlug as string;
    try {
      const response = await axios.get(
        `${config.conferenceUrl}/${organisationSlug}/${electionSlug}/status`,
      );
      const status = response.data?.election as BasicElectionStatus;
      if (status) {
        configStore.setElectionStatus(status);
        if (status.boardSlug) configStore.setBoardSlug(status.boardSlug);
      }
    } catch (err) {
      console.error("Failed to fetch election status in route guard:", err);
    }
  }

  if (configStore.electionStatus?.canadianChallenge) {
    next({
      name: "Welcome",
      params: {
        locale: to.params.locale,
        organisationSlug: to.params.organisationSlug,
        electionSlug: to.params.electionSlug,
      },
    });
  } else {
    next();
  }
};

const resultsGuard = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const configStore = useConfigStore();

  if (!configStore.resultsPublishedLoaded) {
    const organisationSlug = to.params.organisationSlug as string;
    const electionSlug = to.params.electionSlug as string;
    try {
      const response = await axios.get(
        `${config.conferenceUrl}/${organisationSlug}/${electionSlug}/results_published`,
      );
      configStore.setResultsPublished(response.data?.resultsPublished ?? false);
    } catch (err) {
      console.error("Failed to fetch results_published in route guard:", err);
    }
  }

  if (!configStore.resultsPublished) {
    next({
      name: "Welcome",
      params: {
        locale: to.params.locale,
        organisationSlug: to.params.organisationSlug,
        electionSlug: to.params.electionSlug,
      },
    });
  } else {
    next();
  }
};

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
      component: Welcome,
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
      path: "/:locale/:organisationSlug/:electionSlug/track/:ballotCode",
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
      beforeEnter: verifyGuard,
    },
    {
      name: "BallotVerifierFound",
      path: "/:locale/:organisationSlug/:electionSlug/verify/:verificationCode/found",
      component: BallotVerifierFoundView,
      beforeEnter: verifyGuard,
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
    {
      name: "ResultsView",
      path: "/:locale/:organisationSlug/:electionSlug/results",
      component: ResultsView,
      beforeEnter: resultsGuard,
    },
  ],
});

export default router;
