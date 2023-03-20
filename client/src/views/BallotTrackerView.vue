<script setup lang="ts">
import useElectionStore from "../stores/useElectionStore";
import useBallotStore from "../stores/useBallotStore";
import useLocaleStore from "../stores/useLocaleStore";
import CompactHeader from "../components/CompactHeader.vue";
import Infobox from "../components/Infobox.vue";
import { ref, watch, computed, onMounted } from "vue";
import BallotActivityList from "../components/BallotActivityList.vue";
import router from "../router";
import { useRoute } from "vue-router";
import type { Ballot } from "../Types";

const route = useRoute();
const localeStore = useLocaleStore();
const electionStore = useElectionStore();
const ballotStore = useBallotStore();
const ballot = ref<Ballot>(null);
const periodicedTrackingCode = computed(() => {
  return ballotStore.ballot?.trackingCode?.split("")?.join(". ");
});

watch(ballotStore, () => setBallot());
watch(route, () => setBallot());

function setBallot() {
  ballot.value = ballotStore.ballot;
}

function cancel() {
  router.push(`/${localeStore.locale}/${electionStore.election.slug}`);
}

onMounted(() => setBallot());
</script>

<template>
  <div class="BallotTracker" v-if="ballot" aria-flowto="tracking-code">
    <CompactHeader
      :election="electionStore.election"
      :locale="localeStore.locale"
    />

    <div class="BallotTracker__Row">
      <Infobox class="BallotTracker__Infobox" id="infobox">
        <h2>{{ $t("views.tracker.info.title") }}</h2>
        <p>{{ $t("views.tracker.info.description") }}</p>
      </Infobox>

      <Infobox class="BallotTracker__TrackingCode" role="alertdialog">
        <h3 role="alert" id="tracking-code" aria-flowto="infobox">
          <span>{{ $t("views.tracker.currently_tracking") }}</span>
          <code :aria-label="periodicedTrackingCode">
            {{ ballot.trackingCode }}
          </code>
        </h3>
        <button
          class="BallotTracker__Cancel"
          @click="cancel"
          data-testid="cancel"
          :aria-label="
            $t('views.tracker.cancel_cross_label', {
              trackingCode: ballot.trackingCode,
            })
          "
        >
          ×
        </button>
      </Infobox>
    </div>

    <div class="BallotTracker__Row">
      <Infobox class="BallotTracker__StatusInfo">
        <h3>{{ $t(`views.tracker.status_map.${ballot.status}.title`) }}</h3>
        <p>{{ $t(`views.tracker.status_map.${ballot.status}.description`) }}</p>
      </Infobox>
    </div>

    <div
      class="BallotTracker__Row BallotTracker__Row--stacked"
      v-if="ballot.activities.length"
    >
      <BallotActivityList :activities="ballot.activities" />
    </div>
  </div>
</template>

<style type="text/css" scoped>
.BallotTracker {
  font-family: "Open Sans";
}

.BallotTracker__Row {
  display: flex;
  margin-bottom: 40px;
}

.BallotTracker__Row--stacked {
  flex-direction: column;
}

.BallotTracker__TrackingCode {
  margin-left: 40px;
  flex-grow: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.BallotTracker__Infobox {
  max-width: 350px;
}

.BallotTracker__TrackingCode h3 {
  padding: 0;
  margin: 0;
}

.BallotTracker__TrackingCode code {
  font-size: 40px;
  font-family: "Red Hat Mono";
  letter-spacing: 5px;
}

.BallotTracker__TrackingCode h3 span {
  color: #6c757d;
  font-weight: 600;
  display: block;
  margin-bottom: 20px;
}

.BallotTracker__StatusInfo {
  width: 100%;
}

.BallotTracker__StatusInfo h3 {
  font-size: 24px;
}

.BallotTracker__Cancel {
  border: none;
  background: transparent;
  position: absolute;
  top: 0;
  right: 8px;
  font-size: 40px;
  cursor: pointer;
  color: #adb5bd;
}
</style>
