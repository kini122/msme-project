import { MSMEClassification } from './company';

export interface Scheme {
  id: string;
  slug?: string;
  name: string;
  shortTitle?: string;
  description?: string;
  category?: string;
  governmentType: "Central" | "State";
  ministry?: string;
  classifications: MSMEClassification[];
  sectors: string[]; // empty array = all sectors eligible
  states: string[];  // empty array = all states eligible
  schemeFor?: string;
  tags?: string[];
  closeDate?: string;
  minTurnover?: number | null;
  maxTurnover?: number | null;
  minInvestment?: number | null;
  maxInvestment?: number | null;
  officialUrl?: string;
  source: "mock" | "rapidapi" | "myscheme";
}

export interface SchemeFilterState {
  search: string;
  category: string;
  governmentType: string;
  state: string;
  sector: string;
  classification: string;
  ministry: string;
  page?: number;
  limit?: number;
}
