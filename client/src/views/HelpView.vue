<script setup lang="ts">
import ContentLayout from "../components/ContentLayout.vue";
import MainIcon from "../components/MainIcon.vue";
import ExpandableSection from "../components/ExpandableSection.vue";
import { onMounted, ref, watch } from "vue";
import i18n from "../lib/i18n";
import useLocaleStore from "../stores/useLocaleStore";

const localeStore = useLocaleStore();
const ballotTesterQuestions = ref(null);
const ballotTrackerQuestions = ref(null);
const logsQuestions = ref(null);
const otherQuestions = ref(null);
const currentQuestions = ref(null);
const currentTab = ref<Tabs>(null);

type Tabs = "tester" | "tracker" | "logs" | "other";

const switchTab = (newTab: Tabs) => {
  loadTab(newTab);
  currentTab.value = newTab;
};

const loadTab = (newTab: Tabs) => {
  if (newTab === "tester") currentQuestions.value = ballotTesterQuestions.value;
  if (newTab === "tracker")
    currentQuestions.value = ballotTrackerQuestions.value;
  if (newTab === "logs") currentQuestions.value = logsQuestions.value;
  if (newTab === "other") currentQuestions.value = otherQuestions.value;
};

const updateQuestions = (locale: string) => {
  ballotTesterQuestions.value = (
    i18n.global.getLocaleMessage(locale) as any
  ).views.faq.questions.ballot_tester;
  ballotTrackerQuestions.value = (
    i18n.global.getLocaleMessage(locale) as any
  ).views.faq.questions.ballot_tracker;
  logsQuestions.value = (
    i18n.global.getLocaleMessage(locale) as any
  ).views.faq.questions.logs;
  otherQuestions.value = (
    i18n.global.getLocaleMessage(locale) as any
  ).views.faq.questions.other;
};

watch(localeStore, async () => {
  updateQuestions(localeStore.locale);
  loadTab(currentTab.value);
});

onMounted(() => {
  updateQuestions(localeStore.locale);
  switchTab("tester");
});
</script>

<template>
  <ContentLayout
    :help-title="$t('views.faq.help.title')"
    :help-title-strong="$t('views.faq.help.title_strong')"
  >
    <template v-slot:action>
      <MainIcon icon="circle-question" />
      <h2 class="HelpView__Title">{{ $t("views.faq.title") }}</h2>
      <p class="HelpView__Description">{{ $t("views.faq.description") }}</p>

      <nav class="HelpView__Category_Navigation">
        <button
          :class="{
            HelpView__Category_Button: true,
            HelpView__Category_Button_Active: currentTab === 'tester',
          }"
          @click="switchTab('tester')"
        >
          <AVIcon
            icon="envelope-open-text"
            aria-hidden="false"
            class="HelpView__Category_Icon"
          />
          <span class="HelpView__Category_Label">{{
            $t("views.faq.navigation.ballot_tester")
          }}</span>
        </button>
        <button
          :class="{
            HelpView__Category_Button: true,
            HelpView__Category_Button_Active: currentTab === 'tracker',
          }"
          @click="switchTab('tracker')"
        >
          <AVIcon
            icon="magnifying-glass"
            aria-hidden="false"
            class="HelpView__Category_Icon"
          />
          <span class="HelpView__Category_Label">{{
            $t("views.faq.navigation.ballot_tracker")
          }}</span>
        </button>
        <button
          :class="{
            HelpView__Category_Button: true,
            HelpView__Category_Button_Active: currentTab === 'logs',
          }"
          @click="switchTab('logs')"
        >
          <AVIcon
            icon="square-poll-vertical"
            aria-hidden="false"
            class="HelpView__Category_Icon"
          />
          <span class="HelpView__Category_Label">{{
            $t("views.faq.navigation.logs")
          }}</span>
        </button>
        <button
          :class="{
            HelpView__Category_Button: true,
            HelpView__Category_Button_Active: currentTab === 'other',
          }"
          @click="switchTab('other')"
        >
          <AVIcon
            icon="flag"
            aria-hidden="false"
            class="HelpView__Category_Icon"
          />
          <span class="HelpView__Category_Label">{{
            $t("views.faq.navigation.other")
          }}</span>
        </button>
      </nav>

      <div class="HelpView__Divider" />

      <div class="HelpView__FAQ_Container">
        <ExpandableSection
          v-for="(question, index) in currentQuestions"
          :key="`${index}-${question.title}`"
          class="HelpView__FAQ"
        >
          <template v-slot:collapsed>
            <h3 class="HelpView__FAQ_Title">{{ question.title }}</h3>
          </template>

          <template v-slot:expanded>
            <h3 class="HelpView__FAQ_Title">{{ question.title }}</h3>
            <p
              v-for="(p, i) in question.paragraphs"
              :key="`${i}-${p}`"
              class="HelpView__FAQ_Text"
            >
              {{ p }}
            </p>
          </template>
        </ExpandableSection>
      </div>
    </template>
    <template v-slot:help>
      <p class="HelpView__Help_Description text-contrast">
        {{ $t("views.faq.help.p1") }}
      </p>
      <p class="HelpView__Help_Description text-contrast">
        {{ $t("views.faq.help.p2") }}
      </p>
      <p class="HelpView__Help_Description text-contrast">
        {{ $t("views.faq.help.p3") }}
      </p>
    </template>
  </ContentLayout>
</template>

<style type="text/css" scoped>
.HelpView__Title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--slate-800);
  margin: 0.5rem 0 1rem 0;
  text-align: center;
}

.HelpView__Description {
  color: var(--slate-700);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.HelpView__Help_Description {
  margin: 0 0 1.5rem 0;
}

.HelpView__Category_Navigation {
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 90;
}

.HelpView__Category_Button {
  background: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: none;
  padding: 0.5rem 2rem;
  margin: 0 0 1rem 0;
  cursor: pointer;
}

.HelpView__Category_Button_Active {
  font-weight: 600;
}

.HelpView__Category_Button:hover {
  font-weight: 600;
}

.HelpView__Category_Button:last-of-type {
  margin: 0;
}

.HelpView__Category_Icon {
  color: var(--av-theme-background);
  width: 2rem;
  height: 2rem;
  margin: 0 1rem 0 0;
}

.HelpView__Category_Label {
  color: var(--slate-800);
  font-size: 1.25rem;
}

.HelpView__Divider {
  width: 100%;
  height: 2px;
  background-color: var(--slate-300);
  margin: 2rem 0;
}

.HelpView__Help_Description:last-of-type {
  margin: 0;
}

.HelpView__FAQ_Container {
  width: 100%;
}

.HelpView__FAQ {
  width: 100%;
}

.HelpView__FAQ_Title {
  margin: 0;
  padding: 0 2rem 0 0;
  color: var(--slate-800);
  font-weight: 600;
  font-size: 1.125rem;
}

.HelpView__FAQ_Text {
  color: var(--slate-700);
}

.HelpView__FAQ_Text:last-of-type {
  margin-bottom: 0;
}

@media only screen and (min-width: 48rem) {
  .HelpView__Category_Navigation {
    flex-direction: row;
  }

  .HelpView__Category_Button {
    flex-direction: column;
    align-content: center;
    width: 25%;
  }

  .HelpView__Category_Icon {
    margin: 0 0 1rem 0;
  }

  .HelpView__Category_Label {
    text-align: center;
  }
}

@media only screen and (min-width: 80rem) and (min-height: 45rem) {
  .HelpView__Title {
    padding-top: 5rem;
    text-align: left;
  }

  .HelpView__Description {
    text-align: left;
    margin-bottom: 4rem;
  }

  .HelpView__Divider {
    margin: 3rem 0 4rem 0;
  }
}
</style>
