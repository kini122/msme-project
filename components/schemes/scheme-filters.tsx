import React from 'react';
import { SchemeFilterState } from '@/types/scheme';
import { Search, RotateCcw, Filter, Globe2, Sparkles, Database } from 'lucide-react';

interface SchemeFiltersProps {
  filters: SchemeFilterState;
  onFilterChange: (filters: SchemeFilterState) => void;
  categories: string[];
  states: string[];
  ministries: string[];
  totalCount: number;
  filteredCount: number;
  onSearchSubmit?: () => void;
  isLoading?: boolean;
}

const COMMON_MYSCHEME_CATEGORIES = [
  'Banking, Financial Services and Insurance',
  'Business & Entrepreneurship',
  'Agriculture, Rural & Environment',
  'Skills & Employment',
  'Social welfare & Empowerment',
  'Education & Learning',
  'Health & Wellness',
  'Science, IT & Communications',
  'Housing & Shelter',
];

const COMMON_STATES = [
  'All',
  'Andhra Pradesh',
  'Bihar',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

export function SchemeFilters({
  filters,
  onFilterChange,
  categories,
  states,
  ministries,
  totalCount,
  filteredCount,
  onSearchSubmit,
  isLoading = false,
}: SchemeFiltersProps) {
  const mergedCategories = Array.from(
    new Set([...categories, ...COMMON_MYSCHEME_CATEGORIES])
  ).sort();

  const mergedStates = Array.from(
    new Set([...states, ...COMMON_STATES])
  ).filter(Boolean).sort();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      category: 'ALL',
      governmentType: 'ALL',
      state: 'ALL',
      sector: 'ALL',
      classification: 'ALL',
      ministry: 'ALL',
      page: 1,
    });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.category !== 'ALL' ||
    filters.governmentType !== 'ALL' ||
    filters.state !== 'ALL' ||
    filters.sector !== 'ALL' ||
    filters.classification !== 'ALL' ||
    filters.ministry !== 'ALL';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-subtle mb-6 space-y-4">
      {/* Top Search Bar & Search Action */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSearchSubmit) onSearchSubmit();
        }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search government schemes by keyword, acronym, or policy name (e.g. kisan, cgtmse, subsidy, food processing)..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isLoading ? 'Searching...' : 'Search Schemes'}</span>
          </button>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </form>

      {/* Filter Facets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
        {/* Government Jurisdiction */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
            Jurisdiction
          </label>
          <select
            value={filters.governmentType}
            onChange={(e) =>
              onFilterChange({ ...filters, governmentType: e.target.value, page: 1 })
            }
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Jurisdictions (Central + State)</option>
            <option value="Central">Central Government</option>
            <option value="State">State / UT Government</option>
          </select>
        </div>

        {/* Beneficiary State */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
            Beneficiary State
          </label>
          <select
            value={filters.state}
            onChange={(e) =>
              onFilterChange({ ...filters, state: e.target.value, page: 1 })
            }
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All States / Pan-India</option>
            {mergedStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Scheme Category */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
            Scheme Category
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              onFilterChange({ ...filters, category: e.target.value, page: 1 })
            }
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All 19 Categories</option>
            {mergedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Nodal Ministry */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
            Nodal Ministry
          </label>
          <select
            value={filters.ministry}
            onChange={(e) =>
              onFilterChange({ ...filters, ministry: e.target.value, page: 1 })
            }
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Ministries</option>
            {ministries.map((min) => (
              <option key={min} value={min}>
                {min}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer Info & Counter */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            National Scheme Index: <strong>713 Central &bull; 4,019 State/UT Policies</strong>
          </span>
        </div>

        <div>
          <span>
            Showing <strong className="text-slate-800">{filteredCount}</strong> of{' '}
            {totalCount} schemes
          </span>
          {isFiltered && (
            <span className="text-blue-600 font-medium ml-2">&bull; Filter Active</span>
          )}
        </div>
      </div>
    </div>
  );
}
