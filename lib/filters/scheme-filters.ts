import { Scheme, SchemeFilterState } from '@/types/scheme';

export function filterSchemes(schemes: Scheme[], filters: SchemeFilterState): Scheme[] {
  return schemes.filter(scheme => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      const matchName = scheme.name.toLowerCase().includes(q);
      const matchDesc = (scheme.description || '').toLowerCase().includes(q);
      const matchMinistry = (scheme.ministry || '').toLowerCase().includes(q);
      const matchCategory = (scheme.category || '').toLowerCase().includes(q);

      if (!matchName && !matchDesc && !matchMinistry && !matchCategory) {
        return false;
      }
    }

    // Category
    if (filters.category && filters.category !== 'ALL') {
      if (scheme.category !== filters.category) {
        return false;
      }
    }

    // Government Type (Central / State)
    if (filters.governmentType && filters.governmentType !== 'ALL') {
      if (scheme.governmentType !== filters.governmentType) {
        return false;
      }
    }

    // State
    if (filters.state && filters.state !== 'ALL') {
      if (scheme.states.length > 0 && !scheme.states.includes(filters.state)) {
        return false;
      }
    }

    // Sector
    if (filters.sector && filters.sector !== 'ALL') {
      if (scheme.sectors.length > 0 && !scheme.sectors.includes(filters.sector)) {
        return false;
      }
    }

    // Classification
    if (filters.classification && filters.classification !== 'ALL') {
      if (scheme.classifications.length > 0 && !scheme.classifications.includes(filters.classification as any)) {
        return false;
      }
    }

    // Ministry
    if (filters.ministry && filters.ministry !== 'ALL') {
      if (scheme.ministry !== filters.ministry) {
        return false;
      }
    }

    return true;
  });
}
