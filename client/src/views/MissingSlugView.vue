<script lang="ts" setup>
import { ref } from "vue";
import router from "../router";
import { useRoute } from "vue-router";

const route = useRoute();
const _electionSlug = ref(null);

function submitForm(event: Event) {
  event.preventDefault();
  event.stopPropagation();
  router.push(`/${route.params.locale}/${_electionSlug.value}`);
}
</script>

<template>
  <h1 id="missing-slug-title">Error: Missing election identifier</h1>

  <p id="missing-slug-description">
    To track your ballot or verify your vote, you must provide the election
    identifier.
  </p>

  <form @submit="submitForm" id="missing-slug-form">
    <input type="text" name="election-slug" id="election-slug" v-model="_electionSlug" />

    <input type="submit" name="submit-election-slug" id="submit-election-slug" value="Continue" />
  </form>
</template>
