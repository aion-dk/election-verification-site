<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import useConfigStore from "../stores/useConfigStore";
import useBallotStore from "../stores/useBallotStore";
import useReceiptStore from "@/stores/useReceiptStore";
import i18n from "../lib/i18n";
import router from "../router";
import Error from "../components/Error.vue";
import ContentLayout from "../components/ContentLayout.vue";
import MainIcon from "../components/MainIcon.vue";
import { useRoute } from "vue-router";
import { ReceiptPDFExtractor } from "../lib/receiptPDFExtractor";

const receiptStore = useReceiptStore();
const configStore = useConfigStore();
const ballotStore = useBallotStore();
const route = useRoute();
const trackingCode = ref(null);
const receipt = ref(null);
const error = ref(null);
const steps = [1, 2];

onMounted(() => {
  receiptStore.reset();
  (document.querySelector("#tracking-code") as HTMLInputElement)?.focus();
});

const lookupBallot = async () => {
  if (trackingCode.value && configStore.boardSlug) {
    await ballotStore.loadBallot(trackingCode.value, configStore.boardSlug);
  }

  if (ballotStore.ballot?.status) {
    router.push(
      `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}/track/${trackingCode.value}`,
    );
  } else {
    if (receiptStore.receiptValid) {
      router.push(
        `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}/receipt_error`,
      );
    } else {
      error.value = "track.invalid_code";
    }
  }
};

const updateReceipt = async (files: File[]) => {
  if (!files.length) {
    receipt.value = null;
    trackingCode.value = null;
    error.value = null;
  } else {
    receipt.value = files[0];
    await receiptStore.setupAVVerifier(configStore.boardSlug);
    const receiptExtractor = new ReceiptPDFExtractor(receipt.value);

    await receiptExtractor
      .extract()
      .then(() => {
        receiptStore.validateReceipt(
          receiptExtractor.receipt,
          receiptExtractor.trackingCode,
        );

        if (receiptStore.receiptValid) {
          trackingCode.value = receiptExtractor.trackingCode;
          lookupBallot();
        } else {
          router.push(
            `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}/receipt_error`,
          );
        }
      })
      .catch(() => {
        error.value = "receipt.invalid_file_format";
      });
  }
};

const receiptInputDisabled = computed(() => !!trackingCode.value);

const trackingInputDisabled = computed(() => !!receipt.value);

const button = computed(() => {
  return {
    label: i18n.global.t("views.tracking.button"),
    disabled: !trackingCode.value && !receipt.value,
  };
});
</script>

<template>
  <ContentLayout
    :help-title="$t('views.tracking.help.title')"
    :help-title-strong="$t('views.tracking.help.title_strong')"
    :logo="configStore.electionStatus?.theme?.logo"
  >
    <template v-slot:action>
      <MainIcon icon="magnifying-glass" />
      <h3 class="TrackingLanding__Title">
        {{ $t("views.tracking.title") }}
      </h3>
      <h4 class="TrackingLanding__Subtitle">
        {{ $t("views.tracking.subtitle") }}
        <strong>{{ $t("views.tracking.subtitle_strong") }}</strong>
      </h4>
      <p class="TrackingLanding__Description">
        {{ $t("views.tracking.description") }}
      </p>
      <Error v-if="error" :errorPath="error" />
      <div class="TrackingLanding__Action_Container">
        <div class="TrackingLanding__ActionItem">
          <AVFileInput
            id="receipt-file"
            :input-label="$t('views.tracking.receipt_input_label')"
            :tooltip-text="$t('views.tracking.receipt_input_tooltip')"
            accept=".pdf"
            :error="!!error"
            :disabled="receiptInputDisabled"
            :show-preview="false"
            @update="updateReceipt"
          />

          <div class="mb-3 w-100">
            <label for="tracking-code" class="form-label">
              {{ $t("views.tracking.tracking_input_label") }}
              <AVIcon
                icon="circle-question"
                class="text-gray-600 cursor-help"
                v-tooltip="$t('views.tracking.tracking_input_tooltip')"
              />
            </label>
            <input
              type="text"
              v-model="trackingCode"
              class="form-control p-3 fs-5 rounded-3"
              id="tracking-code"
              :placeholder="$t('views.tracking.tracking_input_placeholder')"
              :disabled="trackingInputDisabled"
            />
          </div>

          <button
            class="btn btn-theme w-100 rounded-3 TrackingLanding__Button"
            type="button"
            name="initiate-tracking"
            id="initiate-tracking"
            :disabled="button.disabled"
            @click="lookupBallot"
          >
            {{ button.label }}
          </button>
        </div>
      </div>
    </template>

    <template v-slot:help>
      <div
        v-for="step in steps"
        :key="`verification-step-${step}`"
        class="TrackingLanding__Step"
      >
        <span class="TrackingLanding__Step_Index">{{ step }}</span>
        <p
          v-html="$t(`views.tracking.help.steps.step_${step}`)"
          class="TrackingLanding__Step_Text text-contrast"
        />
      </div>
    </template>
  </ContentLayout>
</template>

<style scoped>
.TrackingLanding__Action_Container {
  display: flex;
  width: 100%;
}

.TrackingLanding__ActionItem {
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
}

.TrackingLanding__Title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--slate-800);
  margin: 0.5rem 0 1rem 0;
  text-align: center;
}

.TrackingLanding__Subtitle {
  color: var(--slate-700);
  font-size: 1.75rem;
  font-weight: 500;
  margin: 0 0 1rem 0;
  text-align: center;
}

.TrackingLanding__Description {
  color: var(--slate-700);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.TrackingLanding__TrackingCode {
  color: black;
  border: solid 1px var(--slate-500);
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

.TrackingLanding__TrackingCode_Error {
  border: 2px solid var(--av-theme-danger-background);
}

.TrackingLanding__Step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.TrackingLanding__Step_Index {
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
  .TrackingLanding__ActionItem {
    width: 30rem;
  }

  .TrackingLanding__Action_Container .TrackingLanding__ActionItem:first-child {
    margin-right: 2rem;
  }

  .TrackingLanding__Title {
    font-size: 3.5rem;
    padding-top: 4rem;
    margin-bottom: 1.5rem;
    display: block;
    text-align: left;
  }

  .TrackingLanding__Subtitle {
    font-size: 2.25rem;
    margin-bottom: 2rem;
    display: block;
    text-align: left;
  }

  .TrackingLanding__Description {
    margin-bottom: 3rem;
    text-align: left;
  }

  .TrackingLanding__TrackingCode {
    border-radius: 14px;
    height: 3.25rem;
    line-height: 3.25rem;
    font-size: 1.125rem;
    margin-bottom: 1.125rem;
  }

  .TrackingLanding__Button {
    font-size: 1.125rem !important;
    padding: 0.75rem 2.75rem !important;
    border-radius: 14px !important;
    margin-bottom: 1rem !important;
  }

  .TrackingLanding__Step_Index {
    width: 1.75rem;
    height: 1.75rem;
  }
}

@media only screen and (min-width: 120rem) {
  .TrackingLanding__Step_Index {
    width: 2rem;
    height: 2rem;
  }

  .TrackingLanding__Step_Text {
    font-size: 1.2rem;
  }
}
</style>
