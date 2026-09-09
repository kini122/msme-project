import React from 'react';
import Link from 'next/link';
import { Scheme } from '@/types/scheme';
import { Company } from '@/types/company';
import { SchemeMatch } from '@/types/matching';
import { MatchStatusBadge } from '@/components/matching/match-status';
import { DisclaimerBanner } from '@/components/ui/disclaimer-banner';
import { formatINR } from '@/lib/formatters/currency';
import {
  Building,
  ExternalLink,
  Users,
  MapPin,
  Tag,
  Calendar,
  Globe2,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface SchemeDetailProps {
  scheme: Scheme;
  matchingCompanies: Array<{ company: Company; match: SchemeMatch }>;
}

export function SchemeDetail({ scheme, matchingCompanies }: SchemeDetailProps) {
  return (
    <div className="space-y-8">
      {/* Scheme Metadata Dossier */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-mono px-2.5 py-0.5 rounded font-semibold uppercase ${
                  scheme.governmentType === 'Central'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {scheme.governmentType} Government
              </span>

              {scheme.shortTitle && (
                <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded">
                  {scheme.shortTitle}
                </span>
              )}

              {scheme.category && (
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-medium">
                  {scheme.category}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              {scheme.name}
            </h2>

            {scheme.ministry && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{scheme.ministry}</span>
              </div>
            )}
          </div>

          {scheme.officialUrl && (
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded text-xs font-semibold transition shrink-0 shadow-xs"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>myScheme Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Scheme Objective & Tags */}
        <div className="py-4 border-b border-slate-100 space-y-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Objective & Brief
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">
              {scheme.description || 'Detailed guidelines available on official government portal.'}
            </p>
          </div>

          {scheme.tags && scheme.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Search Tags:</span>
              {scheme.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Eligibility Rule Matrix */}
        <div className="pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Statutory Eligibility Rules Matrix
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-400 block mb-1">Target Beneficiary:</span>
              <span className="font-semibold text-slate-800">
                {scheme.schemeFor || 'MSMEs & Eligible Enterprises'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-400 block mb-1">Eligible Sectors:</span>
              <span className="font-semibold text-slate-800">
                {scheme.sectors.length === 0 ? 'All Sectors (Agnostic)' : scheme.sectors.join(', ')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-400 block mb-1">Territory / State:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {scheme.states.length === 0 ? 'Pan-India (All States/UTs)' : scheme.states.join(', ')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-400 block mb-1">Thresholds & Caps:</span>
              <div className="space-y-0.5 font-mono font-semibold text-slate-800">
                <div>Turnover: {scheme.maxTurnover ? `≤ ${formatINR(scheme.maxTurnover)}` : 'As per myScheme guidelines'}</div>
                <div>P&M Inv: {scheme.maxInvestment ? `≤ ${formatINR(scheme.maxInvestment)}` : 'Standard MSME ceiling'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matching Enterprises Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-heading text-slate-900">
                Qualifying Candidate Enterprises in Master Dataset
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800">
                {matchingCompanies.length} Units Eligible
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Enterprises from the loaded 30-company roster matching classification, sector, state, and threshold parameters
            </p>
          </div>
        </div>

        <DisclaimerBanner className="mb-6" />

        {matchingCompanies.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-500">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">
              No Enterprises in the Loaded Dataset Match This Scheme
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Verify sector or geographic restrictions, or test querying a fresh enterprise in Live Lookup.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Enterprise Name & URN</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Sector & State</th>
                    <th className="py-3 px-3 text-right">Turnover</th>
                    <th className="py-3 px-3 text-center">Match Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {matchingCompanies.map(({ company, match }) => (
                    <tr key={company.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <Link
                          href={`/companies/${company.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition block font-heading"
                        >
                          {company.companyName}
                        </Link>
                        <span className="text-[11px] font-mono text-slate-400">
                          {company.udyamNumber || 'URN Pending'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {company.classification || 'N/A'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{company.sector}</div>
                        <div className="text-[11px] text-slate-500">{company.state}</div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {formatINR(company.turnover)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <MatchStatusBadge status={match.status} score={match.score} />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/companies/${company.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white font-medium text-xs transition"
                        >
                          <span>Profile</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
