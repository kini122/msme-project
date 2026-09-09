import React from 'react';
import Link from 'next/link';
import { Scheme } from '@/types/scheme';
import { formatINR } from '@/lib/formatters/currency';
import {
  ExternalLink,
  ArrowUpRight,
  Building,
  Users,
  MapPin,
  Tag,
  Globe2,
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  matchingCompanyCount: number;
}

export function SchemeCard({ scheme, matchingCompanyCount }: SchemeCardProps) {
  const schemeIdentifier = scheme.slug || scheme.id;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-subtle hover:shadow-card transition flex flex-col justify-between group">
      <div>
        {/* Header Tags & Status */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                scheme.governmentType === 'Central'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {scheme.governmentType} Govt
            </span>

            {scheme.shortTitle && (
              <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                {scheme.shortTitle}
              </span>
            )}

            {scheme.category && (
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium truncate max-w-[140px]">
                {scheme.category}
              </span>
            )}
          </div>

          <Link
            href={`/schemes/${schemeIdentifier}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition shadow-2xs"
            title="Candidate enterprises in dataset meeting basic eligibility criteria"
          >
            <Users className="w-3 h-3 text-emerald-600" />
            <span>{matchingCompanyCount} Matches</span>
          </Link>
        </div>

        {/* Title */}
        <Link
          href={`/schemes/${schemeIdentifier}`}
          className="text-base font-bold font-heading text-slate-900 group-hover:text-blue-600 transition block mb-1.5 leading-snug"
        >
          {scheme.name}
        </Link>

        {scheme.ministry && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{scheme.ministry}</span>
          </div>
        )}

        {/* Description */}
        {scheme.description && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {scheme.description}
          </p>
        )}

        {/* Search tags if available from myScheme */}
        {scheme.tags && scheme.tags.length > 0 && (
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            <Tag className="w-3 h-3 text-slate-400 shrink-0" />
            {scheme.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono"
              >
                #{tag}
              </span>
            ))}
            {scheme.tags.length > 3 && (
              <span className="text-[10px] text-slate-400">
                +{scheme.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Attribute Pills */}
        <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Jurisdiction:</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1 truncate max-w-[180px]">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {scheme.states.length === 0 ? 'All India (Central)' : scheme.states.join(', ')}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Sector Scope:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[180px]">
              {scheme.sectors.length === 0 ? 'All Industry Sectors' : scheme.sectors.join(', ')}
            </span>
          </div>

          {(scheme.maxTurnover || scheme.maxInvestment) ? (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Financial Cap:</span>
              <span className="font-mono font-semibold text-slate-700">
                {scheme.maxTurnover ? `Turn: ≤ ${formatINR(scheme.maxTurnover)}` : ''}
                {scheme.maxTurnover && scheme.maxInvestment ? ' | ' : ''}
                {scheme.maxInvestment ? `P&M: ≤ ${formatINR(scheme.maxInvestment)}` : ''}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Data Source:</span>
              <span className="font-mono font-semibold text-slate-600 flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-blue-500" />
                <span>{scheme.source === 'myscheme' ? 'myScheme.gov.in Mirror' : 'Curated Dataset'}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <Link
          href={`/schemes/${schemeIdentifier}`}
          className="font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
        >
          <span>Inspect Scheme & Matching Units</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        {scheme.officialUrl && (
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 transition"
            title="Open official portal on myScheme.gov.in"
          >
            <span>myScheme</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
