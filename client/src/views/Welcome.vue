<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";
import { ref, watch, onMounted } from "vue";
import useBallotStore from "../stores/useBallotStore";
import router from "../router";
import useLocaleStore from "../stores/useLocaleStore";
import useVerificationStore from "../stores/useVerificationStore";
import Error from "../components/Error.vue";
import SplashScreen from "../components/SplashScreen.vue";
import i18n from "../lib/i18n";

const localeStore = useLocaleStore();
const ballotStore = useBallotStore();
const configStore = useConfigStore();
const _title = ref("Loading..");
const _info = ref("Loading..");
const _trackingCode = ref(null);
const _verificationCode = ref(null);
const _error = ref(null);
const _disabled = ref(false);
const verificationStore = useVerificationStore();
const electionTitle = ref("");

function setInfo() {
  _title.value = configStore.election.title[localeStore.locale];
  _info.value = [configStore.election.jurisdiction, configStore.election.state]
    .filter((s) => s)
    .join(", ");
}

async function lookupBallot(event: Event) {
  event.preventDefault();
  event.stopPropagation();
  _disabled.value = true;
  _error.value = null;

  if (_trackingCode.value && configStore.boardSlug) {
    await ballotStore.loadBallot(_trackingCode.value, configStore.boardSlug);
  }

  if (ballotStore.ballot?.status) {
    router.push(
      `/${localeStore.locale}/${configStore.boardSlug}/track/${_trackingCode.value}`
    );
  } else {
    _error.value = "track.invalid_code";
  }

  _disabled.value = false;
}

async function initiateVerification(event: Event) {
  event.preventDefault();
  event.stopPropagation();
  _disabled.value = true;
  _error.value = null;

  try {
    await verificationStore.findBallot(_verificationCode.value);

    verificationStore.generatePairingCode();

    setTimeout(async () => {
      if (verificationStore.pairingCode) return;

      await router.push({
        name: "BallotVerifierFound",
        params: {
          verificationCode: _verificationCode.value,
        },
      });
    }, 2000);
  } catch (e) {
    console.error(e);
    _disabled.value = false;
    _error.value = "verify.invalid_code";
  }
}

const splashImgUrl = ref(null);

watch(configStore, () => {
  setInfo();
  splashImgUrl.value = configStore.electionStatus?.theme?.splash;
  electionTitle.value = configStore.electionStatus.title[i18n.global.locale];
});

watch(verificationStore, async (newStore) => {
  if (!newStore.pairingCode) return;

  await router.push({
    name: "BallotVerifierView",
    params: {
      pairingCode: newStore.pairingCode,
    },
  });
});

onMounted(() => {
  verificationStore.reset();
  verificationStore.setupAVVerifier(configStore.boardSlug);

  setInfo();
  (
    document.querySelector(".Welcome__TrackingCode") as HTMLInputElement
  )?.focus();
});
</script>

<template>
  <div class="Welcome">
    <SplashScreen :image="splashImgUrl" />
    <Error v-if="_error" :errorPath="_error" />

    <div class="Welcome__Content">
      <div class="Welcome__Infobox bg-theme-transparent">
        <h1 class="Welcome__Title text-contrast">
          {{ $t("views.welcome.title") }}
        </h1>
        <h2 class="Welcome__Subtitle text-contrast">{{ electionTitle }}</h2>
        <p class="Welcome__Info text-contrast">
          {{ $t("views.welcome.description") }}
        </p>
      </div>

      <div class="Welcome__CTA">
        <AVCard class="Welcome__Card_Overrides">
          <h3>{{ $t("views.welcome.ballot_tester.title") }}</h3>
          <p>
            {{ $t("views.welcome.ballot_tester.subtitle") }}
            <span class="text-brand">{{
              $t("views.welcome.ballot_tester.subtitle_strong")
            }}</span>
          </p>
          <p>{{ $t("views.welcome.ballot_tester.description") }}</p>
          <form @submit="initiateVerification">
            <input
              :disabled="_disabled"
              type="text"
              name="verification-code"
              id="verification-code"
              :placeholder="$t('views.welcome.ballot_tester.placeholder')"
              v-model="_verificationCode"
              class="Welcome__TrackingCode"
              data-1p-ignore
            />
            <AVButton
              :label="$t('views.welcome.ballot_tester.button')"
              type="neutral"
              name="initiate-verification"
              id="initiate-verification"
              :disabled="_disabled || !_verificationCode"
              iconLeft
              fullWidth
              icon="fingerprint"
              @click="initiateVerification"
              class="Welcome__Button_Overrides"
            />
          </form>

          <p class="Tooltip">
            <tooltip hover placement="bottom">
              <template #default>
                <span>{{
                  $t("views.welcome.ballot_tester.tooltip_helper")
                }}</span>
                <span
                  :aria-label="$t('views.welcome.ballot_tester.tooltip_text')"
                >
                  <font-awesome-icon icon="fa-solid fa-circle-question" />
                </span>
              </template>

              <template #content>
                <span id="tracking-code-tooltip">
                  {{ $t("views.welcome.ballot_tester.tooltip_text") }}
                </span>
              </template>
            </tooltip>
          </p>
        </AVCard>

        <AVCard class="Welcome__Card_Overrides">
          <h3>{{ $t("views.welcome.ballot_tracker.title") }}</h3>
          <p>
            {{ $t("views.welcome.ballot_tracker.subtitle") }}
            <span class="text-brand">{{
              $t("views.welcome.ballot_tracker.subtitle_strong")
            }}</span>
          </p>
          <p>{{ $t("views.welcome.ballot_tracker.description") }}</p>
          <form @submit="lookupBallot">
            <input
              :disabled="_disabled"
              type="text"
              name="tracking-code"
              id="tracking-code"
              :placeholder="$t('views.welcome.ballot_tracker.placeholder')"
              v-model="_trackingCode"
              class="Welcome__TrackingCode"
            />
            <AVButton
              :label="$t('views.welcome.ballot_tracker.button')"
              type="neutral"
              name="lookup-ballot"
              id="lookup-ballot"
              :disabled="_disabled || !_trackingCode"
              iconLeft
              fullWidth
              icon="magnifying-glass"
              @click="lookupBallot"
              class="Welcome__Button_Overrides"
            />
          </form>

          <p class="Tooltip">
            <tooltip hover placement="bottom">
              <template #default>
                <span>{{
                  $t("views.welcome.ballot_tracker.tooltip_helper")
                }}</span>
                <span
                  :aria-label="$t('views.welcome.ballot_tracker.tooltip_text')"
                >
                  <font-awesome-icon icon="fa-solid fa-circle-question" />
                </span>
              </template>

              <template #content>
                <span id="tracking-code-tooltip">
                  {{ $t("views.welcome.ballot_tracker.tooltip_text") }}
                </span>
              </template>
            </tooltip>
          </p>
        </AVCard>
      </div>
    </div>
  </div>
</template>

<style type="text/css" scoped>
.Welcome {
  height: 100%;
  width: 100%;
}

.Welcome__Title {
  font-size: 32px;
  font-weight: 600;
  padding: 0;
  margin: 0;
  color: #212529;
}

.Welcome__Info {
  color: #6c757d;
  font-size: 26px;
  margin: 0;
  padding: 0;
  font-weight: 600;
}

.Welcome__Content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.Welcome__CTA {
  display: flex;
  align-content: center;
  justify-content: center;
  margin-top: -5rem;
}

.Welcome__Card_Overrides {
  box-sizing: border-box;
  padding: 3rem !important;
  width: 35%;
}

.Welcome__Card_Overrides:first-child {
  margin-right: 3%;
}

.Welcome__Button_Overrides {
  background-color: var(--av-theme-background) !important;
  border-color: var(--av-theme-background) !important;
  color: var(--av-theme-text) !important;
}

.Welcome__TrackingCode {
  color: #000;
  border: solid 1px #adb5bd;
  border-radius: 12px;
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  line-height: 44px;
  text-align: center;
  padding: 0 20px;
  font-size: 16px;
  margin-bottom: 1rem;
}

svg {
  margin-right: 5px;
  margin-left: 5px;
}

.Welcome__Infobox {
  border-top-right-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
  padding: 5rem 5rem 7rem 5rem;
  max-width: calc(73% - 18rem);
}

.Welcome__Title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 600;
}

.Welcome__Subtitle {
  margin: 0 0 1rem 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.Welcome__Info {
  margin: 0 0 2rem 0;
  font-size: 1.25rem;
  font-weight: 400;
}
</style>
