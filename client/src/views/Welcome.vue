<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";
import i18n from "../lib/i18n";
import router from "../router";
import { useRoute } from "vue-router";

const configStore = useConfigStore();
const route = useRoute();

const goToVerifier = () => {
  router.push(
    `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}/verify`,
  );
};
const goToTracker = () => {
  router.push(
    `/${i18n.global.locale}/${route.params.organisationSlug}/${route.params.electionSlug}/track`,
  );
};
</script>

<template>
  <div class="Welcome">
    <div class="Welcome__Description_Desktop">
      <div class="Welcome__Description_Desktop_Container">
        <h1 class="Welcome__Description_Desktop_Title">
          {{ $t("views.welcome.title") }}
        </h1>
      </div>

      <div class="Welcome__Description_Desktop_Container">
        <h2 class="Welcome__Description_Desktop_Subtitle">
          {{ configStore.election.title[$i18n.locale] }}
        </h2>

        <p class="Welcome__Description_Desktop_About">
          {{ $t("views.welcome.description") }}
        </p>
      </div>
    </div>

    <div class="Welcome__Gradient theme-gradient">
      <img
        v-if="configStore.electionStatus?.theme?.splash"
        :src="configStore.electionStatus?.theme?.splash"
        :alt="$t('views.welcome.splash_alt')"
        class="Welcome__Splash"
        loading="lazy"
        aria-hidden="true"
      />
    </div>

    <section id="main_content" class="Welcome__Content">
      <div class="Welcome__Heading_Content">
        <div
          class="Welcome__Card Welcome__Card_Overrides Welcome__Card_Desktop"
        >
          <div class="Welcome__Card_Item">
            <AVIcon
              icon="envelope-open-text"
              class="Welcome__Card_Icon"
              aria-hidden="true"
            />
            <div>
              <h3 class="Welcome__Card_Title">
                {{ $t("views.welcome.ballot_tester.title") }}
              </h3>
              <p class="Welcome__Card_Description">
                {{ $t("views.welcome.ballot_tester.description") }}
              </p>
              <button
                class="btn btn-theme w-100 rounded-3 Welcome__Button"
                type="button"
                name="test-ballot"
                id="test-ballot"
                @click="goToVerifier"
              >
                {{ $t("views.welcome.ballot_tester.button") }}
              </button>
            </div>
          </div>

          <div class="Welcome__Card_Line" />

          <div class="Welcome__Card_Item">
            <AVIcon
              icon="magnifying-glass"
              class="Welcome__Card_Icon"
              aria-hidden="true"
            />
            <div>
              <h3 class="Welcome__Card_Title">
                {{ $t("views.welcome.ballot_tracker.title") }}
              </h3>
              <p class="Welcome__Card_Description">
                {{ $t("views.welcome.ballot_tracker.description") }}
              </p>
              <button
                class="btn btn-theme w-100 rounded-3 Welcome__Button"
                type="button"
                name="track-ballot"
                id="track-ballot"
                @click="goToTracker"
              >
                {{ $t("views.welcome.ballot_tracker.button") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="Welcome__About">
      <h4 class="Welcome__About_Title">
        {{ $t("views.welcome.about.title") }}
      </h4>
      <div class="Welcome__Card Welcome__Description">
        <p>{{ $t("views.welcome.description") }}</p>
      </div>
      <div>
        <div class="Welcome__Card Welcome__Card_Overrides">
          <h5 class="Welcome__About_Subtitle">
            {{ $t("views.welcome.about.ballot_tester") }}
          </h5>
          <p class="Welcome__About_Description">
            {{ $t("views.welcome.about.ballot_tester_text") }}
          </p>
        </div>
        <div class="Welcome__Card Welcome__Card_Overrides">
          <h5 class="Welcome__About_Subtitle">
            {{ $t("views.welcome.about.ballot_tracker") }}
          </h5>
          <p class="Welcome__About_Description">
            {{ $t("views.welcome.about.ballot_tracker_text") }}
          </p>
        </div>
        <div class="Welcome__Card Welcome__Card_Overrides">
          <h5 class="Welcome__About_Subtitle">
            {{ $t("views.welcome.about.audit_log") }}
          </h5>
          <p class="Welcome__About_Description">
            {{ $t("views.welcome.about.audit_log_text") }}
          </p>
        </div>
      </div>

      <img
        v-if="configStore.electionStatus?.theme?.logo"
        class="Welcome__Brand_Logo"
        :src="configStore.electionStatus?.theme?.logo"
        :alt="$t('header.election_logo_alt')"
      />
    </section>
  </div>
</template>

<style type="text/css" scoped>
.Welcome {
  height: calc(100dvh - 70px);
  width: 100%;
  overflow-y: auto;
}

.Welcome__Card {
  background-color: white;
  border: solid 1px var(--bs-gray-200);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  box-sizing:;
  box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.05);
}

.Welcome__Gradient {
  width: 100%;
  height: 22rem;
  position: absolute;
  z-index: -20;
}

.Welcome__Splash {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.Welcome__Content {
  padding: 0 2rem;
  margin: 10rem 0 3rem 0;
}

.Welcome__Card_Overrides {
  padding: 2rem !important;
  align-items: center;
  margin: 0 0 2rem 0;
}

.Welcome__Card_Item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.Welcome__Card_Line {
  width: 60%;
  border-radius: 99px;
  height: 0.25rem;
  background-color: var(--bs-gray-300);
  margin: 3rem 0;
}

.Welcome__Card_Icon {
  width: 5.75rem;
  height: 5.75rem;
  color: var(--av-theme-background);
}

.Welcome__Card_Title {
  font-weight: 600;
  font-size: 1.5rem;
  color: var(--bs-gray-800);
  margin: 1rem 0;
  text-align: center;
}

.Welcome__Card_Description {
  margin: 0 0 1.5rem 0;
  color: var(--bs-gray-700);
  text-align: center;
}

.Welcome__Button {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

.Welcome__Description {
  padding: 2rem;
  background-color: white;
  color: var(--bs-gray-700);
  text-align: center;
  margin-bottom: 2rem;
  width: 100%;
}

.Welcome__Description_Desktop {
  display: none;
}

.Welcome__About {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 2rem;
}

.Welcome__About_Title {
  color: var(--bs-gray-800);
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0.5rem 0 2rem 0;
}

.Welcome__About_Subtitle {
  color: var(--bs-gray-700);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.Welcome__About_Description {
  color: var(--bs-gray-700);
  margin: 0;
  text-align: center;
}

.Welcome__Brand_Logo {
  display: block;
  width: 40%;
  height: auto;
  margin-bottom: 3rem;
}

@media only screen and (min-width: 48rem) {
  .Welcome__Card_Line {
    width: 80%;
    margin: 6rem 0;
  }

  .Welcome__Button {
    margin-bottom: 1.25rem;
  }

  .Welcome__Brand_Logo {
    width: 30%;
  }

  .Welcome__Brand_Logo {
    display: none;
  }

  .Welcome__Card_Desktop {
    flex-direction: row !important;
    justify-content: space-evenly;
  }

  .Welcome__Card_Line {
    width: 0.25rem;
    height: 16rem;
    margin: 0 3rem;
  }
}

@media only screen and (min-width: 80rem) {
  .Welcome__Description_Desktop {
    padding: 5rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: white;
  }

  .Welcome__Description {
    display: none !important;
  }

  .Welcome__Description_Desktop_Container {
    display: flex;
  }

  .Welcome__Description_Desktop_Container:last-of-type > * {
    width: 50%;
  }

  .Welcome__Description_Desktop_Title {
    font-size: 3rem;
    font-weight: 600;
    color: var(--bs-gray-800);
    margin: 0;
  }

  html[dir="ltr"] .Welcome__Description_Desktop_Title,
  html[dir="ltr"] .Welcome__Description_Desktop_Subtitle {
    padding: 0 0 0 5rem;
  }

  html[dir="rtl"] .Welcome__Description_Desktop_Title,
  html[dir="rtl"] .Welcome__Description_Desktop_Subtitle {
    padding: 0 5rem 0 0;
  }

  .Welcome__Description_Desktop_Subtitle {
    font-size: 2rem;
    font-weight: 600;
    color: var(--bs-gray-600);
    margin: 0;
  }

  .Welcome__Description_Desktop_About {
    color: var(--bs-gray-700);
    margin: 0;
    padding: 0 5rem 0 0;
  }

  .Welcome__Gradient {
    position: relative;
    margin-bottom: -18rem;
  }

  .Welcome__Heading_Content {
    padding: 0 8rem;
  }

  .Welcome__Card_Item {
    flex-direction: row;
    flex-grow: 2;
    justify-content: space-evenly;
  }

  .Welcome__Card_Item div {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 16rem;
  }

  .Welcome__Card_Line {
    height: 10rem;
  }

  html[dir="ltr"] .Welcome__Card_Icon {
    margin: 0 3rem 0 0;
  }

  html[dir="rtl"] .Welcome__Card_Icon {
    margin: 0 0 0 3rem;
  }

  .Welcome__About div {
    display: flex;
    margin: 0 1rem 3rem 1rem;
    padding: 0 6rem;
  }
}

@media only screen and (min-width: 120rem) {
  .Welcome__Description_Desktop {
    padding: 8rem 20rem;
  }

  .Welcome__About div {
    margin: 0 1rem 0 1rem;
    padding: 0 20rem 5rem 20rem;
  }

  .Welcome__Card_Desktop {
    margin: 0 14rem;
  }

  .Welcome__Card_Icon {
    width: 8rem;
    height: 8rem;
  }

  .Welcome__Card_Title {
    font-size: 2rem;
  }

  .Welcome__Card_Description {
    font-size: 1.25rem;
  }

  .Welcome__Card_Item div {
    max-width: 40rem;
  }

  .Welcome__Button {
    font-size: 1.25rem !important;
  }

  .Welcome__About_Title {
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }

  .Welcome__About_Subtitle {
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }

  .Welcome__About_Description {
    font-size: 1.25rem;
  }

  .Welcome__Description_Desktop_About {
    font-size: 1.25rem;
  }
}
</style>
