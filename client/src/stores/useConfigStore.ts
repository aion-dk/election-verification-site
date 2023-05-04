import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../lib/api";
import type { Election } from "../Types";
import type {
  ContestContent,
  LatestConfigItems,
  OptionContent,
} from "@aion-dk/js-client/dist/lib/av_client/types";

export default defineStore("useConfigStore", () => {
  const boardSlug = ref<string>(null);
  const latestConfig = ref<LatestConfigItems | null>(null);
  const election = ref<Election | null>(null);

  const setSlug = (newSlug: string) => {
    boardSlug.value = newSlug;
  };

  const setLatestConfig = (newConfig: LatestConfigItems) => {
    latestConfig.value = newConfig;
  };

  const setElection = (newElection: Election) => {
    election.value = newElection;
  };

  const getContest = (contestReference: string): ContestContent => {
    return latestConfig.value.contestConfigs[contestReference].content;
  };

  const getOption = (contestReference: string, optionReference: string): OptionContent => {
    const contest = getContest(contestReference);
    return contest.options.find(option => option.reference === optionReference)
  }

  const getContestOption = (
    contestReference: string,
    optionReference: string
  ): OptionContent => {
    return latestConfig.value.contestConfigs[
      contestReference
    ].content.options.find((o) => o.reference === optionReference);
  };

  const loadConfig = async (slug: string) => {
    if (boardSlug.value == slug) return;

    const { data } = await api.get(`${slug}/configuration/latest_config`);
    setSlug(slug);
    setLatestConfig({
      ...data.items,
    });
    setElection({
      ...latestConfig.value?.electionConfig.content,
      slug: boardSlug.value,
    });
  };

  return {
    latestConfig,
    boardSlug,
    election,
    loadConfig,
    getContest,
    getContestOption,
    getOption,
  };
});
