import type {
  ContestConfig,
  ContestContent,
  LocalString,
  MarkingType,
  OptionContent,
} from "@aion-dk/js-client/dist/lib/av_client/types";

export type Election = any;

export type Ballot = any;

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

export interface ElectionStatusResponse {
  activeSlide?: any;
  contests?: ContestConfig[];
  election: ElectionStatus;
  slides?: any[];
  VoterCounts?: VoterCounts;
}

export interface VoterCounts {
  activeEligibles: number;
  activeEligiblesOrVoted: number;
  activeVoters: number;
  totalVoters: number;
}

export interface ElectionStatus {
  id: number;
  slug: string;
  title: LocalString;
  description: LocalString;
  mode: "demo" | "production" | "disabled";
  trustMode: "verifiable" | "trusted";
  electionVerificationSite?: any;
  enabledLocales: string[];
  readyForVoting: boolean;
  boardSlug: string;
  boardUrl: string;
  dbasUrl: string;
  redirect?: any;
  userModules?: any;
  voterCountsConfig?: VoterCounts;
  theme?: Theme;
  electionCodeTexts: any[];
  streamUrl?: string | null;
  hide_dbas: boolean;
  hideBenaloh: boolean;
}

export interface Theme {
  color: string;
  danger: string;
  logo: string | null;
  background: string | null;
  splash: string | null;
}

export type Locale = "en" | "da";

export interface FullOptionContent extends OptionContent {
  url?: LocalString;
  videoUrl?: LocalString;
  image?: string;
  selectable?: boolean;
  exclusive?: boolean;
  voteLimit?: number;
  children?: FullOptionContent[];
}

export interface FullMarkingType extends MarkingType {
  votesAllowedPerOption?: number;
}

export interface FullContestContent extends ContestContent {
  markingType: FullMarkingType;
  votesAllowedPerOption?: number;
}
