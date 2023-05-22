<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import useVerificationStore from "../stores/useVerificationStore";
import useConfigStore from "../stores/useConfigStore";
import router from "../router";
import Error from "../components/Error.vue";

const verificationStore = useVerificationStore();
const configStore = useConfigStore();
const error = ref(null);
const disabled = ref(false);
const verificationCode = ref(null);
const steps = [1, 2, 3, 4, 5];

onMounted(() => {
  verificationStore.reset();
  verificationStore.setupAVVerifier(configStore.boardSlug);

  (
    document.querySelector(".Welcome__TrackingCode") as HTMLInputElement
  )?.focus();
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
  <div class="VerificationLanding__Container">
    <section class="VerificationLanding__Action">
      <AVIcon
        icon="envelope-open-text"
        class="VerificationLanding__Icon text-theme"
      />
      <h3 class="VerificationLanding__Title">
        {{ $t("views.verification.title") }}
      </h3>
      <h4 class="VerificationLanding__Subtitle">
        {{ $t("views.verification.subtitle") }}
        <strong class="text-theme">{{
          $t("views.verification.subtitle_strong")
        }}</strong>
      </h4>
      <p class="VerificationLanding__Description">
        {{ $t("views.verification.description") }}
      </p>
      <Error v-if="error" :errorPath="error" />
      <div class="VerificationLanding__Action_Container">
        <form @submit="initiateVerification">
          <input
            :disabled="disabled"
            type="text"
            name="verification-code"
            id="verification-code"
            :placeholder="$t('views.verification.placeholder')"
            v-model="verificationCode"
            class="VerificationLanding__TrackingCode"
            data-1p-ignore
          />
          <AVButton
            :label="$t('views.verification.button')"
            type="neutral"
            name="initiate-verification"
            id="initiate-verification"
            :disabled="disabled || !verificationCode"
            iconLeft
            fullWidth
            icon="fingerprint"
            @click="initiateVerification"
            class="VerificationLanding__Button_Overrides"
          />
        </form>
        <p class="VerificationLanding__Tooltip">
          <tooltip hover placement="right">
            <template #default>
              <AVIcon
                icon="circle-question"
                class="VerificationLanding__Tooltip_Icon"
              />
              <span>{{ $t("views.verification.tooltip_helper") }}</span>
              <span :aria-label="$t('views.verification.tooltip_text')"> </span>
            </template>

            <template #content>
              <span id="tracking-code-tooltip">
                {{ $t("views.verification.tooltip_text") }}
              </span>
            </template>
          </tooltip>
        </p>
      </div>
    </section>
    <aside class="VerificationLanding__Help">
      <h5 class="VerificationLanding__Help_Title">
        {{ $t("views.verification.help.title")
        }}<strong class="text-theme">{{
          $t("views.verification.help.title_strong")
        }}</strong>
      </h5>
      <div class="VerificationLanding__Help_Container">
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
      </div>
      <img
        v-if="configStore.electionStatus?.theme?.logo"
        class="VerificationLanding__Brand_Logo"
        :src="configStore.electionStatus?.theme?.logo"
        :alt="$t('header.election_logo_alt')"
      />
    </aside>
  </div>
</template>

<style scoped>
.VerificationLanding__Container {
  display: flex;
  width: 100vw;
  height: 100%;
}

.VerificationLanding__Action {
  width: 70%;
  padding: 5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.VerificationLanding__Icon {
  opacity: 0.05;
  font-size: 20rem;
  position: absolute;
  right: 3rem;
  top: 3rem;
}

.VerificationLanding__Action_Container {
  width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.VerificationLanding__Action_Container form {
  width: 100%;
}

.VerificationLanding__Title {
  font-size: 3rem;
  font-weight: 600;
  color: var(--slate-900);
  margin: 0 0 1.5rem 0;
}
.VerificationLanding__Subtitle {
  color: var(--slate-700);
  font-size: 2.25rem;
  font-weight: 500;
  margin: 0 0 3rem 0;
}

.VerificationLanding__Description {
  color: var(--slate-700);
  margin: 0 0 3rem 0;
}

.VerificationLanding__TrackingCode {
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

.VerificationLanding__Button_Overrides {
  background-color: var(--av-theme-background) !important;
  border-color: var(--av-theme-background) !important;
  color: var(--av-theme-text) !important;
}

.VerificationLanding__Tooltip {
  cursor: help;
}

.VerificationLanding__Tooltip_Icon {
  margin-right: 0.5rem;
}

.VerificationLanding__Help {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
  background-color: var(--slate-100);
  padding: 0 6rem;
}

.VerificationLanding__Help_Title {
  font-size: 2rem;
  font-weight: 500;
  margin: 0 0 2rem 0;
  text-align: center;
}

.VerificationLanding__Help_Container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--av-theme-background);
  border-radius: 12px;
  padding: 5rem 4rem;
  gap: 2rem;
  text-align: center;
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
  font-size: 2.25rem;
}

.VerificationLanding__Brand_Logo {
  display: none;
}

@media only screen and (max-width: 1800px) {
  .VerificationLanding__Action {
    width: 60%;
  }
  .VerificationLanding__Help {
    width: 40%;
  }
}

@media only screen and (max-width: 1440px) {
  .VerificationLanding__Help {
    padding: 0 4rem;
  }

  .VerificationLanding__Help_Container {
    padding: 4rem 3rem;
    gap: 1rem;
  }
}

@media only screen and (max-width: 976px) {
  .VerificationLanding__Container {
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  }

  .VerificationLanding__Action {
    align-items: center;
    text-align: center;
    width: 100%;
    padding-bottom: 2rem;
  }

  .VerificationLanding__Icon {
    opacity: 1;
    font-size: 5rem;
    position: static;
  }

  .VerificationLanding__Help {
    width: 100%;
    padding-top: 2rem;
  }

  .VerificationLanding__Help_Container {
    margin-bottom: 3rem;
  }

  .VerificationLanding__Action_Container {
    width: 100%;
  }

  .VerificationLanding__Brand_Logo {
    display: block;
    width: 30%;
    margin-bottom: 2rem;
  }
}

@media only screen and (max-width: 768px) {
  .VerificationLanding__Title {
    margin: 1rem 0;
    font-size: 2.5rem;
  }

  .VerificationLanding__Subtitle {
    margin: 1rem 0;
    font-size: 1.75rem;
  }

  .VerificationLanding__Description {
    margin-bottom: 2rem;
  }

  .VerificationLanding__Help_Container {
    padding: 3rem 2rem;
  }

  .VerificationLanding__Help_Title {
    font-size: 1.5rem;
  }

  .VerificationLanding__Help_Footer {
    font-size: 1.5rem;
  }
}

@media only screen and (max-height: 1080px) and (min-width: 976px) {
  .VerificationLanding__Help_Container {
    padding: 3rem 2rem;
    gap: 1.5rem;
  }

  .VerificationLanding__Help_Footer {
    font-size: 1.5rem;
  }

  .VerificationLanding__Step_Index {
    width: 1.5rem;
    height: 1.5rem;
  }

  .VerificationLanding__Step_Text {
    margin: 1rem 0 0 0;
  }

  .VerificationLanding__Help_Title {
    font-size: 1.75rem;
    margin: 0 0 2rem 0;
  }
}

@media only screen and (max-height: 720px) and (min-width: 976px) {
  .VerificationLanding__Help_Container {
    padding: 3rem 2rem;
    gap: 1rem;
  }

  .VerificationLanding__Help_Footer {
    font-size: 1.25rem;
  }

  .VerificationLanding__Step_Index {
    width: 1.5rem;
    height: 1.5rem;
  }

  .VerificationLanding__Step_Text {
    margin: 0.5rem 0 0 0;
  }

  .VerificationLanding__Help_Title {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
  }
}
</style>
