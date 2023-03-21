import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../lib/api";
import type { Election } from "../Types";

export default defineStore("useElectionStore", () => {
  const election = ref<Election>({});

  const setElection = (newElection: Election) => {
    election.value = newElection;
  };

  const loadElection = async (slug: string) => {
    if (election.value && election.value.slug == slug) return;

    const { data } = await api.get(`${slug}/configuration/latest_config`);
    setElection({
      ...data.items.electionConfig,
      slug: slug,
    });
  };

  return { election, setElection, loadElection };
});
