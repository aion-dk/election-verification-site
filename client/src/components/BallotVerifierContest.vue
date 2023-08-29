<template>
  <div class="BallotVerifierContest">
    <h3 class="BallotVerifierContest__Title">
      {{ contest.title[$i18n.locale] }}
    </h3>
    <p v-if="contest.question" v-text="contest.question[$i18n.locale]" />
    <div
      v-for="(pile, pIndex) in contestSelection.piles"
      class="BallotVerifierContest__Pile"
      :key="pIndex"
    >
      <div class="BallotVerifierContest__Header">
        <span>
          {{
            `${$t("views.verifier.spoiled.ballot_selection")} ${pIndex + 1}/${
              contestSelection.piles.length
            }`
          }}
        </span>
        <strong>
          <span>{{
            `${$t("views.verifier.spoiled.assigned")} ${pile.multiplier}`
          }}</span>
        </strong>
      </div>
      <div class="BallotVerifierContest__Options">
        <div
          v-if="pile.optionSelections.length === 0"
          class="BallotVerifierContest__Option"
        >
          <div class="BallotVerifierContest__Option_Title">
            {{ $t("views.verifier.blank_pile") }}
          </div>
          <OptionCheckbox class="BallotVerifierContest__Option_Cross" />
        </div>
        <div
          class="BallotVerifierContest__Option"
          v-else
          v-for="(parsedOption, oIndex) in parseOptions(pile)"
          :key="`pile-${pIndex}-option-${oIndex}`"
        >
          <img
            class="BallotVerifierContest__Option_Image"
            :src="parsedOption.image"
            v-if="parsedOption.image"
          />
          <div class="BallotVerifierContest__Option_Title">
            {{ parsedOption.title }}
          </div>
          <OptionCheckbox
            v-if="!isMultipleCrossesPerVote"
            :rank="parsedOption.rank"
            class="BallotVerifierContest__Option_Cross"
          />
          <div class="BallotVerifierContest__Option_Crosses" v-else>
            <OptionCheckbox
              v-for="(_, i) in parsedOption.count"
              :key="`cross-${i}`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import useConfigStore from "@/stores/useConfigStore";
import OptionCheckbox from "@/components/OptionCheckbox.vue";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import type {
  ContestSelection,
  SelectionPile,
} from "@aion-dk/js-client/dist/lib/av_client/types";
import type { FullContestContent } from "@/Types";

export default defineComponent({
  name: "BallotVerifierContest",
  components: { OptionCheckbox },
  props: {
    contestSelection: {
      type: Object as PropType<ContestSelection>,
      required: true,
    },
    index: {
      type: Number,
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
    isRanked() {
      return this.contest.markingType.voteVariation === "ranked";
    },
    isMultipleCrossesPerVote() {
      return (
        1 <
        (this.contest.markingType.votesAllowedPerOption ||
          this.contest.votesAllowedPerOption ||
          1)
      );
    },
  },
  methods: {
    parseOptions(pile: SelectionPile) {
      let talliedReferences = pile.optionSelections.reduce(
        (tally: any, option) => {
          tally[option.reference] = 1 + (tally[option.reference] || 0);

          return tally;
        },
        {}
      );
      return Object.entries(talliedReferences).map(
        ([optionReference, count], index) => {
          const optionContent = this.configStore.getContestOption(
            this.contest.reference,
            optionReference
          );

          return {
            title: optionContent.title[this.$i18n.locale],
            count: count,
            rank: this.isRanked ? index + 1 : 0,
            image: optionContent.image,
          };
        }
      );
    },
  },
});
</script>

<style lang="scss">
.BallotVerifierContest__Title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--slate-800);
  margin-bottom: 1rem;
  text-align: center;
}

.BallotVerifierContest__Title + p {
  margin-bottom: 1rem;
  font-weight: 600;
}

.BallotVerifierContest__Pile {
  margin-bottom: 1rem;
  position: relative;
  z-index: 10;
}

.BallotVerifierContest__Header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  margin: 0;
  background-color: var(--slate-200);
}

.BallotVerifierContest__Options {
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: 1fr;
  gap: 1rem;
  &:not(:first-child) {
    border: 1px solid var(--slate-200);
    padding: 1rem;
  }
}

.BallotVerifierContest__Option {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-areas: "image title cross" "crosses crosses crosses";
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr auto;
  border: 1px #dddddd solid;
  background-color: white;
  align-items: center;
}

.BallotVerifierContest__Option_Image {
  grid-area: image;
  height: 4rem;
  margin: 1rem;
}

.BallotVerifierContest__Option_Title {
  grid-area: title;
  align-self: center;
  font-size: 1.25rem;
  margin: 1rem;
  &:not(:first-child) {
    margin-left: 0;
  }
}

.BallotVerifierContest__Title + p {
  margin-bottom: 1rem;
  font-weight: 600;
}

.BallotVerifierContest__Option_Cross {
  grid-area: cross;
  margin: 1rem;
}
.BallotVerifierContest__Option_Crosses {
  grid-area: crosses;
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: #dddddd 1px solid;
  direction: rtl;
  display: grid;
  grid-template-columns: repeat(auto-fit, 30px);
  gap: 0.5rem;
}
</style>
