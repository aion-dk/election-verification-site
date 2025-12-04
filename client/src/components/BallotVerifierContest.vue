<template>
  <div class="BallotVerifierContest">
    <h3 class="BallotVerifierContest__Title">
      {{ contest.title[$i18n.locale] }}
    </h3>
    <p v-if="contest.question" v-text="contest.question[$i18n.locale]" />
    <div
      v-for="(selectionPile, pileIndex) in contestSelection.piles"
      :key="JSON.stringify(selectionPile)"
      class="BallotVerifierContest__Piles"
    >
      <AVPileSummary
        :contest="contest"
        :selection-pile="selectionPile"
        :pile-index="pileIndex"
        :total-piles="contestSelection.piles.length"
        :gallery-mode="contest.mode === 'gallery'"
        :show-options-description="contest.displayDescriptionOnSummary"
        style="z-index: 90"
        active-state="summary"
      />
    </div>
  </div>
</template>

<script lang="ts">
import useConfigStore from "@/stores/useConfigStore";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import type { ContestSelection } from "@assemblyvoting/js-client/dist/lib/av_client/types";
import type { FullContestContent } from "@/Types";

export default defineComponent({
  name: "BallotVerifierContest",
  props: {
    contestSelection: {
      type: Object as PropType<ContestSelection>,
      required: true,
    },
  },
  computed: {
    configStore() {
      return useConfigStore();
    },
    contest(): FullContestContent {
      return this.configStore.getContest(this.contestSelection.reference);
    },
  },
});
</script>

<style lang="scss">
.BallotVerifierContest__Title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--bs-gray-800);
  margin-bottom: 1rem;
  text-align: center;
}

.BallotVerifierContest__Title + p {
  margin-bottom: 1rem;
  font-weight: 600;
}

.BallotVerifierContest__Piles {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  z-index: 10;
}
</style>
