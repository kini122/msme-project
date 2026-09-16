'use client';

import React from 'react';
import { CompanyFilterState } from '@/types/company';
import { KERALA_DISTRICTS } from '@/lib/data/districts';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Search,
  RotateCcw,
  Download,
  Sparkles,
  Loader2,
  CheckCircle2,
  X,
  MapPin,
} from 'lucide-react';

interface CompanyFiltersProps {
  filters: CompanyFilterState;
  onFilterChange: (filters: CompanyFilterState) => void;
  states?: string[];
  totalCount: number;
  filteredCount: number;
  onExportCSV?: () => void;
  onFetchLive?: () => void;
  isFetchingLive?: boolean;
  notificationMessage?: string | null;
  onClearNotification?: () => void;
}

export function CompanyFilters({
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
  onExportCSV,
  onFetchLive,
  isFetchingLive = false,
  notificationMessage,
  onClearNotification,
}: CompanyFiltersProps) {
  const { isAdmin } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleClassificationClick = (classification: string) => {
    onFilterChange({ ...filters, classification });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, district: e.target.value });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      classification: 'ALL',
      sector: 'ALL',
      state: 'Kerala',
      district: 'ALL',
    });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.classification !== 'ALL' ||
    (filters.district && filters.district !== 'ALL');

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-subtle mb-6 space-y-4">
      {/* Toast Notification for Live Fetch */}
      {notificationMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{notificationMessage}</span>
          </div>
          {onClearNotification && (
            <button
              type="button"
              onClick={onClearNotification}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Top Search & Actions Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by enterprise name, URN, or Kerala district..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Live Fetch Button (Admin Only) & Secondary Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && onFetchLive && (
            <button
              type="button"
              disabled={isFetchingLive}
              onClick={onFetchLive}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
              title="Pull 10 fresh verified records from gateway for the selected Kerala district"
            >
              {isFetchingLive ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Pulling 10 Live Records...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Fetch 10 Live Records</span>
                </>
              )}
            </button>
          )}

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Facets Row */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs flex-wrap">
        {/* Kerala District Select */}
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
          <label className="text-[10px] font-semibold text-slate-400 uppercase shrink-0 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            District Jurisdiction:
          </label>
          <select
            value={filters.district || 'ALL'}
            onChange={handleDistrictChange}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="ALL">All 14 Kerala Districts (1,022,346 Units)</option>
            {KERALA_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d} District
              </option>
            ))}
          </select>
        </div>

        {/* Record Counter */}
        <div className="text-[11px] text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredCount}</strong> of{' '}
            {totalCount} live government MSME records
          </span>
          {isFiltered && (
            <span className="text-blue-600 font-semibold ml-2">&bull; Filter Active</span>
          )}
        </div>
      </div>
    </div>
  );
}

