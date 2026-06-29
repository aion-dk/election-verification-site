<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ReceiptPDFExtractor } from "@/lib/receiptPDFExtractor";

import Error from "@/components/Error.vue";
import ContentLayout from "@/components/ContentLayout.vue";
import MainIcon from "@/components/MainIcon.vue";

import useConfigStore from "@/stores/useConfigStore";
import useReceiptStore from "@/stores/useReceiptStore";
import useVerificationStore from "@/stores/useVerificationStore";
import router from "@/router";

const { t, locale } = useI18n();
const receiptStore = useReceiptStore();
const configStore = useConfigStore();
const verificationStore = useVerificationStore();
const route = useRoute();

const ballotCode = ref(null);

const receipt = ref(null);

const error = ref(null);

const steps = ref([1, 2]);

const receiptInputDisabled = computed(() => !!ballotCode.value);

const mainInputDisabled = computed(() => !!receipt.value);

const button = computed(() => {
  return {
    label: t("views.ballot_finder.button"),
    disabled: !ballotCode.value && !receipt.value,
  };
});

const updateReceipt = async (files: File[]) => {
  if (!files.length) {
    receipt.value = null;
    ballotCode.value = null;
    error.value = null;
  } else {
    receipt.value = files[0];
    await receiptStore.setupAVVerifier(configStore.boardSlug);
    const receiptExtractor = new ReceiptPDFExtractor(receipt.value);

    await receiptExtractor
      .extract()
      .then(async () => {
        receiptStore.validateReceipt(receiptExtractor.receipt);
        if (!receiptStore.receiptValid) {
          await router.push(`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/receipt_error`);
          return;
        }

        if (receiptExtractor.trackingCode) {
          await receiptWithTrackingCode(receiptExtractor.receipt, receiptExtractor.trackingCode);
          return;
        }

        if (receiptExtractor.ballotCode) {
          await receiptWithBallotCode(receiptExtractor.receipt, receiptExtractor.ballotCode);
          return;
        }
      })
      .catch(() => {
        error.value = "receipt.invalid_file_format";
      });
  }
};

const receiptWithBallotCode = async (receipt: string, ballotCode: string) => {
  await verificationStore.findBallot(ballotCode);
  try {
    await verificationStore.pollForCastBallot();
    receiptStore.validateTrackingCode(receipt, verificationStore.trackingCode);
    if (receiptStore.trackingCodeMatching) {
      await router.push(`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/track/${ballotCode}`);
    } else {
      await router.push(`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/receipt_error`);
    }
  } catch (e) {
    await router.push(`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/receipt_error`);
  }
}

const receiptWithTrackingCode = async (receipt: string, trackingCode: string) => {
  receiptStore.validateTrackingCode(receipt, trackingCode);
  if (receiptStore.trackingCodeMatching) {
    verificationStore.setTrackingCode(trackingCode);
    await router.push(`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/track/${trackingCode}`);
  } else {
    await router.push(`/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/receipt_error`);
  }
}

const lookupBallot = async () => {
  error.value = null;

  try {
    await verificationStore.findBallot(ballotCode.value);
    verificationStore.generatePairingCode();

    setTimeout(async () => {
      if (verificationStore.pairingCode || verificationStore.trackingCode) return;

      await router.push({
        name: "BallotVerifierFound",
        params: {
          verificationCode: ballotCode.value,
        },
      });
    }, 2000);
  } catch (e) {
    console.error(e);
    error.value = "verify.invalid_code";
  }
};

async function checkForPairingCode(store: any) {
  if (!store.pairingCode) return;

  await router.push({
    name: "BallotVerifierView",
    params: {
      pairingCode: store.pairingCode,
    },
  });
}

async function checkForTrackingCode(store: any) {
  if (!store.trackingCode) return;

  await router.push(
      `/${locale}/${route.params.organisationSlug}/${route.params.electionSlug}/track/${store.ballotCode}`,
  );
}

watch(verificationStore, async (newStore) => {
  await checkForPairingCode(newStore);
  await checkForTrackingCode(newStore);
});

onMounted(() => {
  receiptStore.reset();
  verificationStore.reset();
  verificationStore.setupAVVerifier(configStore.boardSlug);
  (document.querySelector("#unified-code") as HTMLInputElement)?.focus();
});
</script>

<template>
  <ContentLayout
    :help-title="t('views.ballot_finder.help.title')"
    :help-title-strong="t('views.ballot_finder.help.title_strong')"
    :logo="configStore.electionStatus?.theme?.logo"
  >
    <template v-slot:action>
      <MainIcon icon="magnifying-glass" />
      <h3 class="UnifiedLanding__Title">
        {{ t("views.ballot_finder.title") }}
      </h3>
      <h4 class="UnifiedLanding__Subtitle">
        {{ t("views.ballot_finder.subtitle") }}
        <strong>{{ t("views.ballot_finder.subtitle_strong") }}</strong>
      </h4>
      <p class="UnifiedLanding__Description">
        {{ t("views.ballot_finder.description") }}
      </p>
      <Error v-if="error" :errorPath="error" />
      <div class="UnifiedLanding__Action_Container">
        <div class="UnifiedLanding__ActionItem">
          <div class="mb-3 w-100">
            <label for="unified-code" class="form-label">
              {{ t("views.ballot_finder.input_label") }}
              <AVIcon
                icon="circle-question"
                class="text-gray-600 cursor-help"
                v-tooltip="t('views.ballot_finder.input_tooltip')"
              />
            </label>
            <input
              type="text"
              v-model="ballotCode"
              class="form-control p-3 fs-5 rounded-3"
              id="unified-code"
              :placeholder="t('views.ballot_finder.input_placeholder')"
              :disabled="mainInputDisabled"
            />
          </div>

          <button
            class="btn btn-theme w-100 rounded-3 UnifiedLanding__Button"
            type="button"
            name="initiate-tracking"
            id="initiate-tracking"
            :disabled="button.disabled"
            @click="lookupBallot"
          >
            {{ button.label }}
          </button>

          <div
            class="bg-gray-300 my-4 rounded-pill"
            style="height: 2px; width: 10rem"
          ></div>

          <div class="mb-3 w-100">
            <p class="form-label">
              {{ t("views.ballot_finder.receipt_input_label") }}
              <AVIcon
                icon="circle-question"
                class="text-gray-600 cursor-help"
                v-tooltip="t('views.ballot_finder.receipt_input_tooltip')"
              />
            </p>
            <AVFileInput
              id="receipt-file"
              accept=".pdf"
              :error="!!error"
              :disabled="receiptInputDisabled"
              :show-preview="false"
              @update="updateReceipt"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-slot:help>
      <div
        v-for="step in steps"
        :key="`verification-step-${step}`"
        class="UnifiedLanding__Step"
      >
        <span class="UnifiedLanding__Step_Index">{{ step }}</span>
        <p
          v-html="t(`views.ballot_finder.help.steps.step_${step}`)"
          class="UnifiedLanding__Step_Text text-contrast"
        ></p>
      </div>
    </template>
  </ContentLayout>
</template>

<style scoped>
.UnifiedLanding__Action_Container {
  display: flex;
  width: 100%;
}

.UnifiedLanding__ActionItem {
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
}

.UnifiedLanding__Title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--bs-gray-800);
  margin: 0.5rem 0 1rem 0;
  text-align: center;
}

.UnifiedLanding__Subtitle {
  color: var(--bs-gray-700);
  font-size: 1.75rem;
  font-weight: 500;
  margin: 0 0 1rem 0;
  text-align: center;
}

.UnifiedLanding__Description {
  color: var(--bs-gray-700);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.UnifiedLanding__TrackingCode {
  color: black;
  border: solid 1px var(--bs-gray-500);
  border-radius: 12px;
  box-sizing: border-box;
  width: 100%;
  height: 2.75rem;
  line-height: 2.75rem;
  text-align: center;
  padding: 0 1.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.UnifiedLanding__TrackingCode_Error {
  border: 2px solid var(--av-theme-danger-background);
}

.UnifiedLanding__Step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.UnifiedLanding__Step_Index {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--av-theme-text);
  color: var(--av-theme-background);
  width: 2rem;
  height: 2rem;
  font-weight: 600;
  border-radius: 999px;
}

@media only screen and (min-width: 80rem) {
  .UnifiedLanding__ActionItem {
    width: 30rem;
  }

  .UnifiedLanding__Action_Container .UnifiedLanding__ActionItem:first-child {
    margin-right: 2rem;
  }

  .UnifiedLanding__Title {
    font-size: 3.5rem;
    padding-top: 4rem;
    margin-bottom: 1.5rem;
    display: block;
    text-align: left;
  }

  .UnifiedLanding__Subtitle {
    font-size: 2.25rem;
    margin-bottom: 2rem;
    display: block;
    text-align: left;
  }

  .UnifiedLanding__Description {
    margin-bottom: 3rem;
    text-align: left;
  }

  .UnifiedLanding__TrackingCode {
    border-radius: 14px;
    height: 3.25rem;
    line-height: 3.25rem;
    font-size: 1.125rem;
    margin-bottom: 1.125rem;
  }

  .UnifiedLanding__Button {
    font-size: 1.125rem !important;
    padding: 0.75rem 2.75rem !important;
    border-radius: 14px !important;
    margin-bottom: 1rem !important;
  }

  .UnifiedLanding__Step_Index {
    width: 1.75rem;
    height: 1.75rem;
  }
}

@media only screen and (min-width: 120rem) {
  .UnifiedLanding__Step_Index {
    width: 2rem;
    height: 2rem;
  }

  .UnifiedLanding__Step_Text {
    font-size: 1.2rem;
  }
}
</style>
