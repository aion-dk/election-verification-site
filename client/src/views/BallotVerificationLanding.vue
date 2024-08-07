<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import useVerificationStore from "../stores/useVerificationStore";
import useConfigStore from "../stores/useConfigStore";
import router from "../router";
import Error from "../components/Error.vue";
import ContentLayout from "../components/ContentLayout.vue";
import MainIcon from "../components/MainIcon.vue";

const verificationStore = useVerificationStore();
const configStore = useConfigStore();
const error = ref(null);
const disabled = ref(false);
const verificationCode = ref(null);
const steps = [1, 2, 3, 4, 5];

onMounted(() => {
  verificationStore.reset();
  verificationStore.setupAVVerifier(configStore.boardSlug);

  (document.querySelector("#verification-code") as HTMLInputElement)?.focus();
});

const initiateVerification = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  disabled.value = true;
  error.value = null;

  try {
    await verificationStore.findBallot(verificationCode.value);

    verificationStore.generatePairingCode();

    setTimeout(async () => {
      if (verificationStore.pairingCode) return;

      await router.push({
        name: "BallotVerifierFound",
        params: {
          verificationCode: verificationCode.value,
        },
      });
    }, 2000);
  } catch (e) {
    console.error(e);
    disabled.value = false;
    error.value = "verify.invalid_code";
  }
};

watch(verificationStore, async (newStore) => {
  if (!newStore.pairingCode) return;

  await router.push({
    name: "BallotVerifierView",
    params: {
      pairingCode: newStore.pairingCode,
    },
  });
});
</script>

<template>
  <ContentLayout
    :help-title="$t('views.verification.help.title')"
    :help-title-strong="$t('views.verification.help.title_strong')"
    :logo="configStore.electionStatus?.theme?.logo"
  >
    <template v-slot:action>
      <MainIcon icon="envelope-open-text" />
      <h3 class="VerificationLanding__Title">
        {{ $t("views.verification.title") }}
      </h3>
      <h4 class="VerificationLanding__Subtitle">
        {{ $t("views.verification.subtitle") }}
        <strong>{{ $t("views.verification.subtitle_strong") }}</strong>
      </h4>
      <p class="VerificationLanding__Description">
        {{ $t("views.verification.description") }}
      </p>
      <Error v-if="error" :errorPath="error" />
      <div class="VerificationLanding__Action_Container">
        <AVTextInput
          id="verification-code"
          v-model="verificationCode"
          :placeholder="$t('views.verification.placeholder')"
          :disabled="disabled"
          input-label="Testing code"
          :error="!!error"
          :tooltip-text="$t('views.verification.tooltip_text')"
        />

        <AVButton
          :label="$t('views.verification.button')"
          type="neutral"
          name="initiate-verification"
          id="initiate-verification"
          :disabled="disabled || !verificationCode"
          full-width
          @click="initiateVerification"
          class="VerificationLanding__Button_Overrides"
        />
      </div>
    </template>

    <template v-slot:help>
      <div
        v-for="step in steps"
        :key="`verification-step-${step}`"
        class="VerificationLanding__Step"
      >
        <span class="VerificationLanding__Step_Index">{{ step }}</span>
        <p
          v-html="$t(`views.verification.help.steps.step_${step}`)"
          class="VerificationLanding__Step_Text text-contrast"
        />
      </div>
      <span class="VerificationLanding__Help_Footer text-contrast">{{
        $t(`views.verification.help.footer`)
      }}</span>
    </template>
  </ContentLayout>
</template>

<style scoped>
.VerificationLanding__Action_Container {
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
}

.VerificationLanding__Title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--slate-800);
  margin: 0.5rem 0 1rem 0;
  text-align: center;
}

.VerificationLanding__Subtitle {
  color: var(--slate-700);
  font-size: 1.75rem;
  font-weight: 500;
  margin: 0 0 1rem 0;
  text-align: center;
}

.VerificationLanding__Description {
  color: var(--slate-700);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.VerificationLanding__Button_Overrides {
  background-color: var(--av-theme-background) !important;
  border-color: var(--av-theme-background) !important;
  color: var(--av-theme-text) !important;
}

.VerificationLanding__Step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.VerificationLanding__Step_Index {
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

.VerificationLanding__Help_Footer {
  font-size: 1.5rem;
}

@media only screen and (min-width: 80rem) {
  .VerificationLanding__Action_Container {
    width: 30rem;
  }

  .VerificationLanding__Title {
    font-size: 3.5rem;
    padding-top: 4rem;
    margin-bottom: 1.5rem;
    display: block;
    text-align: left;
  }

  .VerificationLanding__Subtitle {
    font-size: 2.25rem;
    margin-bottom: 2rem;
    display: block;
    text-align: left;
  }

  .VerificationLanding__Description {
    margin-bottom: 3rem;
    text-align: left;
  }

  .VerificationLanding__Button_Overrides {
    font-size: 1.125rem !important;
    padding: 0.75rem 2.75rem !important;
    border-radius: 14px !important;
    margin-bottom: 1rem !important;
  }

  .VerificationLanding__Help_Footer {
    font-size: 1.75rem;
  }

  .VerificationLanding__Step_Index {
    width: 1.75rem;
    height: 1.75rem;
  }

  .VerificationLanding__Step_Text {
    margin: 1rem 0 0.5rem 0;
  }
}

@media only screen and (min-width: 120rem) {
  .VerificationLanding__Help_Footer {
    font-size: 2.25rem;
  }

  .VerificationLanding__Step_Index {
    width: 2rem;
    height: 2rem;
  }

  .VerificationLanding__Step_Text {
    margin: 2rem 0 1rem 0;
    font-size: 1.2rem;
  }
}
</style>
