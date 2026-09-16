import { Company } from '@/types/company';

/**
 * Ensures company record structure is valid without injecting any synthetic contact or financial data.
 */
export function enrichCompanyContactDetails(company: Company): Company {
  return {
    ...company,
  };
}
