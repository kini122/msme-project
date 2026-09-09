'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { SchemeDetail } from '@/components/schemes/scheme-detail';
import { getMatchingCompaniesForScheme } from '@/lib/matching/match-company';
import { useAppData } from '@/lib/store/app-data-context';
import { Scheme } from '@/types/scheme';
import { ArrowLeft, FileCheck2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SchemeDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { companies, schemes, addSchemes } = useAppData();
  const [scheme, setScheme] = React.useState<Scheme | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!id) return;

    // Check unified store first
    const foundInStore = schemes.find(
      (s) => s.id === id || s.slug === id
    );

    if (foundInStore) {
      setScheme(foundInStore);
      setLoading(false);
      return;
    }

    // Otherwise fetch from /api/schemes/[slug]
    const fetchRemoteScheme = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/schemes/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.success && data.scheme) {
          setScheme(data.scheme);
          addSchemes([data.scheme]); // Cache in unified store
        } else {
          setScheme(null);
        }
      } catch (e) {
        console.error('Error fetching scheme by slug:', e);
        setScheme(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRemoteScheme();
  }, [id, schemes, addSchemes]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Scheme..."
          breadcrumbs={[
            { label: 'Overview', href: '/overview' },
            { label: 'Schemes', href: '/schemes' },
            { label: 'Loading' },
          ]}
        />
        <div className="bg-white border border-slate-200 rounded-lg p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <h4 className="font-bold text-sm text-slate-800">
            Fetching Statutory Scheme Information...
          </h4>
          <p className="text-xs text-slate-400">
            Retrieving policy directives and eligibility parameters.
          </p>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Scheme Not Found"
          breadcrumbs={[
            { label: 'Overview', href: '/overview' },
            { label: 'Schemes', href: '/schemes' },
            { label: 'Not Found' },
          ]}
        />
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          <FileCheck2 className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-base text-slate-800">
            Government Scheme &quot;{id}&quot; Not Found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            The requested scheme record does not exist in the active national directory.
          </p>
          <div className="mt-5">
            <Link
              href="/schemes"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Scheme Explorer</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Compute matching candidate companies from all loaded & cached enterprises
  const matchingCompanies = getMatchingCompaniesForScheme(scheme, companies);

  return (
    <div className="space-y-6">
      <PageHeader
        title={scheme.name}
        description={`Statutory criteria and registered MSME candidate matching for ${scheme.ministry || 'Government Policy'}.`}
        breadcrumbs={[
          { label: 'Overview', href: '/overview' },
          { label: 'Schemes', href: '/schemes' },
          { label: scheme.name },
        ]}
        source={scheme.source === 'myscheme' ? 'rapidapi' : 'mock'}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/schemes"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Explorer</span>
            </Link>
          </div>
        }
      />

      <SchemeDetail scheme={scheme} matchingCompanies={matchingCompanies} />
    </div>
  );
}
