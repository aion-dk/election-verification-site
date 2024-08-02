<script setup lang="ts">
import {ref, onMounted} from "vue";
import useConfigStore from "../stores/useConfigStore";
import ContentLayout from "../components/ContentLayout.vue";
import MainIcon from "../components/MainIcon.vue";
import useReceiptStore from "@/stores/useReceiptStore";

const configStore = useConfigStore();
const receiptStore = useReceiptStore();
const receiptValid = ref(null);

onMounted(() => (receiptValid.value = receiptStore.receiptValid));
</script>

<template>
  <ContentLayout
    :help-title="$t('views.receipt_error.help.title')"
    :help-title-strong="$t('views.receipt_error.help.title_strong')"
    :logo="configStore.electionStatus?.theme?.logo"
  >
    <template v-slot:action>
      <MainIcon icon="magnifying-glass" />
      <h3 class="TrackingLanding__Title">
        {{ $t("views.receipt_error.title") }}
      </h3>
      <h4 class="TrackingLanding__Subtitle">
        {{ $t("views.receipt_error.subtitle") }}
        <strong>{{ $t("views.receipt_error.subtitle_strong") }}</strong>
      </h4>
      <p class="TrackingLanding__Description">
        {{ $t("views.receipt_error.description") }}
      </p>
      <h3 class="TrackingLanding__Title" v-if="receiptValid">
        {{ "ballot not found but receipt valid" }}
      </h3>
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
