import { ApiMitraResponse, ApiMitraScheme } from '@/types/apimitra';
import { Scheme } from '@/types/scheme';
import { normalizeApiMitraScheme } from './normalize-scheme';
import mockSchemes from '@/data/schemes.json';

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

  async searchSchemes(params: SchemesQueryParams): Promise<{
    schemes: Scheme[];
    total: number;
    page: number;
    limit: number;
    levels?: Array<{ level: string; count: number }>;
    source: 'live_api' | 'mock_fallback';
  }> {
    const page = params.page || 1;
    const limit = params.limit || 20;

    // If API key is not configured or in local offline mode, use intelligent mock search
    if (!this.apiKey) {
      return this.fallbackSearch(params);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const url = new URL('/schemes', this.baseUrl);
      if (params.q) url.searchParams.append('q', params.q);
      if (params.level && params.level !== 'ALL') url.searchParams.append('level', params.level.toLowerCase());
      if (params.state && params.state !== 'ALL') url.searchParams.append('state', params.state);
      if (params.ministry && params.ministry !== 'ALL') url.searchParams.append('ministry', params.ministry);
      if (params.category && params.category !== 'ALL') url.searchParams.append('category', params.category);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`ApiMitra responded with status ${response.status}. Falling back to mock dataset.`);
        return this.fallbackSearch(params);
      }

      const data: ApiMitraResponse = await response.json();
      const normalizedSchemes = (data.data || []).map(normalizeApiMitraScheme);

      return {
        schemes: normalizedSchemes,
        total: data.total || normalizedSchemes.length,
        page: data.page || page,
        limit: data.limit || limit,
        levels: data.levels,
        source: 'live_api',
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('ApiMitra request failed or timed out:', err?.message);
      return this.fallbackSearch(params);
    }
  }

  async getSchemeBySlug(slug: string): Promise<Scheme | null> {
    if (!this.apiKey) {
      const found = (mockSchemes as Scheme[]).find(
        (s) => s.id === slug || s.slug === slug
      );
      return found || null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const url = new URL(`/schemes/${encodeURIComponent(slug)}`, this.baseUrl);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Fallback to local mock
        const found = (mockSchemes as Scheme[]).find(
          (s) => s.id === slug || s.slug === slug
        );
        return found || null;
      }

      const raw = await response.json();
      const item: ApiMitraScheme = raw.data || raw;
      return normalizeApiMitraScheme(item);
    } catch (err) {
      clearTimeout(timeoutId);
      const found = (mockSchemes as Scheme[]).find(
        (s) => s.id === slug || s.slug === slug
      );
      return found || null;
    }
  }

  private fallbackSearch(params: SchemesQueryParams): {
    schemes: Scheme[];
    total: number;
    page: number;
    limit: number;
    levels: Array<{ level: string; count: number }>;
    source: 'mock_fallback';
  } {
    const page = params.page || 1;
    const limit = params.limit || 20;

    let filtered = [...(mockSchemes as Scheme[])];

    if (params.q) {
      const q = params.q.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q) ||
          (s.ministry || '').toLowerCase().includes(q) ||
          (s.category || '').toLowerCase().includes(q)
      );
    }

    if (params.level && params.level !== 'ALL') {
      filtered = filtered.filter(
        (s) => s.governmentType.toLowerCase() === params.level?.toLowerCase()
      );
    }

    if (params.state && params.state !== 'ALL') {
      filtered = filtered.filter(
        (s) => s.states.length === 0 || s.states.some((st) => st.toLowerCase() === params.state?.toLowerCase())
      );
    }

    if (params.category && params.category !== 'ALL') {
      filtered = filtered.filter((s) => s.category === params.category);
    }

    if (params.ministry && params.ministry !== 'ALL') {
      filtered = filtered.filter((s) => s.ministry === params.ministry);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      schemes: paginated,
      total,
      page,
      limit,
      levels: [
        {
          level: 'Central',
          count: filtered.filter((s) => s.governmentType === 'Central').length,
        },
        {
          level: 'State',
          count: filtered.filter((s) => s.governmentType === 'State').length,
        },
      ],
      source: 'mock_fallback',
    };
  }
}
