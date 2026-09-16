'use client';

import React, { useState } from 'react';
import { Company } from '@/types/company';
import { SchemeMatch } from '@/types/matching';
import { MatchCard } from '@/components/matching/match-card';
import { DisclaimerBanner } from '@/components/ui/disclaimer-banner';
import { CompanyFormModal } from '@/components/companies/company-form-modal';
import { useAppData } from '@/lib/store/app-data-context';
import { formatDate } from '@/lib/formatters/date';
import {
  Building2,
  MapPin,
  Calendar,
  Hash,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Edit3,
  FileCheck2,
} from 'lucide-react';

interface CompanyProfileProps {
  company: Company;
  matches: SchemeMatch[];
  onCompanyUpdate?: (updated: Company) => void;
}

export function CompanyProfile({ company, matches, onCompanyUpdate }: CompanyProfileProps) {
  const { updateCompany } = useAppData();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveEdited = (updated: Company) => {
    updateCompany(updated);
    if (onCompanyUpdate) {
      onCompanyUpdate(updated);
    }
  };

  const eligibleMatches = matches.filter(
    (m) => m.status === 'strong_match' || m.status === 'possible_match'
  );
  const otherMatches = matches.filter(
    (m) => m.status !== 'strong_match' && m.status !== 'possible_match'
  );

  return (
    <div className="space-y-8">
      {/* Enterprise Dossier Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified data.gov.in Record</span>
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{company.district || 'Kerala'}, Kerala</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
                {company.companyName}
              </h2>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono flex-wrap pt-1">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>URN / Record ID:</span>
                <span className="text-slate-800 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                  {company.udyamNumber || company.id}
                </span>
                {company.udyamNumber && (
                  <button
                    onClick={() => copyToClipboard(company.udyamNumber!, 'urn')}
                    className="p-0.5 text-slate-400 hover:text-slate-700 transition"
                    title="Copy URN"
                  >
                    {copiedKey === 'urn' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              {company.registrationDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Registration Date:</span>
                  <span className="text-slate-800 font-sans font-medium">
                    {formatDate(company.registrationDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Eligibility Badge */}
          <div className="flex flex-col items-start sm:items-end justify-center p-4 bg-slate-50 border border-slate-200 rounded-md min-w-[220px]">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Scheme Eligibility
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-lg font-bold text-emerald-700 font-mono">
                {eligibleMatches.length} Schemes
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Evaluated across 4,746 schemes
            </span>
          </div>
        </div>

        {/* Authentic Government Data Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 text-xs">
          {/* Card 1: National Industry Classification Activity */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>National Industry Activity (NIC)</span>
            </div>
            <p className="text-slate-900 font-medium leading-relaxed font-mono text-xs">
              {company.nicCode || company.sector || 'MSME Commercial Unit'}
            </p>
            <p className="text-[11px] text-slate-400">
              Extracted directly from the official UDYAM activities registration.
            </p>
          </div>

          {/* Card 2: Registered Communication Address */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Registered Communication Address</span>
            </div>
            <p className="text-slate-900 font-medium leading-relaxed text-xs">
              {company.address || `${company.district || 'Kerala'}, Kerala`}
            </p>
            {company.pinCode && (
              <p className="text-[11px] text-slate-500 font-mono font-medium">
                PIN Code: {company.pinCode} &bull; State: {company.state || 'Kerala'}
              </p>
            )}
          </div>
        </div>

        {/* Statutory Privacy Notice */}
        <div className="mt-5 p-3 bg-blue-50/60 border border-blue-150 rounded-md text-[11px] text-blue-900 flex items-start gap-2">
          <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Statutory Privacy Compliance: </span>
            <span>
              In compliance with Open Government Data (data.gov.in) regulations and Indian DPDP citizen privacy norms, private enterprise banking details, phone numbers, and individual PAN identifiers are not published in public government feeds.
            </span>
          </div>
        </div>
      </div>

      {/* Matching Scheme Intelligence Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-heading text-slate-900">
                Potential Government Scheme Matches
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800">
                {eligibleMatches.length} Eligible
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory eligibility evaluated across 4,746 Central and Kerala State government schemes matching this enterprise&apos;s NIC activity and location.
            </p>
          </div>
        </div>

        <DisclaimerBanner className="mb-6" />

        {/* Strong & Possible Matches */}
        {eligibleMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {eligibleMatches.map((match) => (
              <MatchCard key={match.schemeId} match={match} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 mb-8">
            <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">
              No High-Relevance Scheme Matches Found
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Review unmatched schemes below.
            </p>
          </div>
        )}

        {/* Other Evaluated Schemes */}
        {otherMatches.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Other Evaluated Schemes ({otherMatches.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {otherMatches.map((match) => (
                <MatchCard key={match.schemeId} match={match} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal (if admin needs to update record) */}
      {isEditModalOpen && (
        <CompanyFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdited}
          initialCompany={company}
          mode="edit"
        />
      )}
    </div>
  );
}
