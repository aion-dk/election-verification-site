import type { AxiosError, AxiosResponse } from "axios";
import { HttpError } from "../Types";
import httpErrorHandler from "./httpErrorHandler";

declare module "axios" {
  export interface AxiosRequestConfig {
    raw?: boolean;
    silent?: boolean;
    useNotification?: boolean;
  }
}

export const responseHandler = (response: AxiosResponse<any>) => {
  const config = response?.config;
  if (config.raw) {
    return response;
  }
  if (response.status == 200) {
    const data = response?.data;
    if (!data) {
      throw new HttpError("API Error. No data!");
    }
    return data;
  }

  if (response.status == 204) {
    return;
  }

  throw new HttpError("API Error! Invalid status code!");
};

// Axios calls the rejection handler with an AxiosError (or another error),
// not with a response. Raw requests resolve with the error's response so the
// caller can inspect the status itself.
export const responseErrorHandler = (error: AxiosError<any>) => {
  if (error?.config?.raw) {
    return error.response;
  }

  return httpErrorHandler(error);
};
