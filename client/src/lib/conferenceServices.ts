import axios from "axios";
import { ref } from "vue";
import { responseErrorHandler, responseHandler } from "./axiosConfig";
import config from "./config";

import type { ElectionStatusResponse } from "../Types";
import type { AxiosInstance } from "axios";

const conferenceApi = ref<AxiosInstance>(
  axios.create({
    baseURL: config.conferenceUrl,
  })
);

const currentTranslationsData: any = ref(null);

export function useConferenceConnector(slug: string) {
  const parsedSlug = slug.replace("_", "/");

  conferenceApi.value.interceptors.response.use(
    responseHandler,
    responseErrorHandler
  );

  return {
    conferenceClient: {
      async getStatus() {
        return (await conferenceApi.value.get(
          `/${parsedSlug}/status`
        )) as ElectionStatusResponse;
      },
      async getStylingData() {
        return (await conferenceApi.value.get(
          `/${parsedSlug}/theme`
        )) as string;
      },
      async getTranslationsData(locale: string) {
        if (!currentTranslationsData.value) {
          currentTranslationsData.value = await conferenceApi.value.get(
            `/${parsedSlug}/translations`
          );
        }

        return currentTranslationsData.value?.translations[locale].js
          .ballot_verification_site;
      },
    },
  };
}
