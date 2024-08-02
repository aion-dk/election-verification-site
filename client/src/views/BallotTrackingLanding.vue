<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import useConfigStore from "../stores/useConfigStore";
import useBallotStore from "../stores/useBallotStore";
import useReceiptStore from "@/stores/useReceiptStore";
import i18n from "../lib/i18n";
import router from "../router";
import Error from "../components/Error.vue";
import ContentLayout from "../components/ContentLayout.vue";
import MainIcon from "../components/MainIcon.vue";
import { useRoute } from "vue-router";
import { PDFReceiptDocument } from "@/lib/PDFReceiptDocument";

const receiptStore = useReceiptStore();
const configStore = useConfigStore();
const ballotStore = useBallotStore();
const route = useRoute();
const trackingCode = ref(null);
const error = ref(null);
const disabled = ref(false);
const steps = [1, 2];

const isRtl = computed(
  () => document.getElementsByTagName("html")[0].dir === "rtl"
);

onMounted(() => receiptStore.reset());

const parseReceipt = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();

  await receiptStore.setupAVVerifier(configStore.boardSlug);

  const fileInput = document.getElementById("receipt-file") as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (file) {
    // @ts-ignore: I don't know what this problem is
    PDFReceiptDocument.loadReceipt(file)
      .then((pdfReceiptDoc: PDFReceiptDocument) => {
        const receipt = pdfReceiptDoc.getReceipt();
        const receiptTrackingCode = pdfReceiptDoc.getTrackingCode();

        if (receipt == null || receiptTrackingCode == null) {
          error.value = "receipt.invalid_file_format";
          return;
        }

        receiptStore.validateReceipt(receipt, receiptTrackingCode);
        if (receiptStore.receiptValid) {
          trackingCode.value = receiptTrackingCode;
          lookupBallot(event);
        } else {
          router.push(
            `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}/receipt_error`
          );
        }
      })
      .catch(() => {
        error.value = "receipt.invalid_file_format";
      });
  }
};

const lookupBallot = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  disabled.value = true;
  error.value = null;

  if (trackingCode.value && configStore.boardSlug) {
    await ballotStore.loadBallot(trackingCode.value, configStore.boardSlug);
  }

  if (ballotStore.ballot?.status) {
    router.push(
      `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}/track/${trackingCode.value}`
    );
  } else {
    if (receiptStore.receiptValid) {
      router.push(
        `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}/receipt_error`
      );
    } else {
      error.value = "track.invalid_code";
    }
  }

  disabled.value = false;
};
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
        <!-- Tracking code lookup -->
        <div class="TrackingLanding__ActionItem">
          <form @submit="lookupBallot">
            <input
              :disabled="disabled"
              type="text"
              name="verification-code"
              id="verification-code"
              :placeholder="$t('views.tracking.placeholder')"
              v-model="trackingCode"
              :class="{
                TrackingLanding__TrackingCode: true,
                TrackingLanding__TrackingCode_Error: error,
              }"
              data-1p-ignore
              v-focus
            />
            <AVButton
              :label="$t('views.tracking.button')"
              type="neutral"
              name="initiate-verification"
              id="initiate-verification"
              :disabled="disabled || !trackingCode"
              fullWidth
              @click="lookupBallot"
              class="TrackingLanding__Button_Overrides"
            />
          </form>
          <p class="TrackingLanding__Tooltip">
            <tooltip hover :placement="isRtl ? 'left' : 'right'">
              <template #default>
                <AVIcon
                  icon="circle-question"
                  class="TrackingLanding__Tooltip_Icon"
                  aria-hidden="true"
                />
                <span>{{ $t("views.tracking.tooltip_helper") }}</span>
                <span :aria-label="$t('views.tracking.tooltip_text')"> </span>
              </template>

              <template #content>
                <span id="tracking-code-tooltip">
                  {{ $t("views.tracking.tooltip_text") }}
                </span>
              </template>
            </tooltip>
          </p>
        </div>

        <!-- Receipt upload -->
        <div class="TrackingLanding__ActionItem">
          <form @submit="parseReceipt">
            <input
              type="file"
              name="receipt-file"
              id="receipt-file"
              data-1p-ignore
            />
            <AVButton
              :label="$t('views.receipt.button')"
              type="neutral"
              name="initiate-verification"
              id="initiate-verification"
              fullWidth
              @click="parseReceipt"
              class="TrackingLanding__Button_Overrides"
            />
          </form>
          <p class="TrackingLanding__Tooltip">
            <tooltip hover :placement="isRtl ? 'left' : 'right'">
              <template #default>
                <AVIcon
                  icon="circle-question"
                  class="TrackingLanding__Tooltip_Icon"
                  aria-hidden="true"
                />
                <span>{{ $t("views.receipt.tooltip_helper") }}</span>
                <span :aria-label="$t('views.receipt.tooltip_text')"> </span>
              </template>

              <template #content>
                <span id="receipt-tooltip">
                  {{ $t("views.receipt.tooltip_text") }}
                </span>
              </template>
            </tooltip>
          </p>
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

.TrackingLanding__Action_Item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.TrackingLanding__Action_Item form {
  width: 100%;
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

.TrackingLanding__Button_Overrides {
  background-color: var(--av-theme-background) !important;
  border-color: var(--av-theme-background) !important;
  color: var(--av-theme-text) !important;
}

.TrackingLanding__Tooltip {
  cursor: help;
}

html[dir="ltr"] .TrackingLanding__Tooltip_Icon {
  margin-right: 0.5rem;
}

html[dir="rtl"] .TrackingLanding__Tooltip_Icon {
  margin-left: 0.5rem;
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

  .TrackingLanding__Button_Overrides {
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
