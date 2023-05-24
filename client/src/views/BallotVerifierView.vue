<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";
import useLocaleStore from "../stores/useLocaleStore";
import router from "../router";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import useVerificationStore from "../stores/useVerificationStore";
import Timedown from "@/components/Timedown.vue";
import ContentLayout from "../components/ContentLayout.vue";
import MainIcon from "../components/MainIcon.vue";

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
    <Timedown
      v-if="!verificationStore.ballot"
      :maxSeconds="configStore.election.bcTimeout"
      :currentSeconds="configStore.election.bcTimeout"
      @timeout="
        () => {
          router.push({ name: 'Welcome' });
        }
      "
    />
    <ContentLayout
      :breadcrumb="$t('views.verification.title')"
      :help-title="$t('views.verifier.inprogress.help.title')"
      :help-title-strong="$t('views.verifier.inprogress.help.title_strong')"
    >
      <template v-slot:action>
        <div
          v-if="verificationStore.ballot"
          class="BallotVerifier__Spoiled"
        ></div>

        <div v-else class="BallotVerifier__InProgress">
          <MainIcon icon="asterisk" />
          <h3 class="BallotVerifier__Title">
            {{ $t("views.verifier.inprogress.title") }}
          </h3>
          <p class="BallotVerifier__Description">
            {{ $t("views.verifier.inprogress.description") }}
          </p>
          <code class="BallotVerifier__Code">{{
            verificationStore.pairingCode
          }}</code>
        </div>
      </template>
      <template v-slot:help></template>
    </ContentLayout>
  </div>

  <!-- <div class="BallotVerifier">
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
  </div> -->
</template>

<style type="text/css" scoped>
.BallotVerifier {
  width: 100%;
  height: 100%;
}

.BallotVerifier__InProgress {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.BallotVerifier__Title {
  text-align: center;
  color: var(--slate-800);
  margin: 0.5rem 0 1.5rem 0;
  font-weight: 800;
  text-align: center;
  font-size: 2.5rem;
}

.BallotVerifier__Description {
  margin: 0 0 1rem 0;
  line-height: 2rem;
  text-align: center;
  color: var(--slate-700);
}

.BallotVerifier__Code {
  font-size: 2.25rem;
  color: var(--slate-900);
  font-family: "Red Hat Mono", monospace;
  text-align: center;
  display: block;
  letter-spacing: 0.5rem;
  margin: 1rem 0 0 0;
}

@media only screen and (min-width: 80rem) and (min-height: 45rem) {
  .BallotVerifier__Title {
    font-size: 3.5rem;
    margin: 0 0 1rem 0;
    width: 100%;
    text-align: left;
  }

  .BallotVerifier__Description {
    text-align: left;
    width: 100%;
  }

  .BallotVerifier__Code {
    text-align: left;
    width: 100%;
    font-size: 4rem;
  }
}

/* .BallotVerifier {
  width: 100%;
  height: 100%;
  position: relative;
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
} */
</style>
