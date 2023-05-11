import type { AxiosResponse } from 'axios';
import { HttpError } from '../Types';
import httpErrorHandler from './httpErrorHandler';

declare module 'axios' {
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
      throw new HttpError('API Error. No data!');
    }
    return data;
  }

  if (response.status == 204) {
    return;
  }

  throw new HttpError('API Error! Invalid status code!');
};

export const responseErrorHandler = (response: AxiosResponse<any>) => {
  const config = response?.config;
  if (config.raw) {
    return response;
  }

  return httpErrorHandler(response);
};
