<script setup lang="ts">
import CompactHeader from "../components/CompactHeader.vue";
import useConfigStore from "../stores/useConfigStore";
import useLocaleStore from "../stores/useLocaleStore";

const configStore = useConfigStore();
const localeStore = useLocaleStore();
</script>

<template>
  <main class="AboutView">
    <CompactHeader
      :election="configStore.election"
      :locale="localeStore.locale"
    />

    <div class="AboutView__Header">
      <h2>About this website</h2>
      <p>
        This site gives voters the ability to independently verify that their
        ballot is recorded, received, and counted correctly. All activity in the
        VoteHub digital ballot box is viewable and auditable so the public can
        independently verify the results of the election are correct.
      </p>
    </div>

    <hr />

    <div class="AboutView__Content">
      <h2>Ballot tracker</h2>
      <p>
        Voters can use this tab to verify their ballot was received correctly in
        the VoteHub digital ballot box. Voters can also track when their
        signature affidavit is verified and when their ballot is decrypted and
        printed offline for counting. Voters cannot view or change their ballots
        after they have been submitted, and the site does not ask for or reveal
        any information about the voter's identity.
      </p>

      <h2>Election Configuration Log</h2>
      <p>
        The public can use this tab to view and audit all activity connected to
        the election configuration and backend activities.
      </p>

      <h2>Election Activity Log</h2>
      <p>
        The public can use this tab to view and audit all activity in the
        VoteHub digital ballot box.
      </p>
    </div>
  </main>
</template>

<style type="text/css" scoped>
.AboutView {
  width: 900px;
  margin: auto;
  font-family: "Open Sans";
}

.AboutView__Header * {
  text-align: center;
}

.AboutView hr {
  margin: 47px 0;
}

.AboutView h2 {
  margin-top: 47px;
  font-weight: 600;
  font-size: 26px;
}

.AboutView .AboutView__Content h2 {
  margin-top: 53px;
  font-weight: 600;
  font-size: 24px;
}

.AboutView p {
  margin-top: 16px;
}
</style>
