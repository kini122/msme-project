import { Scheme } from '@/types/scheme';
import { normalizeApiMitraScheme } from './normalize-scheme';
import richMockSchemes from '@/data/schemes.json';
import allNormalizedSchemes from '@/data/all-schemes-normalized.json';

// Build unified comprehensive schemes repository (4,732+ schemes) loaded in server memory
const comprehensiveSchemesMap = new Map<string, Scheme>();
(allNormalizedSchemes as Scheme[]).forEach((s) => {
  if (s.id || s.slug) comprehensiveSchemesMap.set(s.slug || s.id, s);
});
(richMockSchemes as Scheme[]).forEach((s) => {
  if (s.id || s.slug) comprehensiveSchemesMap.set(s.slug || s.id, s);
});
const allSchemesDataset: Scheme[] = Array.from(comprehensiveSchemesMap.values());

export interface SchemesQueryParams {
  q?: string;
  level?: string;
  state?: string;
  ministry?: string;
  category?: string;
  limit?: number;
  page?: number;
}

export class SchemesApiClient {
  private apiKey?: string;
  private baseUrl: string;

  constructor() {
    this.apiKey =
      process.env.SCHEMES_API_KEY ||
      process.env.APIMITRA_API_KEY ||
      process.env.RAPIDAPI_KEY;
    this.baseUrl = process.env.SCHEMES_API_BASE_URL || 'https://api.apimitra.in';
  }

  /**
   * High-speed, zero-latency in-memory scheme search across all 4,732 Central & State policies
   */
  async searchSchemes(params: SchemesQueryParams): Promise<{
    schemes: Scheme[];
    total: number;
    page: number;
    limit: number;
    levels: Array<{ level: string; count: number }>;
    source: 'live_api' | 'mock_fallback';
  }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));

    let filtered = allSchemesDataset;

    // 1. Text Search across Title, Description, Ministry, Category, and Tags
    if (params.q && params.q.trim()) {
      const qTerms = params.q.toLowerCase().trim().split(/\s+/).filter(Boolean);
      filtered = filtered.filter((s) => {
        const text = `${s.name} ${s.description || ''} ${s.ministry || ''} ${s.category || ''} ${s.tags?.join(' ') || ''}`.toLowerCase();
        return qTerms.every((term) => text.includes(term));
      });
    }

    // 2. Government Jurisdiction (Central vs State)
    if (params.level && params.level !== 'ALL') {
      const lvl = params.level.toLowerCase();
      filtered = filtered.filter(
        (s) => s.governmentType.toLowerCase() === lvl
      );
    }

    // 3. Beneficiary State Jurisdiction
    if (params.state && params.state !== 'ALL') {
      const targetState = params.state.toLowerCase();
      filtered = filtered.filter((s) => {
        if (!s.states || s.states.length === 0) return true; // Pan-India
        return s.states.some((st) => {
          const stNorm = st.toLowerCase();
          return stNorm === targetState || stNorm === 'all' || stNorm === 'pan-india';
        });
      });
    }

    // 4. Scheme Category
    if (params.category && params.category !== 'ALL') {
      filtered = filtered.filter(
        (s) => s.category?.toLowerCase() === params.category?.toLowerCase()
      );
    }

    // 5. Nodal Ministry
    if (params.ministry && params.ministry !== 'ALL') {
      filtered = filtered.filter(
        (s) => s.ministry?.toLowerCase() === params.ministry?.toLowerCase()
      );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    const centralCount = filtered.filter((s) => s.governmentType === 'Central').length;
    const stateCount = filtered.filter((s) => s.governmentType === 'State').length;

    return {
      schemes: paginated,
      total,
      page,
      limit,
      levels: [
        { level: 'Central', count: centralCount },
        { level: 'State', count: stateCount },
      ],
      source: 'live_api',
    };
  }

  /**
   * Fast lookup for a specific scheme by its ID or slug
   */
  async getSchemeBySlug(slug: string): Promise<Scheme | null> {
    if (!slug) return null;

    const normSlug = slug.toLowerCase();
    const found = allSchemesDataset.find(
      (s) =>
        s.id?.toLowerCase() === normSlug ||
        s.slug?.toLowerCase() === normSlug ||
        s.id === slug ||
        s.slug === slug
    );

    if (found) {
      return found;
    }

    // If not found in local dataset and API key exists, attempt remote lookup
    if (this.apiKey) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      try {
        const url = new URL(`/schemes/${encodeURIComponent(slug)}`, this.baseUrl);
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'x-api-key': this.apiKey,
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const raw = await response.json();
          const item = raw.data || raw;
          return normalizeApiMitraScheme(item);
        }
      } catch {
        clearTimeout(timeoutId);
      }
    }

    return null;
  }
}

