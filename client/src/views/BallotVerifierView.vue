<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";
import useLocaleStore from "../stores/useLocaleStore";
import CompactHeader from "../components/CompactHeader.vue";
import Infobox from "../components/Infobox.vue";
import router from "../router";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import useVerificationStore from "../stores/useVerificationStore";
import Timedown from "@/components/Timedown.vue";

const localeStore = useLocaleStore();
const configStore = useConfigStore();
const verificationStore = useVerificationStore();
const route = useRoute();

function cancel() {
  router.push(`/${route.params.locale}/${route.params.electionSlug}`);
}

function redirectUnlessPairingCode() {
  if (!verificationStore.pairingCode) cancel();
}

const parsedOption = (
  selection: any,
  contest: any,
  pile: any,
  index: number
) => {
  const isRanked =
    configStore.getContest(contest.reference).markingType.voteVariation ===
    "ranked";
  const optionImage =
    (
      configStore.getContestOption(
        contest.reference,
        selection.reference
      ) as any
    ).image || null;

  const option: any = {
    title: configStore.getContestOption(contest.reference, selection.reference)
      .title[localeStore.locale],
  };

  if (isRanked) option.rank = index + 1;
  if (optionImage) option.image = optionImage;

  return option;
};

onMounted(redirectUnlessPairingCode);
</script>

<template>
  <div class="BallotVerifier">
    <CompactHeader
      :election="configStore.election"
      :locale="localeStore.locale"
    />

    <Timedown
      v-if='!verificationStore.ballot'
      :maxSeconds="configStore.election.bcTimeout"
      :currentSeconds="configStore.election.bcTimeout"
      style='margin-bottom: 20px'
      @timeout="
        () => {
          router.push({ name: 'Welcome' });
        }
      "
    />

    <div v-if="verificationStore.ballot" class="BallotVerifier__Spoiled">
      <Infobox class="BallotVerifier__Infobox" id="infobox">
        <h2>{{ $t("views.verifier.spoiled.title") }}</h2>
        <p>{{ $t("views.verifier.spoiled.description") }}</p>
      </Infobox>
      <Infobox class="BallotVerifier__DecryptedVoteBox" id="decrypted_box">
        <div
          v-for="contest in verificationStore.ballot"
          :key="contest.reference"
          class="BallotVerifier__Contest"
        >
          <h3>
            {{ configStore.getContest(contest.reference).title[$i18n.locale] }}
          </h3>
          <div
            v-for="(pile, pIndex) in contest.piles"
            class="BallotVerifier__Pile"
            :key="pIndex"
          >
            <div class="BallotVerifier__PileMultiplier">
              x {{ pile.multiplier }}
            </div>
            <AVOption
              v-if="pile.optionSelections.length === 0"
              :key="`pile-${pIndex}-option-blank`"
              :option="{
                title: $t('views.verifier.blank_pile'),
              }"
              disabled
              checked
              displayMode
            />
            <AVOption
              v-else
              v-for="(selection, oIndex) in pile.optionSelections"
              :key="`pile-${pIndex}-option-${oIndex}`"
              :option="parsedOption(selection, contest, pile, oIndex)"
              disabled
              checked
              displayMode
            />
          </div>
        </div>
      </Infobox>
    </div>

    <div v-else class="BallotVerifier__InProgress">
      <h1 class="BallotVerifier__Title">
        {{ $t("views.verifier.inprogress.title") }}
      </h1>

      <p class="BallotVerifier__Info">
        {{ $t("views.verifier.inprogress.info") }}
      </p>

      <code class="BallotVerifier__Code">{{
        verificationStore.pairingCode
      }}</code>
    </div>
  </div>
</template>

<style type="text/css" scoped>
.BallotVerifier {
  font-family: "Open Sans";
}

.BallotVerifier__Title {
  font-size: 26px;
  text-align: center;
}

.BallotVerifier__Info {
  text-align: center;
}

.BallotVerifier__Code {
  font-size: 40px;
  font-family: "Red Hat Mono";
  text-align: center;
  display: block;
  letter-spacing: 5px;
}

.BallotVerifier__Infobox,
.BallotVerifier__DecryptedVoteBox {
  margin-bottom: 20px;
}

.BallotVerifier__Contest {
  margin-bottom: 40px;
}

.BallotVerifier__Pile {
  margin-bottom: 20px;
}

.BallotVerifier__Option {
  border: 1px solid #cccccc;
  padding: 20px;
}

.BallotVerifier__PileMultiplier {
  text-align: right;
  font-size: 20px;
  font-weight: bold;
  background: black;
  color: white;
  padding: 1px 20px;
}
</style>
