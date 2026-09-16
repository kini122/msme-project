'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { CompanyProfile } from '@/components/companies/company-profile';
import { matchCompanyToAllSchemes } from '@/lib/matching/match-company';
import { useAppData } from '@/lib/store/app-data-context';
import { useAuth } from '@/lib/auth/auth-context';
import { Company } from '@/types/company';
import {
  Search,
  Sparkles,
  Loader2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Plus,
  Check,
  ArrowRight,
  Lock,
} from 'lucide-react';

const SAMPLE_QUERIES = [
  { label: 'KG SOLARINDIA ENGINEERING (Ernakulam)', query: 'KG SOLARINDIA ENGINEERING PRIVATE LIMITED' },
  { label: 'PARVATHY AGRO MILL (Palakkad)', query: 'PARVATHY AGRO MILL' },
  { label: 'choc - O - late CHOCOLATES (Ernakulam)', query: 'choc - O - late CHOCOLATES' },
  { label: 'M/S SAFA METAL TRADERS (Ernakulam)', query: 'M/S SAFA METAL TRADERS' },
  { label: 'MATTATHIL LEATHER HOUSE (Kottayam)', query: 'MATTATHIL LEATHER HOUSE' },
  { label: 'Live Central Udyam (URN)', query: 'UDYAM-KL-07-0013799' },
];

export default function LiveLookupPage() {
  const { companies, schemes, addCompanies } = useAppData();
  const { isAdmin } = useAuth();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveCompany, setLiveCompany] = useState<Company | null>(null);

  // Load from session storage on mount if available
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem('last_live_company');
      if (saved) {
        setLiveCompany(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const isAlreadyInDatabase = React.useMemo(() => {
    if (!liveCompany) return false;
    return companies.some(
      (c) =>
        (c.udyamNumber &&
          liveCompany.udyamNumber &&
          c.udyamNumber.toLowerCase() === liveCompany.udyamNumber.toLowerCase()) ||
        c.id === liveCompany.id
    );
  }, [liveCompany, companies]);

  // Guard: if non-admin employee visits directly, show polite access restricted card
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Administrative Privilege Required"
          description="Access to live statutory Udyam verification gateways is restricted to Administrator personnel."
          breadcrumbs={[
            { label: 'Overview', href: '/overview' },
            { label: 'Live Verification (Restricted)' },
          ]}
        />
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 shadow-subtle max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800">
            Live Verification Access Restricted
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Your current login clearance (Associate Consultant / View Only) permits access to the Enterprise Directory and Scheme Explorer. Contact a Senior Partner for live verification privileges.
          </p>
          <div className="mt-5">
            <Link
              href="/companies"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition"
            >
              <span>Return to Enterprise Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLookup = async (lookupQuery: string) => {
    const trimmed = lookupQuery.trim();
    if (!trimmed) {
      setError('Please enter a valid Udyam Registration Number or enterprise identifier.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/company-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Unable to retrieve enterprise records. Please verify the Udyam number and try again.'
        );
      }

      const company: Company = data.company;
      setLiveCompany(company);

      try {
        sessionStorage.setItem('last_live_company', JSON.stringify(company));
      } catch (e) {
        console.error(e);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected verification error occurred.');
      setLiveCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDatabase = () => {
    if (!liveCompany) return;
    addCompanies([liveCompany]);
  };

  const handleClear = () => {
    setQuery('');
    setLiveCompany(null);
    setError(null);
    try {
      sessionStorage.removeItem('last_live_company');
    } catch (e) {
      console.error(e);
    }
  };

  // Run real-time matching engine on live company record
  const liveMatches = liveCompany
    ? matchCompanyToAllSchemes(liveCompany, schemes)
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Udyam Verification & Scheme Matching"
        description="Verify enterprise registration credentials and execute immediate statutory eligibility evaluations across Central and State government schemes."
        breadcrumbs={[
          { label: 'Overview', href: '/overview' },
          { label: 'Live Verification' },
        ]}
        source={liveCompany ? 'rapidapi' : 'mock'}
        fetchedAt={liveCompany?.fetchedAt}
      />

      {/* Query Search Panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Udyam Registration Verification
            </h3>
          </div>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
            Directorate of Industries & Commerce (Kerala)
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup(query);
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Enterprise Name, PIN code, or Udyam URN (e.g. PARVATHY AGRO MILL or UDYAM-KL-07-0013799)..."
              disabled={loading}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xs shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Verifying Enterprise...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verify & Match Schemes</span>
                </>
              )}
            </button>

            {liveCompany && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                title="Clear verification record"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Sample Queries */}
        <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Quick Verification Presets:
          </span>
          {SAMPLE_QUERIES.map((sample) => (
            <button
              key={sample.query}
              type="button"
              onClick={() => {
                setQuery(sample.query);
                handleLookup(sample.query);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono transition"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-xs text-rose-900 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <strong className="font-semibold text-rose-950">
              Verification Notice:
            </strong>
            <p className="leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-subtle text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <div>
            <h4 className="font-bold text-sm text-slate-800">
              Verifying Udyam Registration Credentials...
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Validating Udyam registration credentials and evaluating statutory scheme eligibility.
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Live Fetched Profile & Action Bar */}
      {!loading && liveCompany && (
        <div className="space-y-6">
          {/* Clean Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-lg shadow-subtle">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {liveCompany.companyName}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  {liveCompany.udyamNumber} • {liveCompany.district}, Kerala
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAlreadyInDatabase ? (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Added to Database</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToDatabase}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Database</span>
                </button>
              )}

              <Link
                href="/companies"
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-2"
              >
                <span>Companies List</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Full Enterprise Dossier and Scheme Match Cards */}
          <CompanyProfile
            company={liveCompany}
            matches={liveMatches}
            onCompanyUpdate={(updated) => {
              setLiveCompany(updated);
              try {
                sessionStorage.setItem('last_live_company', JSON.stringify(updated));
              } catch (e) {
                console.error(e);
              }
            }}
          />
        </div>
      )}

      {/* Empty State before search */}
      {!loading && !liveCompany && !error && (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 shadow-subtle">
          <Sparkles className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-base text-slate-800">
            Awaiting Udyam Registration Identifier
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            Enter a valid MSME registration identifier (URN) above or select a preset to verify enterprise credentials and execute real-time scheme matching.
          </p>
        </div>
      )}
    </div>
  );
}
