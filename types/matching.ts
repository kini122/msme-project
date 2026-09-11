export type RuleState = "pass" | "fail" | "unknown" | "not_applicable";

export type MatchCheckKey =
  | "enterprise_scope"
  | "classification"
  | "sector"
  | "state"
  | "turnover"
  | "investment"
  | "export_kpi"
  | "green_kpi"
  | "tech_quality_kpi"
  | "credit_kpi"
  | "social_kpi";

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
