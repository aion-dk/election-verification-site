<script setup lang="ts">
import { ref } from "vue";
import useConfigStore from "../stores/useConfigStore";
import useBallotStore from "../stores/useBallotStore";
import useLocaleStore from "../stores/useLocaleStore";
import router from "../router";
import Error from "../components/Error.vue";
import ContentLayout from "../components/ContentLayout.vue";
import MainIcon from "../components/MainIcon.vue";

const configStore = useConfigStore();
const ballotStore = useBallotStore();
const localeStore = useLocaleStore();
const trackingCode = ref(null);
const error = ref(null);
const disabled = ref(false);
const steps = [1, 2];

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
      `/${localeStore.locale}/${configStore.boardSlug}/track/${trackingCode.value}`
    );
  } else {
    error.value = "track.invalid_code";
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
        <form @submit="lookupBallot">
          <input
            :disabled="disabled"
            type="text"
            name="verification-code"
            id="verification-code"
            :placeholder="$t('views.tracking.placeholder')"
            v-model="trackingCode"
            class="TrackingLanding__TrackingCode"
            data-1p-ignore
            v-focus
          />
          <AVButton
            :label="$t('views.tracking.button')"
            type="neutral"
            name="initiate-verification"
            id="initiate-verification"
            :disabled="disabled || !trackingCode"
            iconLeft
            fullWidth
            icon="fingerprint"
            @click="lookupBallot"
            class="TrackingLanding__Button_Overrides"
          />
        </form>
        <p class="TrackingLanding__Tooltip">
          <tooltip hover placement="right">
            <template #default>
              <AVIcon
                icon="circle-question"
                class="TrackingLanding__Tooltip_Icon"
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

      <div>
        <p class="text-contrast TrackingLanding__Bonus">
          <strong>{{ $t(`views.tracking.help.bonus.title`) }}</strong>
        </p>
        <p class="text-contrast TrackingLanding__Bonus">
          {{ $t(`views.tracking.help.bonus.description`) }}
        </p>
        <p class="text-contrast TrackingLanding__Bonus">
          {{ $t(`views.tracking.help.bonus.q1`) }}
        </p>
        <p class="text-contrast TrackingLanding__Bonus">
          {{ $t(`views.tracking.help.bonus.q2`) }}
        </p>
        <p class="text-contrast TrackingLanding__Bonus">
          {{ $t(`views.tracking.help.bonus.q3`) }}
        </p>
      </div>
    </template>
  </ContentLayout>
</template>

<style scoped>
.TrackingLanding__Action_Container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.TrackingLanding__Action_Container form {
  width: 100%;
}

.TrackingLanding__Title {
  font-size: 2.5rem;
  font-weight: 800;
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

.TrackingLanding__Button_Overrides {
  background-color: var(--av-theme-background) !important;
  border-color: var(--av-theme-background) !important;
  color: var(--av-theme-text) !important;
}

.TrackingLanding__Tooltip {
  cursor: help;
}

.TrackingLanding__Tooltip_Icon {
  margin-right: 0.5rem;
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

.TrackingLanding__Bonus strong {
  display: block;
  margin: 1rem 0 0.5rem 0;
}

.TrackingLanding__Bonus {
  align-self: flex-start;
  text-align: center;
  margin: 0;
}

@media only screen and (min-width: 80rem) and (min-height: 45rem) {
  .TrackingLanding__Action_Container {
    width: 30rem;
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

  .TrackingLanding__Step_Index {
    width: 1.5rem;
    height: 1.5rem;
  }

  .TrackingLanding__Bonus strong {
    margin: 0 0 0.5rem 0;
  }
}

@media only screen and (min-width: 80rem) and (min-height: 68rem) {
  .TrackingLanding__Step_Index {
    width: 1.75rem;
    height: 1.75rem;
  }
}

@media only screen and (min-width: 120rem) and (min-height: 90rem) {
  .TrackingLanding__Step_Index {
    width: 2rem;
    height: 2rem;
  }

  .TrackingLanding__Step_Text,
  .TrackingLanding__Bonus {
    font-size: 1.2rem;
  }
}
</style>
