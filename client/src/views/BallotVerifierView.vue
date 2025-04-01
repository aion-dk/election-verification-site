<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";
import router from "../router";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import useVerificationStore from "../stores/useVerificationStore";
import Timedown from "@/components/Timedown.vue";
import ContentLayout from "@/components/ContentLayout.vue";
import MainIcon from "@/components/MainIcon.vue";
import BallotVerifierContest from "@/components/BallotVerifierContest.vue";
import { Modal } from "@assemblyvoting/electa-ui";

const configStore = useConfigStore();
const verificationStore = useVerificationStore();
const route = useRoute();
const showAlert = ref<boolean>(false);
const modal = ref<any>(null);

const redirectUnlessPairingCode = () => {
  if (!verificationStore.pairingCode) cancel();
};

const setModal = () => {
  modal.value.show();
};

const setAlert = () => {
  showAlert.value = true;
};

const restart = () => {
  modal.value.hide();
  router.push({ name: "Welcome" });
};

const cancel = () => {
  router.push(
    `/${route.params.locale}/${route.params.organisationSlug}/${route.params.electionSlug}`,
  );
};

onMounted(() => {
  redirectUnlessPairingCode();
  modal.value = new Modal("#expiredModal");
});
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

          <BallotVerifierContest
            v-for="(contestSelection, index) in verificationStore.ballot"
            :key="contestSelection.reference"
            :contest-selection="contestSelection"
            :index="index"
          />

          <button
            class="btn btn-theme w-100 rounded-3 BallotVerifier__Button"
            type="button"
            name="finish-session"
            id="finish-session"
            @click="restart"
          >
            {{ $t("views.verifier.spoiled.finish") }}
          </button>
        </div>

        <div v-else class="BallotVerifier__Content">
          <MainIcon icon="asterisk" />
          <h3 class="BallotVerifier__Title BallotVerifier__Title_Passkey">
            {{ $t("views.verifier.inprogress.title") }}
          </h3>

          <div v-if="showAlert" class="BallotVerifier__Alert" role="alert">
            <AVIcon
              icon="triangle-exclamation"
              class="BallotVerifier__Alert_Icon"
              aria-hidden="true"
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
            icon="check"
            class="BallotVerifier__Help_Icon text-contrast"
            aria-hidden="true"
          />
          <h3 class="BallotVerifier__Help_Title text-contrast">
            {{ $t("views.verifier.spoiled.help.p1.title") }}
          </h3>
          <p class="BallotVerifier__Help_Description text-contrast">
            {{ $t("views.verifier.spoiled.help.p1.description") }}
          </p>
        </div>

        <div v-else>
          <AVIcon
            icon="rectangle-list"
            class="BallotVerifier__Help_Icon text-contrast"
            aria-hidden="true"
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

    <div
      class="modal fade"
      id="expiredModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="expiredModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body vstack align-items-center pt-5 pb-3">
            <AVIcon icon="clock-rotate-left" class="Modal__Icon" />
            <h6 id="expiredModalLabel" class="Modal__Title">
              {{ $t("views.verifier.inprogress.modal.title") }}
            </h6>
            <p class="Modal__Text">
              {{ $t("views.verifier.inprogress.modal.description") }}
            </p>
            <button
              class="btn btn-theme w-100 rounded-3"
              type="button"
              name="restart-process"
              id="restart-process"
              @click="restart"
            >
              {{ $t("views.verifier.inprogress.modal.button") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.BallotVerifier {
  width: 100%;
  height: 100%;
  position: relative;
}

.BallotVerifier__Content {
  display: flex;
  flex-direction: column;
}

.BallotVerifier__Title {
  text-align: center;
  color: var(--gray-800);
  margin: 0.5rem 0 1.5rem 0;
  font-weight: 800;
  font-size: 2.5rem;
}

.BallotVerifier__Title_Passkey {
  font-weight: 600 !important;
}

.BallotVerifier__Title_Secondary {
  display: none;
}

.BallotVerifier__Description {
  margin: 0 0 1rem 0;
  text-align: center;
  color: var(--gray-700);
}

.BallotVerifier__Secondary_Description {
  margin: 2rem 0 1rem 0;
  text-align: center;
  color: var(--gray-700);
}

.BallotVerifier__Code {
  font-size: 2.25rem;
  color: var(--gray-900);
  font-family:
    "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono",
    "Courier New", monospace;
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

.Modal__Icon {
  color: var(--gray-800);
  height: 3rem;
  width: 3rem;
}

.Modal__Title {
  font-size: 1.625rem;
  color: var(--gray-700);
  margin: 1rem 0;
  font-weight: 600;
  text-align: center;
}

.Modal__Text {
  color: var(--gray-700);
  margin: 1rem 0 2rem 0;
  text-align: center;
}

.BallotVerifier__Contest_Title + p {
  margin-bottom: 1rem;
  font-weight: 600;
}

.BallotVerifier__Contest_Options > p {
  margin: 0;
}

.BallotVerifier__Button {
  margin: 2rem 0 0 0 !important;
}

@media only screen and (min-width: 48rem) {
  .BallotVerifier__Title_Secondary {
    display: block;
    color: var(--gray-700);
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    text-align: center;
  }

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

  .BallotVerifier__Button {
    margin-top: 3rem !important;
  }
}

@media only screen and (min-width: 80rem) {
  .BallotVerifier__Title {
    font-size: 3.5rem;
    margin: 0 0 1rem 0;
    width: 100%;
    font-weight: 800;
  }

  html[dir="ltr"] .BallotVerifier__Title,
  html[dir="ltr"] .BallotVerifier__Title_Secondary,
  html[dir="ltr"] .BallotVerifier__Description,
  html[dir="ltr"] .BallotVerifier__Secondary_Description,
  html[dir="ltr"] .BallotVerifier__Code {
    text-align: left;
  }

  html[dir="rtl"] .BallotVerifier__Title,
  html[dir="rtl"] .BallotVerifier__Title_Secondary,
  html[dir="rtl"] .BallotVerifier__Description,
  html[dir="rtl"] .BallotVerifier__Secondary_Description,
  html[dir="rtl"] .BallotVerifier__Code {
    text-align: right;
  }

  .BallotVerifier__Title_Secondary {
    align-self: flex-start;
  }

  .BallotVerifier__Description {
    width: 100%;
  }

  .BallotVerifier__Secondary_Description {
    width: 100%;
  }

  .BallotVerifier__Code {
    width: 100%;
    font-size: 4rem;
    margin: 3rem 0;
  }

  .BallotVerifier__Alert {
    margin: 1rem 0 3rem 0;
  }

  .BallotVerifier__Help_Description {
    font-size: 1.2rem;
  }

  .BallotVerifier__Button {
    max-width: fit-content;
    align-self: flex-start;
    margin-top: 3rem !important;
    font-size: 1.125rem !important;
    padding: 0.75rem 2.75rem !important;
    border-radius: 14px !important;
  }

  .BallotVerifier__Help_Icon {
    width: 4rem;
    height: 4rem;
  }
}
</style>
