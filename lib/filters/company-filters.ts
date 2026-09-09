import { Company, CompanyFilterState } from '@/types/company';

export function filterCompanies(companies: Company[], filters: CompanyFilterState): Company[] {
  return companies.filter(company => {
    // Search filter across name, udyam, sector, state, district
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      const matchName = company.companyName.toLowerCase().includes(q);
      const matchUdyam = (company.udyamNumber || '').toLowerCase().includes(q);
      const matchSector = (company.sector || '').toLowerCase().includes(q);
      const matchState = (company.state || '').toLowerCase().includes(q);
      const matchDistrict = (company.district || '').toLowerCase().includes(q);
      const matchNic = (company.nicCode || '').toLowerCase().includes(q);

      if (!matchName && !matchUdyam && !matchSector && !matchState && !matchDistrict && !matchNic) {
        return false;
      }
    }

    // Classification filter
    if (filters.classification && filters.classification !== 'ALL') {
      if (company.classification !== filters.classification) {
        return false;
      }
    }

    // Sector filter
    if (filters.sector && filters.sector !== 'ALL') {
      if (company.sector !== filters.sector) {
        return false;
      }
    }

    // State filter
    if (filters.state && filters.state !== 'ALL') {
      if (company.state !== filters.state) {
        return false;
      }
    }

    // District filter
    if (filters.district && filters.district !== 'ALL') {
      if (company.district !== filters.district) {
        return false;
      }
    }

    return true;
  });
}
