'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Company, CompanyFilterState } from '@/types/company';
import { Scheme } from '@/types/scheme';
import { enrichCompanyContactDetails } from '@/lib/data/company-contacts';
import initialCompaniesRaw from '@/data/companies.json';
import richMockSchemes from '@/data/schemes.json';

const initialCompanies: Company[] = (initialCompaniesRaw as Company[]).map(enrichCompanyContactDetails);
const initialSchemes: Scheme[] = richMockSchemes as Scheme[];

interface AppDataContextType {
  companies: Company[];
  schemes: Scheme[];
  addCompanies: (newCompanies: Company[]) => void;
  updateCompany: (updatedCompany: Company) => void;
  createCompany: (newCompany: Company) => void;
  deleteCompany: (companyId: string) => void;
  addSchemes: (newSchemes: Scheme[]) => void;
  fetchLiveCompanyBatch: (filters: CompanyFilterState, count?: number) => Promise<{ count: number }>;
  isFetchingLive: boolean;
  lastFetchMessage: string | null;
  clearNotification: () => void;
  resetToDefault: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const COMPANIES_CACHE_KEY = 'msme_kerala_companies_cache_v5';
const SCHEMES_CACHE_KEY = 'msme_national_schemes_cache_v4';

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes);
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [lastFetchMessage, setLastFetchMessage] = useState<string | null>(null);

  // Load and merge cached records on client mount
  useEffect(() => {
    try {
      // Clear legacy temporary caches
      localStorage.removeItem('msme_unified_schemes_cache');
      localStorage.removeItem('msme_unified_companies_cache');
      localStorage.removeItem('msme_kerala_schemes_v2');

      const cachedCompStr = localStorage.getItem(COMPANIES_CACHE_KEY);
      if (cachedCompStr) {
        const cachedComp: Company[] = JSON.parse(cachedCompStr);
        if (Array.isArray(cachedComp) && cachedComp.length > 0) {
          const map = new Map<string, Company>();
          // Seed defaults
          initialCompanies.forEach((c) => {
            const key = c.udyamNumber || c.id || c.companyName;
            map.set(key, c);
          });
          // Merge cached live fetched entries
          cachedComp.forEach((c) => {
            const key = c.udyamNumber || c.id || c.companyName;
            map.set(key, c);
          });
          setCompanies(Array.from(map.values()));
        }
      }

      const cachedSchStr = localStorage.getItem(SCHEMES_CACHE_KEY);
      if (cachedSchStr) {
        const cachedSch: Scheme[] = JSON.parse(cachedSchStr);
        if (Array.isArray(cachedSch) && cachedSch.length > 0) {
          const map = new Map<string, Scheme>();
          initialSchemes.forEach((s) => map.set(s.id || s.slug || '', s));
          cachedSch.forEach((s) => map.set(s.id || s.slug || '', s));
          setSchemes(Array.from(map.values()));
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage cache:', e);
    }
  }, []);

  const saveCompaniesToStorage = (list: Company[]) => {
    try {
      localStorage.setItem(COMPANIES_CACHE_KEY, JSON.stringify(list.slice(0, 5000)));
    } catch (e) {
      console.warn('Could not save companies to cache:', e);
    }
  };

  const addCompanies = useCallback((newItems: Company[]) => {
    if (!newItems || newItems.length === 0) return;

    setCompanies((prev) => {
      const map = new Map<string, Company>();
      prev.forEach((c) => {
        const key = c.udyamNumber || c.id || c.companyName;
        map.set(key, c);
      });
      newItems.forEach((c) => {
        const key = c.udyamNumber || c.id || c.companyName;
        map.set(key, c);
      });

      const updated = Array.from(map.values());
      saveCompaniesToStorage(updated);
      return updated;
    });
  }, []);

  const updateCompany = useCallback((updatedCompany: Company) => {
    setCompanies((prev) => {
      const updated = prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c));
      if (!prev.some((c) => c.id === updatedCompany.id)) {
        updated.unshift(updatedCompany);
      }
      saveCompaniesToStorage(updated);
      return updated;
    });
    setLastFetchMessage(`Enterprise profile for "${updatedCompany.companyName}" updated successfully.`);
  }, []);

  const createCompany = useCallback((newCompany: Company) => {
    setCompanies((prev) => {
      const updated = [newCompany, ...prev.filter((c) => c.id !== newCompany.id)];
      saveCompaniesToStorage(updated);
      return updated;
    });
    setLastFetchMessage(`Registered new enterprise: "${newCompany.companyName}".`);
  }, []);

  const deleteCompany = useCallback((companyId: string) => {
    setCompanies((prev) => {
      const updated = prev.filter((c) => c.id !== companyId);
      saveCompaniesToStorage(updated);
      return updated;
    });
  }, []);

  const addSchemes = useCallback((newItems: Scheme[]) => {
    if (!newItems || newItems.length === 0) return;

    setSchemes((prev) => {
      const map = new Map<string, Scheme>();
      newItems.forEach((s) => map.set(s.id, s));
      prev.forEach((c) => {
        if (!map.has(c.id)) map.set(c.id, c);
      });

      const updated = Array.from(map.values());
      try {
        localStorage.setItem(SCHEMES_CACHE_KEY, JSON.stringify(updated.slice(0, 5000)));
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
          let updatedTotal = 0;
          setCompanies((prev) => {
            const map = new Map<string, Company>();
            // Retain all existing cached companies
            prev.forEach((c) => {
              const key = c.udyamNumber || c.id || c.companyName;
              map.set(key, c);
            });
            // Merge in newly fetched live records
            data.companies.forEach((c: Company) => {
              const key = c.udyamNumber || c.id || c.companyName;
              map.set(key, c);
            });

            const merged = Array.from(map.values());
            updatedTotal = merged.length;
            saveCompaniesToStorage(merged);
            return merged;
          });

          const distLabel = filters.district && filters.district !== 'ALL' ? `${filters.district} District` : 'Kerala';
          const msg = `Fetched & cached ${data.companies.length} authentic records for ${distLabel} in memory. Total cached: ${updatedTotal || (companies.length + data.companies.length)} enterprises active across the portal.`;
          setLastFetchMessage(msg);
          return { count: data.companies.length };
        } else {
          throw new Error('No new enterprise records returned from verification gateway.');
        }
      } catch (err: any) {
        setLastFetchMessage(`Notice: ${err?.message || 'Failed to pull live batch'}`);
        return { count: 0 };
      } finally {
        setIsFetchingLive(false);
      }
    },
    [companies.length]
  );

  const clearNotification = useCallback(() => {
    setLastFetchMessage(null);
  }, []);

  const resetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(COMPANIES_CACHE_KEY);
      localStorage.removeItem(SCHEMES_CACHE_KEY);
      localStorage.removeItem('msme_unified_schemes_cache');
      localStorage.removeItem('msme_unified_companies_cache');
    } catch (e) {
      console.warn(e);
    }
    setCompanies(initialCompanies as Company[]);
    setSchemes(initialSchemes);
    setLastFetchMessage('Registry reset to default initial state.');
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        companies,
        schemes,
        addCompanies,
        updateCompany,
        createCompany,
        deleteCompany,
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
