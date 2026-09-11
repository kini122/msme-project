import React from 'react';
import Link from 'next/link';
import { SchemeMatch } from '@/types/matching';
import { MatchStatusBadge } from './match-status';
import { MatchReasons } from './match-reasons';
import { ExternalLink, ArrowUpRight, Building } from 'lucide-react';

interface MatchCardProps {
  match: SchemeMatch;
  className?: string;
}

export function MatchCard({ match, className = '' }: MatchCardProps) {
  const isFailed = match.status === 'not_matched';

  return (
    <div
      className={`bg-white border rounded-lg p-5 shadow-subtle transition hover:shadow-card flex flex-col justify-between ${
        isFailed ? 'border-slate-200/80 opacity-80' : 'border-slate-200'
      } ${className}`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                  match.governmentType === 'Central'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {match.governmentType} Govt
              </span>
              {match.category && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {match.category}
                </span>
              )}
            </div>

            <Link
              href={`/schemes/${match.schemeId}`}
              className="text-sm font-bold font-heading text-slate-900 hover:text-blue-600 transition flex items-center gap-1 group"
            >
              <span>{match.schemeName}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
            </Link>

            {match.ministry && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Building className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{match.ministry}</span>
              </div>
            )}
          </div>

          <MatchStatusBadge status={match.status} score={match.score} />
        </div>

        {/* Match Score Bar */}
        {match.score !== null && (
          <div className="my-3">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
              <span>Statutory Match Score</span>
              <span className="font-mono font-bold">{match.score}/100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  match.score >= 90
                    ? 'bg-emerald-500'
                    : match.score >= 70
                    ? 'bg-blue-500'
                    : match.score >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-400'
                }`}
                style={{ width: `${Math.max(match.score, 4)}%` }}
              />
            </div>
          </div>
        )}

        {/* Itemized Reasons */}
        <div className="mt-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Statutory Assessment Breakdown:
          </div>
          <MatchReasons checks={match.checks} />
        </div>
      </div>

      {/* Footer links */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <Link
          href={`/schemes/${match.schemeId}`}
          className="font-medium text-blue-600 hover:text-blue-700 transition"
        >
          View Scheme Criteria &rarr;
        </Link>

        {match.officialUrl && (
          <a
            href={match.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
