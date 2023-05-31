<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";
import useLocaleStore from "../stores/useLocaleStore";
import router from "../router";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import useVerificationStore from "../stores/useVerificationStore";
import Timedown from "@/components/Timedown.vue";
import ContentLayout from "../components/ContentLayout.vue";
import MainIcon from "../components/MainIcon.vue";

const localeStore = useLocaleStore();
const configStore = useConfigStore();
const verificationStore = useVerificationStore();
const route = useRoute();
const showAlert = ref<boolean>(false);
const showModal = ref<boolean>(false);

const redirectUnlessPairingCode = () => {
  if (!verificationStore.pairingCode) cancel();
};

const setModal = () => {
  showModal.value = true;
};
const setAlert = () => {
  showAlert.value = true;
};
const restart = () => {
  router.push({ name: "Welcome" });
};
const cancel = () => {
  router.push(`/${route.params.locale}/${route.params.electionSlug}`);
};

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
      @alert="setAlert"
      @timeout="setModal"
    />
    <ContentLayout
      :breadcrumb="$t('views.verification.title')"
      :help-title="$t('views.verifier.inprogress.help.title')"
      :help-title-strong="$t('views.verifier.inprogress.help.title_strong')"
      :logo="configStore.electionStatus?.theme?.logo"
    >
      <template v-slot:action>
        <div v-if="verificationStore.ballot" class="BallotVerifier__Content">
          <MainIcon icon="spell-check" />
          <h3 class="BallotVerifier__Title_Secondary">
            {{ $t("views.verifier.spoiled.title") }}
          </h3>
          <p class="BallotVerifier__Title">
            {{ $t("views.verifier.spoiled.description") }}
          </p>
          <p class="BallotVerifier__Description">
            {{ $t("views.verifier.spoiled.info") }}
          </p>

          <div
            v-for="(contest, index) in verificationStore.ballot"
            :key="contest.reference"
            class="BallotVerifier__Contest"
          >
            <h3 class="BallotVerifier__Contest_Title">
              {{ index + 1 }}.
              {{
                configStore.getContest(contest.reference).title[$i18n.locale]
              }}
            </h3>
            <div
              v-for="(pile, pIndex) in contest.piles"
              class="BallotVerifier___Contest_Pile"
              :key="pIndex"
            >
              <div
                v-if="pile.multiplier > 1"
                class="BallotVerifier__Contest_Header"
              >
                <span
                  ><strong
                    >{{ $t("views.verifier.spoiled.ballot_selection") }}
                    {{ pIndex + 1 }}</strong
                  ></span
                >
                <span
                  >{{ $t("views.verifier.spoiled.assigned") }}
                  {{ pile.multiplier }}</span
                >
              </div>
              <div class="BallotVerifier__Contest_Options">
                <p v-if="pile.optionSelections.length === 0">
                  {{ $t("views.verifier.blank_pile") }}
                </p>
                <p
                  v-else
                  v-for="(selection, oIndex) in pile.optionSelections"
                  :key="`pile-${pIndex}-option-${oIndex}`"
                >
                  <span
                    v-if="parsedOption(selection, contest, pile, oIndex).rank"
                    >{{ parsedOption(selection, contest, pile, oIndex).rank }}:
                  </span>
                  {{ parsedOption(selection, contest, pile, oIndex).title }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="BallotVerifier__Content">
          <MainIcon icon="asterisk" />
          <h3 class="BallotVerifier__Title">
            {{ $t("views.verifier.inprogress.title") }}
          </h3>

          <div v-if="showAlert" class="BallotVerifier__Alert" role="alert">
            <AVIcon
              icon="triangle-exclamation"
              class="BallotVerifier__Alert_Icon"
            />
            <div>
              <span class="BallotVerifier__Alert_Title">{{
                $t("components.timedown.alert.title")
              }}</span>
              <span class="BallotVerifier__Alert_Text">{{
                $t("components.timedown.alert.text")
              }}</span>
            </div>
          </div>

          <p class="BallotVerifier__Description">
            {{ $t("views.verifier.inprogress.description") }}
          </p>
          <code class="BallotVerifier__Code">{{
            verificationStore.pairingCode
          }}</code>
          <p class="BallotVerifier__Secondary_Description">
            {{ $t("views.verifier.inprogress.secondary_description") }}
          </p>
        </div>
      </template>
      <template v-slot:help>
        <div v-if="verificationStore.ballot">
          <AVIcon
            icon="rectangle-list"
            class="BallotVerifier__Help_Icon text-contrast"
          />
          <h3 class="BallotVerifier__Help_Title text-contrast">
            {{ $t("views.verifier.inprogress.help.p1.title") }}
          </h3>
          <p class="BallotVerifier__Help_Description text-contrast">
            {{ $t("views.verifier.inprogress.help.p1.description") }}
          </p>
        </div>

        <div v-else>
          <AVIcon
            icon="rectangle-list"
            class="BallotVerifier__Help_Icon text-contrast"
          />
          <h3 class="BallotVerifier__Help_Title text-contrast">
            {{ $t("views.verifier.inprogress.help.p1.title") }}
          </h3>
          <p class="BallotVerifier__Help_Description text-contrast">
            {{ $t("views.verifier.inprogress.help.p1.description") }}
          </p>
        </div>
      </template>
    </ContentLayout>

    <AVModal
      v-if="showModal"
      :aria-labelled-by="$t('views.verifier.inprogress.modal.labelled_by')"
      modal-active
      class="Modal__Overrides"
    >
      <div class="Modal__Inner">
        <AVIcon icon="clock-rotate-left" class="Modal__Icon" />
        <h6 class="Modal__Title">
          {{ $t("views.verifier.inprogress.modal.title") }}
        </h6>
        <p class="Modal__Text">
          {{ $t("views.verifier.inprogress.modal.description") }}
        </p>
        <AVButton
          :label="$t('views.verifier.inprogress.modal.button')"
          type="neutral"
          name="restart-process"
          id="restart-process"
          fullWidth
          @click="restart"
          class="Modal__Button_Overrides"
        />
      </div>
    </AVModal>
  </div>
</template>

<style type="text/css" scoped>
.BallotVerifier {
  width: 100%;
  height: 100%;
}

.BallotVerifier__Content {
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

.BallotVerifier__Title_Secondary {
  display: none;
}

.BallotVerifier__Description {
  margin: 0 0 1rem 0;
  text-align: center;
  color: var(--slate-700);
}

.BallotVerifier__Secondary_Description {
  margin: 2rem 0 1rem 0;
  text-align: center;
  color: var(--slate-700);
}

.BallotVerifier__Code {
  font-size: 2.25rem;
  color: var(--slate-900);
  font-family: "SFMono-Regular", "Menlo", "Monaco", "Consolas",
    "Liberation Mono", "Courier New", monospace;
  text-align: center;
  display: block;
  letter-spacing: 0.5rem;
  margin: 1rem 0 0 0;
}

.BallotVerifier__Help_Icon {
  width: 2rem;
  height: 2rem;
}

.BallotVerifier__Help_Title {
  text-align: center;
  font-size: 1.6rem;
}

.BallotVerifier__Help_Description {
  margin: 0;
}

.BallotVerifier__Alert {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px black solid;
  padding: 1rem;
  margin: 0 0 1rem 0;
  background-color: white;
  z-index: 10;
}

.BallotVerifier__Alert_Icon {
  margin: 0 0 1rem 0;
}

.BallotVerifier__Alert_Title {
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  display: block;
  text-align: center;
}

.BallotVerifier__Alert_Text {
  display: block;
  text-align: center;
}

.Modal__Overrides {
  padding: 0 1rem !important;
}

.Modal__Inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.Modal__Icon {
  color: var(--slate-800);
  height: 3rem;
  width: 3rem;
}

.Modal__Title {
  font-size: 1.625rem;
  color: var(--slate-700);
  margin: 1rem 0;
  font-weight: 600;
  text-align: center;
}

.Modal__Text {
  color: var(--slate-700);
  margin: 1rem 0 2rem 0;
  text-align: center;
}

.Modal__Button_Overrides {
  border-color: var(--av-theme-background) !important;
  background-color: var(--av-theme-background) !important;
}

.BallotVerifier__Contest {
  width: 100%;
  z-index: 10;
}

.BallotVerifier__Contest_Title {
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--slate-800);
}

.BallotVerifier___Contest_Pile {
  border: solid 1px var(--slate-200);
  background-color: white;
  margin: 0 0 1rem 0;
}

.BallotVerifier___Contest_Pile:last-of-type {
  margin: 0;
}

.BallotVerifier__Contest_Header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  margin: 0;
  background-color: var(--slate-200);
}

.BallotVerifier__Contest_Options {
  padding: 0.5rem;
}

.BallotVerifier__Contest_Options > p {
  margin: 0;
}

@media only screen and (min-width: 48rem) {
  .BallotVerifier__Alert {
    flex-direction: row;
  }

  .BallotVerifier__Alert_Icon {
    margin: 0 1rem 0 0;
  }

  .BallotVerifier__Alert_Title {
    text-align: left;
  }

  .BallotVerifier__Alert_Text {
    text-align: left;
  }

  .Modal__Inner {
    width: 28rem;
  }
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

  .BallotVerifier__Secondary_Description {
    text-align: left;
    width: 100%;
  }

  .BallotVerifier__Code {
    text-align: left;
    width: 100%;
    font-size: 4rem;
  }

  .BallotVerifier__Alert {
    margin: 1rem 0 3rem 0;
  }

  .BallotVerifier__Contest_Options {
    padding: 1rem 1.5rem;
  }

  .BallotVerifier__Help_Description {
    font-size: 1.2rem;
  }
}
</style>
