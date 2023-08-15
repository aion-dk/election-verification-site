import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {api} from "@/lib/api";
import type {Election, ElectionStatus, FullOptionContent} from "@/Types";
import type {ContestContent, LatestConfigItems, OptionContent,} from "@aion-dk/js-client/dist/lib/av_client/types";

export default defineStore("useConfigStore", () => {
  const boardSlug = ref<string>(null);
  const latestConfig = ref<LatestConfigItems | null>(null);
  const election = ref<Election | null>(null);
  const bcTimeout = computed(() => election.value?.content?.bcTimeout);
  const electionStatus = ref<ElectionStatus | null>(null);
  const electionTheme = ref<string>(null);

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

  const flattenChildren = (option: FullOptionContent, maxDepth=100) => {
    if(maxDepth <= 0) throw new Error("MAX RECURSION DEPTH FOR flattenChildren REACHED");

    const result = [option]
    if (option.children)
      result.push(...option.children.flatMap((children) => flattenChildren(children, maxDepth-1)));

    return result;
  };

  const getContestOption = (
    contestReference: string,
    optionReference: string
  ): OptionContent => {
    return latestConfig.value
      .contestConfigs[contestReference]
      .content
      .options
      .flatMap(option => flattenChildren(option))
      .find(option => option.reference === optionReference);
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

  const setElectionStatus = (newStatus: ElectionStatus) => {
    electionStatus.value = newStatus;
  };

  const setElectionTheme = (newTheme: string) => {
    electionTheme.value = newTheme;
  };

  return {
    latestConfig,
    boardSlug,
    election,
    loadConfig,
    getContest,
    getContestOption,
    bcTimeout,
    electionStatus,
    setElectionStatus,
    electionTheme,
    setElectionTheme,
  };
});
