<script setup lang="ts">
import { useRoute } from "vue-router";
import useElectionStore from "../stores/useElectionStore";
import { ref, watch, onMounted } from "vue";
import Infobox from "../components/Infobox.vue";
import useBallotStore from "../stores/useBallotStore";
import router from "../router";
import useLocaleStore from "../stores/useLocaleStore";
import useAVVerifier from '@/lib/useAVVerifier'

const localeStore = useLocaleStore();
const ballotStore = useBallotStore();
const electionStore = useElectionStore();
const route = useRoute();
const _electionSlug = ref(route.params.electionSlug);
const _locale = ref(localeStore.locale);
const _title = ref("Loading..");
const _info = ref("Loading..");
const _trackingCode = ref(null);
const _verificationCode = ref(null);
const _error = ref(false);
const _disabled = ref(false);

function setInfo() {
  _title.value = electionStore.election?.content?.title[_locale.value];
  _info.value = [
    electionStore.election?.content?.jurisdiction,
    electionStore.election?.content?.state,
  ]
    .filter((s) => s)
    .join(", ");
}

async function lookupBallot(event: Event) {
  event.preventDefault();
  event.stopPropagation();
  _disabled.value = true;
  _error.value = false;

  if (_trackingCode.value && electionStore.election.slug) {
    await ballotStore.loadBallot(
      _trackingCode.value,
      electionStore.election.slug
    );
  }

  if (ballotStore.ballot?.status) {
    router.push(
      `/${_locale.value}/${_electionSlug.value}/track/${_trackingCode.value}`
    );
  } else {
    _error.value = true;
  }

  _disabled.value = false;
}

async function initiateVerification(event: Event) {
  event.preventDefault();
  event.stopPropagation();
  _disabled.value = true;
  _error.value = false;

  try {
    const avVerifier = await useAVVerifier(_electionSlug.value as string);
    const address = await avVerifier.findBallot(_verificationCode.value)
    console.log("verifying address:", address)
    await router.push({ name: "BallotVerifierView", params: { verificationCode: _verificationCode.value } })
  } catch(e) {
    // _error.value = "Your ballot could not be found";
  } finally {
    _disabled.value = false;
  }
}

watch(route, (newRoute) => {
  _electionSlug.value = newRoute.params.electionSlug;
  _locale.value = newRoute.params.locale as string;
  setInfo();
});

watch(electionStore, () => {
  setInfo();
});

onMounted(() => {
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

    <div v-if="_error" class="Welcome__Error" role="alert">
      <p class="title">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />
        {{ $t("views.welcome.error.title") }}
      </p>

      <p>{{ $t("views.welcome.error.content") }}</p>
    </div>

    <div class="Welcome__Content">
      <Infobox class="Welcome__About">
        <h3>{{ $t("views.welcome.about.header") }}</h3>
        <p>{{ $t("views.welcome.about.p1") }}</p>
        <p>{{ $t("views.welcome.about.p2") }}</p>
      </Infobox>

      <Infobox class="Welcome__Tracking">
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

          <button
            class="Welcome__SubmitButton"
            type="submit"
            :disabled="_disabled"
            name="lookup-ballot"
            id="lookup-ballot"
            @click="lookupBallot"
          >
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            <span>
              {{ $t("views.welcome.track_ballot_button") }}
            </span>
          </button>
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
      </Infobox>
    </div>

    <div class="Welcome__Content">
      <Infobox class="Welcome__About">
        <h3>{{ $t("views.welcome.about.header") }}</h3>
        <p>{{ $t("views.welcome.about.p1") }}</p>
        <p>{{ $t("views.welcome.about.p2") }}</p>
      </Infobox>

      <Infobox class="Welcome__Tracking">
        <form @submit="initiateVerification">
          <input
            :disabled="_disabled"
            type="text"
            name="verification-code"
            id="verification-code"
            :placeholder="$t('views.welcome.verification_code_input')"
            v-model="_verificationCode"
            class="Welcome__VerificationCode"
          />

          <button
            class="Welcome__SubmitButton"
            type="submit"
            :disabled="_disabled"
            name="initiate-verification"
            id="initiate-verification"
            @click="initiateVerification"
          >
            <font-awesome-icon icon="fa-solid fa-fingerprint" />
            <span>
              {{ $t("views.welcome.initiate_verification_button") }}
            </span>
          </button>
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
      </Infobox>
    </div>

    <div class="Welcome__Footer">
      <p class="Tooltip">
        <tooltip hover placement="right">
          <template #default>
            <span>{{ $t("views.welcome.footer") }}</span>
            <span :aria-label="$t('views.welcome.footer_tooltip')">
              <font-awesome-icon icon="fa-solid fa-circle-info" />
            </span>
          </template>

          <template #content>
            <span>
              {{ $t("views.welcome.footer_tooltip") }}
            </span>
          </template>
        </tooltip>
      </p>
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
  margin-bottom: 60px;
  margin-top: 120px;
}

.Welcome__Content {
  display: flex;
  margin-bottom: 40px;
}

.Welcome__About {
  margin-right: 40px;
  flex-shrink: 1;
}

.Welcome__Footer {
  margin-top: 24px;
}

.Welcome__Widget {
  width: 100%;
}

.Welcome__Tracking {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  min-width: 480px;
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

.Welcome__Error {
  background-color: #fcede9;
  border: none;
  border-left: solid 6px #ea4e2c;
  padding: 17px 36px;
  margin-bottom: 40px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
}

.Welcome__Error p.title {
  font-weight: 700;
  font-size: 18px;
  color: #495057;
}

svg {
  margin-right: 5px;
  margin-left: 5px;
}
</style>
