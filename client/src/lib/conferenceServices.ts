import axios from "axios";
import { ref } from "vue";
import { responseErrorHandler, responseHandler } from "./axiosConfig";
import config from "./config";

import type {
  ElectionStatusResponse,
  CurrentTranslations,
  SpreadableDLM,
} from "../Types";
import type { Locale } from "vue-i18n";
import type { AxiosInstance } from "axios";

const conferenceApi = ref<AxiosInstance>(
  axios.create({
    baseURL: config.conferenceUrl,
  }),
);

const currentTranslationsData = ref<CurrentTranslations>(null);

export function useConferenceConnector(
  organisationSlug: string,
  electionSlug: string,
) {
  conferenceApi.value.interceptors.response.use(
    responseHandler,
    responseErrorHandler,
  );

  return {
    conferenceClient: {
      async getStatus() {
        const status = await conferenceApi.value.get(
          `/${organisationSlug}/${electionSlug}/status`,
        );
        return (status as any).election as ElectionStatusResponse;
      },
      async getStylingData() {
        return (await conferenceApi.value.get(
          `/${organisationSlug}/${electionSlug}/theme`,
        )) as string;
      },
      async getTranslationsData(locale: Locale) {
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
          },
        };

        return evsTranslations;
      },
    },
  };
}
