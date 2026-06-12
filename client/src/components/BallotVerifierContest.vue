<template>
  <div
    class="BallotVerifierContest"
    :id="`ballot-verifier-contest-${contestSelection.reference}`"
  >
    <h3
      class="BallotVerifierContest__Title"
      :id="`contest-title-${contestSelection.reference}`"
    >
      {{ contestTitle }}
    </h3>
    <p
      v-if="contest.question"
      v-text="contestQuestion"
      :id="`contest-question-${contestSelection.reference}`"
    ></p>
    <div
      v-for="(selectionPile, pileIndex) in contestSelection.piles"
      :key="JSON.stringify(selectionPile)"
      class="BallotVerifierContest__Piles"
      :id="`contest-piles-${contestSelection.reference}-${pileIndex}`"
    >
      <AVPileSummary
        :contest="contest"
        :selection-pile="selectionPile"
        :pile-index="pileIndex"
        :total-piles="contestSelection.piles.length"
        style="z-index: 90"
        active-state="summary"
        :id="`contest-pile-summary-${contestSelection.reference}-${pileIndex}`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import useConfigStore from "@/stores/useConfigStore";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import type { ContestSelection, ContestContent, SupportedLocale } from "@/Types";

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
    contest(): ContestContent {
      return this.configStore.getContest(this.contestSelection.reference);
    },
    contestTitle(): string {
      return this.contest.title[this.$i18n.locale as SupportedLocale];
    },
    contestQuestion(): string | undefined {
      return this.contest.question?.[this.$i18n.locale as SupportedLocale];
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
