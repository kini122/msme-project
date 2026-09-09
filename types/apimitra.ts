export interface ApiMitraScheme {
  id: string;
  slug: string;
  scheme_name: string;
  short_title?: string;
  level: "Central" | "State" | string;
  scheme_for?: string;
  ministry?: string;
  beneficiary_state?: string;
  categories?: string;
  tags?: string;
  brief?: string;
  close_date?: string;
}

export interface ApiMitraLevelStat {
  level: string;
  count: number;
}

export interface ApiMitraResponse {
  status: "ok" | "error" | string;
  total: number;
  page: number;
  limit: number;
  levels?: ApiMitraLevelStat[];
  data: ApiMitraScheme[];
  message?: string;
}
