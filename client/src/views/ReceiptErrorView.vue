<script setup lang="ts">
import { computed } from "vue";
import useConfigStore from "@/stores/useConfigStore";
import ContentLayout from "@/components/ContentLayout.vue";
import MainIcon from "@/components/MainIcon.vue";
import Error from "@/components/Error.vue";
import useReceiptStore from "@/stores/useReceiptStore";
import i18n from "@/lib/i18n";
import router from "@/router";
import { useRoute } from "vue-router";

const configStore = useConfigStore();
const receiptStore = useReceiptStore();
const route = useRoute();
const steps = [1, 2];

const translationPath = computed(() =>
  receiptStore.receiptValid ? "vote_not_found" : "receipt_invalid",
);

const contactUrl = computed(
  () =>
    configStore.electionStatus?.electionVerificationSite?.contactUrl[
      i18n.global.locale
    ] || null,
);

const navigate = (url: string, external = false) =>
  external ? (window.location.href = url) : router.push(url);

const buttons = computed(() => {
  return {
    primary: {
      visible: true,
      label:
        !receiptStore.receiptValid ||
        (receiptStore.receiptValid && contactUrl.value)
          ? i18n.global.t(
              `views.receipt_error.${translationPath.value}.primary_action`,
            )
          : i18n.global.t(
              `views.receipt_error.${translationPath.value}.secondary_action`,
            ),
      url: receiptStore.receiptValid
        ? contactUrl.value
          ? contactUrl.value
          : `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}`
        : `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}/track`,
    },
    secondary: {
      visible:
        !receiptStore.receiptValid ||
        (receiptStore.receiptValid && contactUrl.value),
      label: i18n.global.t(
        `views.receipt_error.${translationPath.value}.secondary_action`,
      ),
      url: `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}`,
    },
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
      <MainIcon
        :icon="receiptStore.receiptValid ? 'circle-xmark' : 'file-circle-xmark'"
      />
      <h3 class="ReceiptError__Title">
        {{ $t(`views.receipt_error.${translationPath}.title`) }}
      </h3>

      <Error :errorPath="`receipt.${translationPath}`" />
      <div class="ReceiptError__Buttons">
        <button
          v-if="buttons.primary.visible"
          class="btn btn-theme w-100 rounded-3 ReceiptError__Button"
          type="button"
          @click="
            navigate(
              buttons.primary.url,
              receiptStore.receiptValid && contactUrl,
            )
          "
        >
          {{ buttons.primary.label }}
        </button>

        <button
          v-if="buttons.secondary.visible"
          class="btn btn-theme-outline w-100 rounded-3 ReceiptError__Button"
          type="button"
          @click="navigate(buttons.secondary.url)"
        >
          {{ buttons.secondary.label }}
        </button>
      </div>
    </template>

    <template v-slot:help>
      <div
        v-for="step in steps"
        :key="`verification-step-${step}`"
        class="ReceiptError__Step"
      >
        <span class="ReceiptError__Step_Index">{{ step }}</span>
        <p
          v-html="$t(`views.tracking.help.steps.step_${step}`)"
          class="ReceiptError__Step_Text text-contrast"
        />
      </div>
    </template>
  </ContentLayout>
</template>

<style scoped>
.ReceiptError__Title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0.5rem 0 1rem 0;
  text-align: center;
}

.ReceiptError__Buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ReceiptError__Secondary_Button_Overrides {
  width: 100%;
  border-color: var(--av-theme-background) !important;
  color: var(--av-theme-background) !important;
}

.ReceiptError__Step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ReceiptError__Step_Index {
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
  .ReceiptError__Buttons {
    flex-direction: row;
    width: 50%;
  }

  .ReceiptError__ActionItem {
    width: 30rem;
  }

  .ReceiptError__Title {
    font-size: 3.5rem;
    padding-top: 4rem;
    margin-bottom: 1.5rem;
    display: block;
    text-align: left;
  }

  .ReceiptError__Button {
    font-size: 1.125rem !important;
    padding: 0.75rem 2.75rem !important;
    border-radius: 14px !important;
    margin-bottom: 1rem !important;
  }

  .ReceiptError__Step_Index {
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
