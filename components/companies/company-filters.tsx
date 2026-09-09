'use client';

import React from 'react';
import { CompanyFilterState } from '@/types/company';
import { getDistrictsForState } from '@/lib/data/districts';
import {
  Search,
  RotateCcw,
  Download,
  Sparkles,
  Loader2,
  MapPin,
  Building,
  CheckCircle2,
  X,
} from 'lucide-react';

interface CompanyFiltersProps {
  filters: CompanyFilterState;
  onFilterChange: (filters: CompanyFilterState) => void;
  sectors: string[];
  states: string[];
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
  sectors,
  states,
  totalCount,
  filteredCount,
  onExportCSV,
  onFetchLive,
  isFetchingLive = false,
  notificationMessage,
  onClearNotification,
}: CompanyFiltersProps) {
  // Cascading districts list based on selected state
  const availableDistricts = React.useMemo(() => {
    return getDistrictsForState(filters.state);
  }, [filters.state]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleClassificationClick = (classification: string) => {
    onFilterChange({ ...filters, classification });
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sector: e.target.value });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    // Reset district if state changes
    onFilterChange({ ...filters, state: newState, district: 'ALL' });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, district: e.target.value });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      classification: 'ALL',
      sector: 'ALL',
      state: 'ALL',
      district: 'ALL',
    });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.classification !== 'ALL' ||
    filters.sector !== 'ALL' ||
    filters.state !== 'ALL' ||
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
            placeholder="Search by company name, URN, sector, district, or state..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Live Fetch Button & Secondary Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onFetchLive && (
            <button
              type="button"
              disabled={isFetchingLive}
              onClick={onFetchLive}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
              title="Pull fresh verified records from gateway for selected state/district"
            >
              {isFetchingLive ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Pulling Live Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Fetch Live Records</span>
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

      {/* Filter Facets Grid */}
      <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
        {/* Classification Cohorts */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-semibold text-slate-400 uppercase mr-1">
            Classification:
          </span>
          {['ALL', 'Micro', 'Small', 'Medium'].map((tier) => {
            const isSelected = filters.classification === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => handleClassificationClick(tier)}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier === 'ALL' ? 'All Classes' : tier}
              </button>
            );
          })}
        </div>

        {/* Sector, State, and District Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Sector Select */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              Sector:
            </label>
            <select
              value={filters.sector}
              onChange={handleSectorChange}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Sectors</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* State Select */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              State Jurisdiction:
            </label>
            <select
              value={filters.state}
              onChange={handleStateChange}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All States (Pan-India)</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District Select (Cascading) */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              District:
            </label>
            <select
              value={filters.district || 'ALL'}
              onChange={handleDistrictChange}
              disabled={availableDistricts.length === 0}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="ALL">
                {filters.state && filters.state !== 'ALL'
                  ? `All Districts in ${filters.state}`
                  : 'All Districts'}
              </option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Record Counter & Active Status */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-2">
        <span>
          Showing <strong className="text-slate-800">{filteredCount}</strong> of{' '}
          {totalCount} registered enterprises in active registry
        </span>

        {isFiltered && (
          <span className="text-blue-600 font-semibold">&bull; Filter Active</span>
        )}
      </div>
    </div>
  );
}
