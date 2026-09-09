'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Company, CompanyFilterState } from '@/types/company';
import { Scheme } from '@/types/scheme';
import { enrichCompanyContactDetails } from '@/lib/data/company-contacts';
import initialCompaniesRaw from '@/data/companies.json';
import initialSchemes from '@/data/schemes.json';

const initialCompanies: Company[] = (initialCompaniesRaw as Company[]).map(enrichCompanyContactDetails);

interface AppDataContextType {
  companies: Company[];
  schemes: Scheme[];
  addCompanies: (newCompanies: Company[]) => void;
  addSchemes: (newSchemes: Scheme[]) => void;
  fetchLiveCompanyBatch: (filters: CompanyFilterState, count?: number) => Promise<{ count: number }>;
  isFetchingLive: boolean;
  lastFetchMessage: string | null;
  clearNotification: () => void;
  resetToDefault: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const COMPANIES_CACHE_KEY = 'msme_unified_companies_cache';
const SCHEMES_CACHE_KEY = 'msme_unified_schemes_cache';

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes as Scheme[]);
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [lastFetchMessage, setLastFetchMessage] = useState<string | null>(null);

  // Load cached records on client mount
  useEffect(() => {
    try {
      const cachedCompStr = localStorage.getItem(COMPANIES_CACHE_KEY);
      if (cachedCompStr) {
        const cachedComp: Company[] = JSON.parse(cachedCompStr);
        if (Array.isArray(cachedComp) && cachedComp.length > 0) {
          // Merge initial and cached deduplicating by id and udyamNumber
          const map = new Map<string, Company>();
          initialCompanies.forEach((c) => map.set(c.id, enrichCompanyContactDetails(c)));
          cachedComp.forEach((c) => map.set(c.id, enrichCompanyContactDetails(c)));
          setCompanies(Array.from(map.values()));
        }
      }

      const cachedSchStr = localStorage.getItem(SCHEMES_CACHE_KEY);
      if (cachedSchStr) {
        const cachedSch: Scheme[] = JSON.parse(cachedSchStr);
        if (Array.isArray(cachedSch) && cachedSch.length > 0) {
          const map = new Map<string, Scheme>();
          (initialSchemes as Scheme[]).forEach((s) => map.set(s.id, s));
          cachedSch.forEach((s) => map.set(s.id, s));
          setSchemes(Array.from(map.values()));
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage cache:', e);
    }
  }, []);

  const addCompanies = useCallback((newItems: Company[]) => {
    if (!newItems || newItems.length === 0) return;

    setCompanies((prev) => {
      const map = new Map<string, Company>();
      // Put new items at the top so user immediately sees newly fetched records
      newItems.forEach((c) => map.set(c.id, enrichCompanyContactDetails(c)));
      prev.forEach((c) => {
        if (!map.has(c.id)) map.set(c.id, enrichCompanyContactDetails(c));
      });

      const updated = Array.from(map.values());
      try {
        localStorage.setItem(COMPANIES_CACHE_KEY, JSON.stringify(updated.slice(0, 150)));
      } catch (e) {
        console.warn('Could not save companies to cache:', e);
      }
      return updated;
    });
  }, []);

  const addSchemes = useCallback((newItems: Scheme[]) => {
    if (!newItems || newItems.length === 0) return;

    setSchemes((prev) => {
      const map = new Map<string, Scheme>();
      newItems.forEach((s) => map.set(s.id, s));
      prev.forEach((s) => {
        if (!map.has(s.id)) map.set(s.id, s);
      });

      const updated = Array.from(map.values());
      try {
        localStorage.setItem(SCHEMES_CACHE_KEY, JSON.stringify(updated.slice(0, 150)));
      } catch (e) {
        console.warn('Could not save schemes to cache:', e);
      }
      return updated;
    });
  }, []);

  const fetchLiveCompanyBatch = useCallback(
    async (filters: CompanyFilterState, count: number = 10) => {
      setIsFetchingLive(true);
      setLastFetchMessage(null);

      try {
        const response = await fetch('/api/companies/live-fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            state: filters.state,
            district: filters.district,
            sector: filters.sector,
            classification: filters.classification,
            limit: count,
          }),
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.companies) && data.companies.length > 0) {
          addCompanies(data.companies);
          const msg = `Fetched & verified ${data.companies.length} enterprise records for ${
            filters.district && filters.district !== 'ALL'
              ? `${filters.district}, `
              : ''
          }${filters.state && filters.state !== 'ALL' ? filters.state : 'National Registry'}.`;
          setLastFetchMessage(msg);
          return { count: data.companies.length };
        } else {
          throw new Error('No new enterprise records returned from verification gateway.');
        }
      } catch (err: any) {
        setLastFetchMessage(`Verification notice: ${err?.message || 'Failed to pull live batch'}`);
        return { count: 0 };
      } finally {
        setIsFetchingLive(false);
      }
    },
    [addCompanies]
  );

  const clearNotification = useCallback(() => {
    setLastFetchMessage(null);
  }, []);

  const resetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(COMPANIES_CACHE_KEY);
      localStorage.removeItem(SCHEMES_CACHE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setCompanies(initialCompanies as Company[]);
    setSchemes(initialSchemes as Scheme[]);
    setLastFetchMessage('Registry reset to default initial state.');
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        companies,
        schemes,
        addCompanies,
        addSchemes,
        fetchLiveCompanyBatch,
        isFetchingLive,
        lastFetchMessage,
        clearNotification,
        resetToDefault,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
