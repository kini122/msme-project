export type MSMEClassification = "Micro" | "Small" | "Medium";

export interface Company {
  id: string;
  udyamNumber?: string;
  companyName: string;
  registrationDate?: string;
  classification?: MSMEClassification;
  investment?: number; // in INR
  turnover?: number;   // in INR
  nicCode?: string;
  sector?: string;
  state?: string;
  district?: string;
  address?: string;
  source: "mock" | "rapidapi";
  fetchedAt?: string;

  // Statutory Contacts & Identity Fields
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
}

export interface CompanyFilterState {
  search: string;
  classification: string;
  sector: string;
  state: string;
  district?: string;
}
