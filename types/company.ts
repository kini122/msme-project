export type MSMEClassification = "Micro" | "Small" | "Medium";

export interface CompanyCustomKPIs {
  exportTurnoverPercentage?: number; // e.g. 25 (%)
  isExporter?: boolean;
  womenOwnershipPercentage?: number; // e.g. 51 (%)
  scStOwnershipPercentage?: number; // e.g. 100 (%)
  greenEnergyAdoption?: boolean;
  greenEnergyInvestment?: number; // in INR
  techUpgradeInvestment?: number; // in INR
  zedCertification?: 'None' | 'Bronze' | 'Silver' | 'Gold';
  isoCertified?: boolean;
  employeeCount?: number;
  existingCreditAvailment?: number; // in INR
  creditRequirement?: number; // in INR
  hasRndFacility?: boolean;
  targetMarkets?: string[];
  customNotes?: string;
}

export interface Company {
  id: string;
  udyamNumber?: string;
  companyName: string;
  registrationDate?: string;
  classification?: MSMEClassification;
  investment?: number; // in INR
  turnover?: number; // in INR
  nicCode?: string;
  sector?: string;
  state?: string;
  district?: string;
  address?: string;
  source: "mock" | "rapidapi" | "data.gov.in" | "myscheme" | "custom";
  fetchedAt?: string;

  // Statutory Contacts & Identity Fields (only populated if confirmed)
  promoterName?: string;
  designation?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  pinCode?: string;
  industrialZone?: string;
  panNumber?: string;
  gstin?: string;
  cinNumber?: string;
  dicName?: string;
  bankBranch?: string;

  // Custom KPIs for specialized scheme matching & enrichment
  kpis?: CompanyCustomKPIs;
}

export interface CompanyFilterState {
  search: string;
  classification: string;
  sector: string;
  state: string;
  district?: string;
}
