<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";
import router from "../router";
import { useRoute } from "vue-router";
const route = useRoute();
import { onMounted, ref, watch } from "vue";
import useVerificationStore from "../stores/useVerificationStore";
import TrackedBallotManager from "../components/TrackedBallotManager.vue";
import ContentLayout from "@/components/ContentLayout.vue";
import MainIcon from "@/components/MainIcon.vue";
import i18n from '@/lib/i18n'

const verificationStore = useVerificationStore();
const configStore = useConfigStore();
const error = ref(null);
const disabled = ref(false);
const steps = [1, 2, 3, 4, 5];
const verificationCode = ref(null);

async function checkForPairingCode(store: any) {
  if (!store.pairingCode) return;

  await router.push({
    name: "BallotVerifierView",
    params: {
      pairingCode: store.pairingCode,
    },
  });
}

const cancel = () => {
  router.push(`/${i18n.global.locale}/${configStore.boardSlug}/verify`);
};

watch(verificationStore, async (store) => {
  await checkForPairingCode(store);
});

onMounted(async () => {
  verificationCode.value = route.params.verificationCode.toString()
  if(!verificationStore.ballot) {

    try {
      verificationStore.reset();
      await verificationStore.setupAVVerifier(configStore.boardSlug);

      await verificationStore.findBallot(verificationCode.value);

      verificationStore.generatePairingCode();

    } catch (e) {
      console.error(e);
      disabled.value = false;
      await router.push({
        name: "BallotVerificationLanding",
      });
      error.value = "verify.invalid_code";
    }
  }

  await checkForPairingCode(verificationStore);
});
</script>

<template>
  <div class="VerificationFound"  aria-flowto="tracking-code">
    <ContentLayout
      :help-title="$t('views.verification.help.title')"
      :help-title-strong="$t('views.verification.help.title_strong')"
      :logo="configStore.electionStatus?.theme?.logo"
      :breadcrumb="`${$t('header.verification')} / ${$t('breadcrumbs.ballot_found')}` "

    >
      <template v-slot:action>
        <TrackedBallotManager
          :tracking-code="verificationCode"
          @cancel="cancel"
        />

        <MainIcon icon="envelope-open-text" />
        <h3 class="VerificationFound__Title">
          {{ $t("views.verifier.found.title") }}
        </h3>
        <p class="VerificationFound__Description">
          {{ $t("views.verifier.found.description") }}
        </p>
        <Error v-if="error" :errorPath="error" />
      </template>
      <template v-slot:help>
        <div
          v-for="step in steps"
          :key="`verification-step-${step}`"
          class="VerificationFound__Step"
        >
          <span class="VerificationFound__Step_Index">{{ step }}</span>
          <p
            v-html="$t(`views.verification.help.steps.step_${step}`)"
            class="VerificationFound__Step_Text text-contrast"
          />
        </div>
        <span class="VerificationFound__Help_Footer text-contrast">{{
            $t(`views.verification.help.footer`)
          }}</span>
      </template>
    </ContentLayout>
  </div>
´
</template>

<style scoped>
.VerificationFound {
  width: 100vw;
  height: 100%;
}


.VerificationFound__Title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--slate-800);
  margin: 0 0 1rem 0;
  font-weight: 800;
}

.VerificationFound__Description {
  margin: 0 0 2rem 0;
  line-height: 2rem;
  color: var(--slate-700);
  text-align: center;
}

.VerificationFound__Description {
  color: var(--slate-700);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.VerificationFound__Step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.VerificationFound__Step_Index {
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

.VerificationFound__Help_Footer {
  font-size: 1.5rem;
}

@media only screen and (min-width: 80rem) {
  .VerificationFound__Title {
    text-align: left;
    font-size: 3.5rem;
    margin-bottom: 2.5rem;
  }

  .VerificationFound__Description {
    text-align: left;
  }

  .VerificationFound__Description {
    margin-bottom: 3rem;
    text-align: left;
  }

  .VerificationFound__Help_Footer {
    font-size: 1.75rem;
  }

  .VerificationFound__Step_Index {
    width: 1.75rem;
    height: 1.75rem;
  }

  .VerificationFound__Step_Text {
    margin: 1rem 0 0.5rem 0;
  }
}

@media only screen and (min-width: 120rem) {
  .VerificationFound__Help_Footer {
    font-size: 2.25rem;
  }

  .VerificationFound__Step_Index {
    width: 2rem;
    height: 2rem;
  }

  .VerificationFound__Step_Text {
    margin: 2rem 0 1rem 0;
    font-size: 1.2rem;
  }

}
</style>
