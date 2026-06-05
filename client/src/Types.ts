export type * from "@assemblyvoting/types";
import type { ElectionStatusResponse } from "@assemblyvoting/types";
import type { DefineLocaleMessage, Locale } from "vue-i18n";

declare module "@assemblyvoting/types" {
  interface VotingPortal {
    tabName?: Record<string, string>;
    faviconUrl?: string;
  }

  interface BasicElectionStatus {
    votingPortal?: VotingPortal;
  }
}

export interface EVSBallot {
  activities: string[];
  trackingCode: string;
  status: string;
}

export interface Meta {
  current_page?: number;
  next_page?: number;
  prev_page?: number;
  total_pages?: number;
  total_count?: number;
}

export type DropdownOption = {
  selected: boolean;
  value: string;
  display: string;
};

export class HttpError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "HttpError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface CurrentTranslations {
  translations: {
    [locale: Locale]: {
      js: DefineLocaleMessage;
    };
  };
}

export type SpreadableDLM = { [key: string]: any };

export interface ExtendedElectionStatusResponse extends ElectionStatusResponse {
  boardSlug: string;
}

export interface CustomCosmetics {
  hideElectionClientFooter?: boolean;
  useWideScrollbar?: boolean;
  votingSteps?: any;
  footerHtml?: string;
}
