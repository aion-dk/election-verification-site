<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";
import useBallotStore from "../stores/useBallotStore";
import useLocaleStore from "../stores/useLocaleStore";
import { ref, computed, onMounted } from "vue";
import BallotActivityList from "../components/BallotActivityList.vue";
import ContentLayout from "../components/ContentLayout.vue";
import TrackedBallotManager from "../components/TrackedBallotManager.vue";
import router from "../router";
import type { Ballot } from "../Types";

const localeStore = useLocaleStore();
const configStore = useConfigStore();
const ballotStore = useBallotStore();
const ballot = ref<Ballot>(null);

const periodicedTrackingCode = computed(() => {
  return ballotStore.ballot?.trackingCode?.split("")?.join(". ");
});

const cancel = () => {
  router.push(`/${localeStore.locale}/${configStore.boardSlug}/track`);
};

onMounted(() => (ballot.value = ballotStore.ballot));
</script>

<template>
  <div class="BallotTracker" v-if="ballot" aria-flowto="tracking-code">
    <ContentLayout
      :help-title="$t('views.tracker.help.title')"
      :help-title-strong="$t('views.tracker.help.title_strong')"
      :breadcrumb="$t('views.tracker.title')"
      :logo="configStore.electionStatus?.theme?.logo"
    >
      <template v-slot:action>
        <TrackedBallotManager
          :tracking-code="ballot.trackingCode"
          :periodiced-tracking-code="periodicedTrackingCode"
          @cancel="cancel"
        />

        <h3 class="BallotTracker__Title">
          {{ $t("views.tracker.info.title") }}
        </h3>
        <p class="BallotTracker__Description">
          {{ $t("views.tracker.info.description") }}
        </p>
        <p class="BallotTracker__Description expand">
          {{ $t("views.tracker.info.extended_description") }}
        </p>

        <BallotActivityList
          v-if="ballot.activities.length"
          :activities="ballot.activities"
        />
      </template>

      <template v-slot:help>
        <div class="BallotTracker__Info">
          <p class="BallotTracker__Info_Title text-contrast">
            {{ $t("views.tracker.help.p1.title") }}
          </p>
          <p class="BallotTracker__Info_Text text-contrast">
            {{ $t("views.tracker.help.p1.text1") }}
          </p>
          <p class="BallotTracker__Info_Text text-contrast">
            {{ $t("views.tracker.help.p1.text2") }}
          </p>
        </div>

        <div class="BallotTracker__Info">
          <p class="BallotTracker__Info_Title_Small text-contrast">
            {{ $t("views.tracker.help.p2.title") }}
          </p>
          <p class="BallotTracker__Info_Text text-contrast">
            {{ $t("views.tracker.help.p2.text") }}
          </p>
        </div>
      </template>
    </ContentLayout>
  </div>
</template>

<style type="text/css" scoped>
.BallotTracker {
  width: 100vw;
  height: 100%;
}

.BallotTracker__Title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--slate-800);
  margin: 0 0 1rem 0;
  font-weight: 800;
}

.BallotTracker__Description {
  margin: 0 0 2rem 0;
  line-height: 2rem;
  color: var(--slate-700);
  text-align: center;
}

.BallotTracker__Description.expand {
  display: none;
}

.BallotTracker__Info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.BallotTracker__Info_Title {
  text-align: center;
  font-size: 1.6rem;
  font-weight: 600;
}

.BallotTracker__Info_Title_Small {
  font-size: 1.3rem;
  font-weight: 600;
}

@media only screen and (min-width: 48rem) {
  .BallotTracker__Description.expand {
    display: block;
    margin-bottom: 4rem;
  }
}

@media only screen and (min-width: 80rem) and (min-height: 45rem) {
  .BallotTracker__Description.expand {
    text-align: left;
  }

  .BallotTracker__Title {
    text-align: left;
    font-size: 3.5rem;
    margin-bottom: 2.5rem;
  }

  .BallotTracker__Description {
    text-align: left;
  }

  .BallotTracker__Info_Text {
    font-size: 1.2rem;
  }
}
</style>
