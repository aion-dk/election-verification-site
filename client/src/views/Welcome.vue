<script setup lang="ts">
import { useRoute } from "vue-router";
import useConfigStore from "../stores/useConfigStore";
import { ref, watch, onMounted } from "vue";
import useBallotStore from "../stores/useBallotStore";
import router from "../router";
import useLocaleStore from "../stores/useLocaleStore";
import useVerificationStore from "../stores/useVerificationStore";
import Error from "../components/Error.vue";

const localeStore = useLocaleStore();
const ballotStore = useBallotStore();
const configStore = useConfigStore();
const route = useRoute();
const _electionSlug = ref(route.params.electionSlug);
const _locale = ref(localeStore.locale);
const _title = ref("Loading..");
const _info = ref("Loading..");
const _trackingCode = ref(null);
const _verificationCode = ref(null);
const _error = ref(null);
const _disabled = ref(false);
const verificationStore = useVerificationStore();

function setInfo() {
  _title.value = configStore.election.title[_locale.value];
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
      `/${_locale.value}/${_electionSlug.value}/track/${_trackingCode.value}`
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

watch(route, (newRoute) => {
  _electionSlug.value = newRoute.params.electionSlug;
  _locale.value = newRoute.params.locale.toString();
  setInfo();
});

watch(configStore, () => {
  setInfo();
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
  verificationStore.setupAVVerifier(_electionSlug.value as string);

  setInfo();
  (
    document.querySelector(".Welcome__TrackingCode") as HTMLInputElement
  )?.focus();
});
</script>

<template>
  <div class="Welcome">
    <div class="Welcome__Header">
      <h1 class="Welcome__Title">
        <span>{{ _title }}</span>
        <small>{{ _info }}</small>
      </h1>
    </div>
    <Error v-if="_error" :errorPath="_error" />

    <div class="Welcome__Content">
      <AVCard class="Welcome__Tracking">
        <h3>{{ $t("views.welcome.about.header") }}</h3>
        <p>{{ $t("views.welcome.about.p1") }}</p>
        <p>{{ $t("views.welcome.about.p2") }}</p>

        <form @submit="lookupBallot">
          <input
            :disabled="_disabled"
            type="text"
            name="tracking-code"
            id="tracking-code"
            :placeholder="$t('views.welcome.tracking_code_input')"
            v-model="_trackingCode"
            class="Welcome__TrackingCode"
          />
          <AVButton
            :label="$t('views.welcome.track_ballot_button')"
            type="neutral"
            name="lookup-ballot"
            id="lookup-ballot"
            :disabled="_disabled || !_trackingCode"
            iconLeft
            fullWidth
            icon="magnifying-glass"
            @click="lookupBallot"
          />
        </form>

        <p class="Tooltip">
          <tooltip hover placement="bottom">
            <template #default>
              <span>{{ $t("views.welcome.locate_tracking_code") }}</span>
              <span
                :aria-label="$t('views.welcome.locate_tracking_code_tooltip')"
              >
                <font-awesome-icon icon="fa-solid fa-circle-question" />
              </span>
            </template>

            <template #content>
              <span id="tracking-code-tooltip">
                {{ $t("views.welcome.locate_tracking_code_tooltip") }}
              </span>
            </template>
          </tooltip>
        </p>
      </AVCard>
      <AVCard class="Welcome__Tracking">
        <h3>{{ $t("views.welcome.verify.header") }}</h3>
        <p>{{ $t("views.welcome.verify.p1") }}</p>
        <p>{{ $t("views.welcome.verify.p2") }}</p>

        <form @submit="initiateVerification">
          <input
            :disabled="_disabled"
            type="text"
            name="verification-code"
            id="verification-code"
            :placeholder="$t('views.welcome.verification_code_input')"
            v-model="_verificationCode"
            class="Welcome__TrackingCode"
            data-1p-ignore
          />
          <AVButton
            :label="$t('views.welcome.initiate_verification_button')"
            type="neutral"
            name="initiate-verification"
            id="initiate-verification"
            :disabled="_disabled || !_verificationCode"
            iconLeft
            fullWidth
            icon="fingerprint"
            @click="initiateVerification"
          />
        </form>

        <p class="Tooltip">
          <tooltip hover placement="bottom">
            <template #default>
              <span>{{ $t("views.welcome.locate_verification_code") }}</span>
              <span
                :aria-label="
                  $t('views.welcome.locate_verification_code_tooltip')
                "
              >
                <font-awesome-icon icon="fa-solid fa-circle-question" />
              </span>
            </template>

            <template #content>
              <span id="tracking-code-tooltip">
                {{ $t("views.welcome.locate_verification_code_tooltip") }}
              </span>
            </template>
          </tooltip>
        </p>
      </AVCard>
    </div>

    <div class="Welcome__Footer">
    </div>
  </div>
</template>

<style type="text/css" scoped>
.Welcome {
  font-family: "Open Sans";
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

.Welcome__Header {
  margin-bottom: 40px;
  margin-top: 40px;
}

.Welcome__Content {
  display: flex;
  margin-bottom: 2.5rem;
  gap: 2.5rem;


}

.AVCard {
  min-width: 50%;
}

.Welcome__Tracking {
  justify-content: center;
  min-width: 40%;
}

.Welcome__Footer {
  margin-top: 24px;
}

.Welcome__Widget {
  width: 100%;
}

.Welcome__Tracking form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
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

.Welcome__SubmitButton {
  box-sizing: border-box;
  width: 100%;
  background-color: #343a40;
  color: #fff;
  border: none;
  border-radius: 12px;
  height: 44px;
  line-height: 44px;
  margin-top: 16px;
  cursor: pointer;
  font-size: 16px;
}

.Welcome__SubmitButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

svg {
  margin-right: 5px;
  margin-left: 5px;
}


@media(max-width: 992px) {
  .Welcome__Content {
    flex-wrap: wrap;
    gap: var(--av-padding);
  }
}

</style>
