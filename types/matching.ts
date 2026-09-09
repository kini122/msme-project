export type RuleState = "pass" | "fail" | "unknown" | "not_applicable";

export type MatchCheckKey = "classification" | "sector" | "state" | "turnover" | "investment";

export interface MatchCheck {
  key: MatchCheckKey;
  label: string;
  state: RuleState;
  required: boolean;
  reason: string;
}

export type MatchStatus =
  | "strong_match"
  | "possible_match"
  | "low_match"
  | "not_matched"
  | "unknown";

export interface SchemeMatch {
  schemeId: string;
  schemeName: string;
  category?: string;
  governmentType: "Central" | "State";
  ministry?: string;
  officialUrl?: string;
  score: number | null;
  status: MatchStatus;
  checks: MatchCheck[];
}
