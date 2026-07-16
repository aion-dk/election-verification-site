import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { api } from "@/lib/api";
import type {
  ElectionConfigContent,
  BasicElectionStatus,
  OptionContent,
  ContestContent,
  LatestConfigItems,
} from "@/Types";

export default defineStore("useConfigStore", () => {
  const boardSlug = ref<string>(null);
  const latestConfig = ref<LatestConfigItems | null>(null);
  const election = ref<ElectionConfigContent | null>(null);
  const bcTimeout = computed(() => election.value?.bcTimeout);
  const electionStatus = ref<BasicElectionStatus | null>(null);
  const electionTheme = ref<string>(null);
  const resultsPublished = ref<boolean>(false);
  const resultsPublishedLoaded = ref<boolean>(false);
  const pageRefreshIterator = ref<number>(0);

  const setBoardSlug = (newBoardSlug: string) => {
    boardSlug.value = newBoardSlug;
  };

  const setLatestConfig = (newConfig: LatestConfigItems) => {
    latestConfig.value = newConfig;
  };

  const setElection = (newElection: ElectionConfigContent) => {
    election.value = newElection;
  };

  const getContest = (contestReference: string): ContestContent => {
    return latestConfig.value.contestConfigs[contestReference].content;
  };

  const flattenChildren = (option: OptionContent, maxDepth = 100) => {
    if (maxDepth <= 0)
      throw new Error("MAX RECURSION DEPTH FOR flattenChildren REACHED");

    const result = [option];
    if (option.children)
      result.push(
        ...option.children.flatMap((children) =>
          flattenChildren(children, maxDepth - 1),
        ),
      );

    return result;
  };

  const getContestOption = (
    contestReference: string,
    optionReference: string,
  ): OptionContent => {
    return latestConfig.value.contestConfigs[contestReference].content.options
      .flatMap((option) => flattenChildren(option))
      .find((option) => option.reference === optionReference);
  };

  const loadConfig = async () => {
    const { data } = await api.get(
      `${boardSlug.value}/configuration/latest_config`,
    );

    setLatestConfig({
      ...data.items,
    });
    setElection({ ...latestConfig.value?.electionConfig.content });
  };

  const setElectionStatus = (newStatus: BasicElectionStatus) => {
    electionStatus.value = newStatus;
  };

  const setElectionTheme = (newTheme: string) => {
    electionTheme.value = newTheme;
  };

  const setResultsPublished = (value: boolean) => {
    resultsPublished.value = value;
    resultsPublishedLoaded.value = true;
  };

  const pageReloaded = () => pageRefreshIterator.value++;

  const usesElectionCommittee = computed((): boolean => {
    return latestConfig.value.genesisConfig.content.electionCommittee ?? false;
  });

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
    resultsPublished,
    resultsPublishedLoaded,
    setResultsPublished,
    setBoardSlug,
    pageRefreshIterator,
    pageReloaded,
    usesElectionCommittee,
  };
});
