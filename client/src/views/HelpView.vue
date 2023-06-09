<script setup lang="ts">
// import CompactHeader from "../components/CompactHeader.vue";
import ExpandableSection from "../components/ExpandableSection.vue";
import useConfigStore from "../stores/useConfigStore";
import useLocaleStore from "../stores/useLocaleStore";

const configStore = useConfigStore();
const localeStore = useLocaleStore();
</script>

<template>
  <main class="HelpView">
    <!-- <CompactHeader
      :election="configStore.election"
      :locale="localeStore.locale"
    /> -->

    <div class="HelpView__Header">
      <h2 class="HelpView__Title">{{ $t("views.help.title") }}</h2>
      <p class="HelpView__Info">{{ $t("views.help.info") }}</p>
    </div>

    <ExpandableSection class="HelpView__FAQ">
      <template v-slot:collapsed>
        <h3>I'm missing my ballot tracking code</h3>
      </template>

      <template v-slot:expanded>
        <h3>I'm missing my ballot tracking code</h3>
        <p>Hello there...</p>
      </template>
    </ExpandableSection>

    <ExpandableSection class="HelpView__FAQ">
      <template v-slot:collapsed>
        <h3>About Ballot Statuses</h3>
      </template>

      <template v-slot:expanded>
        <h3>About Ballot Statuses</h3>

        <p>
          <strong>Ballot Received</strong> - Your ballot has been received in
          the digital ballot box and is awaiting signature verification by local
          election officials.
        </p>

        <p>
          <strong>Ballot Accepted</strong> - Your signature affidavit has been
          verified and your ballot is accepted for counting.
        </p>

        <p>
          <strong>Ballot Not Accepted</strong> - There is a problem with your
          signature affidavit. Contact your local election official for next
          steps and to cure your affidavit.
        </p>

        <p>
          <strong>Ballot Printed for Counting</strong> - Your ballot has been
          extracted from the digital ballot box and decrypted offline. It has
          been printed onto a paper ballot for scanning and tabulation with
          other absentee ballots.
        </p>
      </template>
    </ExpandableSection>
  </main>
</template>

<style type="text/css" scoped>
.HelpView {
  font-family: "Open Sans";
}

.HelpView__Header {
  text-align: center;
}

.HelpView__Title {
  font-size: 26px;
  font-weight: 600;
}

.HelpView__Info {
  font-weight: 400;
  font-size: 16px;
}

.HelpView__FAQ h3 {
  margin: 0;
  padding: 0;
}
</style>
