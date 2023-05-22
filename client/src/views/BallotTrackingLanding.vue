<script setup lang="ts">
import { ref } from "vue";
import useConfigStore from "../stores/useConfigStore";
import useBallotStore from "../stores/useBallotStore";
import useLocaleStore from "../stores/useLocaleStore";
import router from "../router";
import Error from "../components/Error.vue";

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
  <div class="TrackingLanding__Container">
    <section class="TrackingLanding__Action">
      <AVIcon
        icon="magnifying-glass"
        class="TrackingLanding__Icon text-theme"
      />
      <h3 class="TrackingLanding__Title">
        {{ $t("views.tracking_landing.title") }}
      </h3>
      <h4 class="TrackingLanding__Subtitle">
        {{ $t("views.tracking_landing.subtitle") }}
        <strong class="text-theme">{{
          $t("views.tracking_landing.subtitle_strong")
        }}</strong>
      </h4>
      <p class="TrackingLanding__Description">
        {{ $t("views.tracking_landing.description") }}
      </p>
      <Error v-if="error" :errorPath="error" />
      <div class="TrackingLanding__Action_Container">
        <form @submit="lookupBallot">
          <input
            :disabled="disabled"
            type="text"
            name="verification-code"
            id="verification-code"
            :placeholder="$t('views.tracking_landing.placeholder')"
            v-model="trackingCode"
            class="TrackingLanding__TrackingCode"
            data-1p-ignore
          />
          <AVButton
            :label="$t('views.tracking_landing.button')"
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
              <span>{{ $t("views.tracking_landing.tooltip_helper") }}</span>
              <span :aria-label="$t('views.tracking_landing.tooltip_text')">
              </span>
            </template>

            <template #content>
              <span id="tracking-code-tooltip">
                {{ $t("views.tracking_landing.tooltip_text") }}
              </span>
            </template>
          </tooltip>
        </p>
      </div>
    </section>
    <aside class="TrackingLanding__Help">
      <h5 class="TrackingLanding__Help_Title">
        {{ $t("views.tracking_landing.help.title")
        }}<strong class="text-theme">{{
          $t("views.tracking_landing.help.title_strong")
        }}</strong>
      </h5>
      <div class="TrackingLanding__Help_Container">
        <div
          v-for="step in steps"
          :key="`verification-step-${step}`"
          class="TrackingLanding__Step"
        >
          <span class="TrackingLanding__Step_Index">{{ step }}</span>
          <p
            v-html="$t(`views.tracking_landing.help.steps.step_${step}`)"
            class="text-contrast"
          />
        </div>

        <div>
          <p class="text-contrast TrackingLanding__Bonus">
            <strong>{{ $t(`views.tracking_landing.help.bonus.title`) }}</strong>
          </p>
          <p class="text-contrast TrackingLanding__Bonus">
            {{ $t(`views.tracking_landing.help.bonus.description`) }}
          </p>
          <p class="text-contrast TrackingLanding__Bonus">
            {{ $t(`views.tracking_landing.help.bonus.q1`) }}
          </p>
          <p class="text-contrast TrackingLanding__Bonus">
            {{ $t(`views.tracking_landing.help.bonus.q2`) }}
          </p>
          <p class="text-contrast TrackingLanding__Bonus">
            {{ $t(`views.tracking_landing.help.bonus.q3`) }}
          </p>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.TrackingLanding__Container {
  display: flex;
  width: 100vw;
  height: calc(100vh - 118px);
}

.TrackingLanding__Action {
  width: 70%;
  padding: 5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.TrackingLanding__Icon {
  opacity: 0.05;
  font-size: 20rem;
  position: absolute;
  right: 3rem;
  top: 3rem;
}

.TrackingLanding__Action_Container {
  max-width: 32rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.TrackingLanding__Title {
  font-size: 3rem;
  font-weight: 600;
  color: var(--slate-900);
  margin-bottom: 2rem;
}
.TrackingLanding__Subtitle {
  color: var(--slate-700);
  font-size: 2.25rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.TrackingLanding__Description {
  color: var(--slate-700);
  margin-bottom: 3rem;
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

.TrackingLanding__Help {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
  background-color: var(--slate-100);
  padding: 0 6rem;
}

.TrackingLanding__Help_Title {
  font-size: 2rem;
  font-weight: 500;
  margin: 0 0 2rem 0;
  text-align: center;
}

.TrackingLanding__Help_Container {
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

.TrackingLanding__Bonus {
  align-self: flex-start;
  text-align: left;
  margin: 0;
}

@media only screen and (max-width: 1800px) {
  .TrackingLanding__Action {
    width: 60%;
  }
  .TrackingLanding__Help {
    width: 40%;
  }
}

@media only screen and (max-width: 1440px) {
  .TrackingLanding__Help {
    padding: 0 4rem;
  }

  .TrackingLanding__Help_Container {
    padding: 4rem 3rem;
    gap: 1rem;
  }
}

@media only screen and (max-width: 976px) {
  .TrackingLanding__Container {
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  }

  .TrackingLanding__Action {
    align-items: center;
    text-align: center;
    width: 100%;
    padding-bottom: 2rem;
  }

  .TrackingLanding__Icon {
    opacity: 1;
    font-size: 5rem;
    position: static;
  }

  .TrackingLanding__Help {
    width: 100%;
    padding-top: 2rem;
  }

  .TrackingLanding__Help_Container {
    margin-bottom: 3rem;
  }
}

@media only screen and (max-width: 768px) {
  .TrackingLanding__Title {
    margin: 1rem 0;
    font-size: 2.5rem;
  }

  .TrackingLanding__Subtitle {
    margin: 1rem 0;
    font-size: 1.75rem;
  }

  .TrackingLanding__Description {
    margin-bottom: 2rem;
  }

  .TrackingLanding__Help_Container {
    padding: 3rem 2rem;
  }

  .TrackingLanding__Help_Title {
    font-size: 1.5rem;
  }

  .TrackingLanding__Help_Footer {
    font-size: 1.5rem;
  }
}
</style>
