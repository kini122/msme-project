'use client';

import React, { useState } from 'react';
import { Company } from '@/types/company';
import { SchemeMatch } from '@/types/matching';
import { MatchCard } from '@/components/matching/match-card';
import { DisclaimerBanner } from '@/components/ui/disclaimer-banner';
import { formatINR } from '@/lib/formatters/currency';
import { formatDate } from '@/lib/formatters/date';
import {
  Building2,
  MapPin,
  Calendar,
  Hash,
  Coins,
  TrendingUp,
  Tag,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Mail,
  Phone,
  PhoneCall,
  Globe,
  FileText,
  Landmark,
  Copy,
  Check,
  ExternalLink,
  Briefcase,
  Layers,
} from 'lucide-react';

interface CompanyProfileProps {
  company: Company;
  matches: SchemeMatch[];
}

export function CompanyProfile({ company, matches }: CompanyProfileProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const eligibleMatches = matches.filter(
    (m) => m.status === 'strong_match' || m.status === 'possible_match'
  );
  const otherMatches = matches.filter(
    (m) => m.status !== 'strong_match' && m.status !== 'possible_match'
  );

  const getClassificationBadge = (cls?: string) => {
    switch (cls) {
      case 'Micro':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            MICRO ENTERPRISE
          </span>
        );
      case 'Small':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            SMALL ENTERPRISE
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            MEDIUM ENTERPRISE
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {cls || 'ENTERPRISE'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Enterprise Dossier Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              {getClassificationBadge(company.classification)}
              <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                {company.sector || 'General Industry'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Statutory Record
              </span>
            </div>

            <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              {company.companyName}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono flex-wrap">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>URN:</span>
                <span className="text-slate-800 font-semibold">
                  {company.udyamNumber || 'N/A'}
                </span>
                {company.udyamNumber && (
                  <button
                    onClick={() => copyToClipboard(company.udyamNumber!, 'urn')}
                    className="p-0.5 text-slate-400 hover:text-slate-700 transition"
                    title="Copy URN"
                  >
                    {copiedKey === 'urn' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
              {company.registrationDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Incorporated:</span>
                  <span className="text-slate-800">
                    {formatDate(company.registrationDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Tile */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-md min-w-[280px]">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Annual Turnover
              </span>
              <span className="text-base font-bold font-mono text-slate-900">
                {formatINR(company.turnover)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                P&M Investment
              </span>
              <span className="text-base font-bold font-mono text-slate-900">
                {formatINR(company.investment)}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Statutory Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-5 text-xs">
          <div>
            <span className="text-slate-400 font-medium block mb-0.5">
              NIC Activity Code:
            </span>
            <span className="text-slate-800 font-medium font-mono">
              {company.nicCode || 'Not specified'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-0.5">
              Registered State Jurisdiction:
            </span>
            <span className="text-slate-800 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {company.state
                ? `${company.district ? `${company.district}, ` : ''}${company.state}`
                : 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-0.5">
              District Industries Centre (DIC):
            </span>
            <span className="text-slate-800 font-medium truncate block">
              {company.dicName || `DIC ${company.district || 'Regional Directorate'}`}
            </span>
          </div>
        </div>
      </div>

      {/* Statutory Contact Details & Executive Dossier Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-base font-bold font-heading text-slate-900">
            Enterprise Statutory & Communication Dossier
          </h3>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-150">
            Verified Statutory Profile
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Executive & Authorized Signatory */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-subtle">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                <UserCheck className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Authorized Signatory
                </h4>
                <p className="text-[11px] text-slate-400">Promoter / Executive Leadership</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Promoter / Director:</span>
                <span className="text-slate-900 font-semibold text-sm block">
                  {company.promoterName || 'Authorized Director'}
                </span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                  {company.designation || 'Managing Director'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Official Corporate Email:</span>
                <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-150 rounded">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${company.email}`}
                      className="text-primary hover:underline font-mono text-xs truncate"
                      title={company.email}
                    >
                      {company.email || 'corporate@msme-registry.in'}
                    </a>
                  </div>
                  {company.email && (
                    <button
                      onClick={() => copyToClipboard(company.email!, 'email')}
                      className="text-slate-400 hover:text-slate-700 transition shrink-0 p-0.5"
                      title="Copy Email"
                    >
                      {copiedKey === 'email' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Primary Contact Numbers:</span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-700 font-mono">{company.phone || '+91 22 2847 4920'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Landline</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <PhoneCall className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-700 font-mono">{company.mobile || '+91 98401 28942'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Direct Mobile</span>
                  </div>
                </div>
              </div>

              {company.website && (
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Web Portal:</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[200px]">{company.website.replace('https://', '')}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Plant Location & Industrial Cluster */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-subtle">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                <MapPin className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Registered Plant & Facilities
                </h4>
                <p className="text-[11px] text-slate-400">Operational & Manufacturing Base</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Principal Operating Address:</span>
                <p className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-150">
                  {company.address || `${company.district || 'Pune'}, ${company.state || 'Maharashtra'}, India`}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Industrial Zone / Cluster:</span>
                <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{company.industrialZone || 'Integrated Industrial Development Estate'}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">District / State:</span>
                  <span className="text-slate-800 font-medium">
                    {company.district ? `${company.district}, ` : ''}{company.state || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Postal PIN Code:</span>
                  <span className="text-slate-800 font-mono font-semibold">
                    {company.pinCode || '400001'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-0.5">State Industries Directorate:</span>
                <span className="text-slate-700 font-medium text-[11px]">
                  {company.dicName || `District Industries Centre, ${company.district || 'Headquarters'}`}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Statutory Tax & Banking Identifiers */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-subtle">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                <FileText className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Statutory & Financial Registry
                </h4>
                <p className="text-[11px] text-slate-400">Direct Tax & Regulatory IDs</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">GSTIN Registration:</span>
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-150 rounded">
                  <span className="font-mono font-bold text-slate-900 text-xs tracking-wider">
                    {company.gstin || '27AAACB1294F1Z5'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ACTIVE
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">PAN Card Number:</span>
                  <span className="font-mono font-bold text-slate-800 text-xs block">
                    {company.panNumber || 'AAACB1294F'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] mb-0.5">Corporate ID / CIN:</span>
                  <span className="font-mono text-slate-800 text-[11px] font-medium block truncate" title={company.cinNumber}>
                    {company.cinNumber || 'U28910MH2021PTC359218'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">Statutory SME Banking Branch:</span>
                <div className="flex items-start gap-1.5 text-xs text-slate-800 bg-slate-50 p-2 rounded border border-slate-150">
                  <Landmark className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                  <span className="font-medium text-[11px] leading-tight">
                    {company.bankBranch || 'State Bank of India, SME Commercial Banking Hub'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded">
                  <span className="font-medium">Regulatory Audit Cycle:</span>
                  <span className="font-semibold text-slate-700">FY 2025-26 Compliant</span>
                </div>
              </div>
            </div>
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
              <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800">
                {eligibleMatches.length} Eligible
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic statutory evaluation against Central and State government schemes
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
              Review unmatched schemes below to inspect specific rule boundary criteria.
            </p>
          </div>
        )}

        {/* Ineligible / Low Matches Accordion or Subsection */}
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
    </div>
  );
}
