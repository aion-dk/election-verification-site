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
  <h1>Error: Missing election identifier</h1>

  <p>
    To track your ballot or verify your vote, you must provide the election
    identifier.
  </p>

  <form @submit="submitForm">
    <input type="text" name="election-slug" v-model="_electionSlug" />

    <input type="submit" name="submit-election-slug" value="Continue" />
  </form>
</template>
