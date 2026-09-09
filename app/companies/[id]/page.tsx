'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { CompanyProfile } from '@/components/companies/company-profile';
import { matchCompanyToAllSchemes } from '@/lib/matching/match-company';
import { useAppData } from '@/lib/store/app-data-context';
import { Company } from '@/types/company';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { companies, schemes } = useAppData();

  const company = React.useMemo<Company | null>(() => {
    if (!id) return null;
    return companies.find((c) => c.id === id || c.udyamNumber === id) || null;
  }, [id, companies]);

  if (!company) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Enterprise Record Not Found"
          breadcrumbs={[
            { label: 'Overview', href: '/overview' },
            { label: 'Companies', href: '/companies' },
            { label: 'Not Found' },
          ]}
        />
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-base text-slate-800">
            Enterprise Record &quot;{id}&quot; Not Found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            The requested company identifier does not exist in the active registry.
          </p>
          <div className="mt-5">
            <Link
              href="/companies"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Master List</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Run deterministic matching engine against all schemes
  const matches = matchCompanyToAllSchemes(company, schemes);

  return (
    <div className="space-y-6">
      <PageHeader
        title={company.companyName}
        description={`Detailed statutory MSME profile for ${company.udyamNumber || 'URN Pending'} with real-time scheme eligibility analysis.`}
        breadcrumbs={[
          { label: 'Overview', href: '/overview' },
          { label: 'Companies', href: '/companies' },
          { label: company.companyName },
        ]}
        source={company.source}
        fetchedAt={company.fetchedAt}
        actions={
          <Link
            href="/companies"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Roster</span>
          </Link>
        }
      />

      <CompanyProfile company={company} matches={matches} />
    </div>
  );
}
