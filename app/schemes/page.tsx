'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { SchemeFilters } from '@/components/schemes/scheme-filters';
import { SchemeCard } from '@/components/schemes/scheme-card';
import { getMatchingCompaniesForScheme } from '@/lib/matching/match-company';
import { useAppData } from '@/lib/store/app-data-context';
import { Scheme, SchemeFilterState } from '@/types/scheme';
import {
  FileCheck2,
  Globe2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function SchemesPage() {
  const { companies, schemes: defaultSchemes, addSchemes } = useAppData();

  const [filters, setFilters] = React.useState<SchemeFilterState>({
    search: '',
    category: 'ALL',
    governmentType: 'ALL',
    state: 'ALL',
    sector: 'ALL',
    classification: 'ALL',
    ministry: 'ALL',
    page: 1,
    limit: 12,
  });

  const [schemes, setSchemes] = React.useState<Scheme[]>(defaultSchemes);
  const [totalCount, setTotalCount] = React.useState<number>(defaultSchemes.length);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [source, setSource] = React.useState<'myscheme' | 'mock'>('myscheme');

  // Extract unique facets from schemes
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    defaultSchemes.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set).sort();
  }, [defaultSchemes]);

  const states = React.useMemo(() => {
    const set = new Set<string>();
    defaultSchemes.forEach((s) => {
      s.states.forEach((st) => set.add(st));
    });
    return Array.from(set).sort();
  }, [defaultSchemes]);

  const ministries = React.useMemo(() => {
    const set = new Set<string>();
    defaultSchemes.forEach((s) => {
      if (s.ministry) set.add(s.ministry);
    });
    return Array.from(set).sort();
  }, [defaultSchemes]);

  // Fetch schemes from /api/schemes proxy
  const fetchSchemes = React.useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set('q', filters.search);
      if (filters.governmentType !== 'ALL') queryParams.set('level', filters.governmentType);
      if (filters.state !== 'ALL') queryParams.set('state', filters.state);
      if (filters.category !== 'ALL') queryParams.set('category', filters.category);
      if (filters.ministry !== 'ALL') queryParams.set('ministry', filters.ministry);
      queryParams.set('page', String(filters.page || 1));
      queryParams.set('limit', String(filters.limit || 12));

      const res = await fetch(`/api/schemes?${queryParams.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.schemes)) {
        setSchemes(data.schemes);
        addSchemes(data.schemes); // Cache newly retrieved schemes in unified store
        setTotalCount(data.total || data.schemes.length);
        const limit = filters.limit || 12;
        setTotalPages(Math.ceil((data.total || data.schemes.length) / limit) || 1);
        setSource(data.source === 'live_api' ? 'myscheme' : 'mock');
      }
    } catch (err) {
      console.error('Failed to query schemes API:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, addSchemes]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSchemes();
    }, 250);
    return () => clearTimeout(timeout);
  }, [fetchSchemes]);

  // Compute matching company count for each scheme against all loaded & cached enterprises
  const schemeMatchesMap = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const scheme of schemes) {
      const matches = getMatchingCompaniesForScheme(scheme, companies);
      map.set(scheme.slug || scheme.id, matches.length);
    }
    return map;
  }, [schemes, companies]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="National Scheme Explorer"
        description="Comprehensive directory of Central and State/UT government schemes with real-time candidate MSME statutory evaluation."
        breadcrumbs={[
          { label: 'Overview', href: '/overview' },
          { label: 'Scheme Explorer' },
        ]}
        source={source === 'myscheme' ? 'rapidapi' : 'mock'}
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5 text-purple-600" />
              <span>National Policy Directory</span>
            </span>
          </div>
        }
      />

      {/* Filter Bar with Full-Text Search and 4 Facets */}
      <SchemeFilters
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        states={states}
        ministries={ministries}
        totalCount={totalCount}
        filteredCount={schemes.length}
        onSearchSubmit={fetchSchemes}
        isLoading={loading}
      />

      {/* Content Area */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <h4 className="font-bold text-sm text-slate-800">
            Querying Indian Government Schemes Directory...
          </h4>
          <p className="text-xs text-slate-400">
            Scanning 713 Central and 4,019 State policies across 19 categories.
          </p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          <FileCheck2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">
            No Government Schemes Found Matching Your Query
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Try broadening your search keywords (e.g. &quot;kisan&quot;, &quot;subsidy&quot;, &quot;credit&quot;, &quot;msme&quot;) or resetting state/category filters.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemes.map((scheme) => (
              <SchemeCard
                key={scheme.slug || scheme.id}
                scheme={scheme}
                matchingCompanyCount={
                  schemeMatchesMap.get(scheme.slug || scheme.id) ?? 0
                }
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600 shadow-subtle">
              <span>
                Page <strong className="text-slate-900">{filters.page || 1}</strong> of{' '}
                {totalPages} ({totalCount} total schemes)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={(filters.page || 1) <= 1}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.max((prev.page || 1) - 1, 1),
                    }))
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="px-3 py-1 font-mono font-bold text-slate-800">
                  {filters.page || 1}
                </span>

                <button
                  type="button"
                  disabled={(filters.page || 1) >= totalPages}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.min((prev.page || 1) + 1, totalPages),
                    }))
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
