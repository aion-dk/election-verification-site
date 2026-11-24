import axios from "axios";
import { ref } from "vue";
import { responseErrorHandler, responseHandler } from "./axiosConfig";
import config from "./config";

import type {
  ExtendedElectionStatusResponse,
  CurrentTranslations,
  SpreadableDLM,
  SupportedLocale,
  PublishedResult,
} from "../Types";
import type { AxiosInstance } from "axios";

const conferenceApi = ref<AxiosInstance>(
  axios.create({
    baseURL: config.conferenceUrl,
  }),
);

const currentTranslationsData = ref<CurrentTranslations>(null);
let interceptorAttached = false;

export function useConferenceConnector(
  organisationSlug: string,
  electionSlug: string,
) {
  if (!interceptorAttached) {
    conferenceApi.value.interceptors.response.use(
      responseHandler,
      responseErrorHandler,
    );
    interceptorAttached = true;
  }

  return {
    conferenceClient: {
      async getStatus() {
        const status = await conferenceApi.value.get(
          `/${organisationSlug}/${electionSlug}/status`,
        );
        return (status as any).election as ExtendedElectionStatusResponse;
      },
      async getStylingData() {
        return conferenceApi.value.get<string>(
          `/${organisationSlug}/${electionSlug}/theme`,
        );
      },
      async getTranslationsData(locale: SupportedLocale) {
        if (!currentTranslationsData.value) {
          currentTranslationsData.value = await conferenceApi.value.get(
            `/${organisationSlug}/${electionSlug}/translations`,
          );
        }

        const evsTranslations = {
          ...(currentTranslationsData.value?.translations[locale].js
            .election_verification_site as SpreadableDLM),
          js: {
            components: {
              ...(currentTranslationsData.value?.translations[locale].js
                .components as SpreadableDLM),
            },
            accessibility: {
              ...(currentTranslationsData.value?.translations[locale].js
                .accessibility as SpreadableDLM),
            },
          },
        };

        return evsTranslations;
      },
      async getPublishedResults() {
        return (await conferenceApi.value.get(
          `/${organisationSlug}/${electionSlug}/published_results`,
        )) as unknown as PublishedResult[];
      },
      async getResultsPublished() {
        const response = await conferenceApi.value.get(
          `/${organisationSlug}/${electionSlug}/results_published`,
        );
        return (response as any).resultsPublished as boolean;
      },
    },
  };
}
