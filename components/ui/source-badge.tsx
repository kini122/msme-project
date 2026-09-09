import React from 'react';
import { ShieldCheck, Building2 } from 'lucide-react';
import { formatTimestamp } from '@/lib/formatters/date';

interface SourceBadgeProps {
  source?: 'mock' | 'rapidapi' | 'myscheme';
  fetchedAt?: string;
  className?: string;
}

export function SourceBadge({ source, fetchedAt, className = '' }: SourceBadgeProps) {
  if (source === 'rapidapi' || source === 'myscheme') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold shadow-xs ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Verified Live Record</span>
        {fetchedAt && (
          <span className="text-emerald-700/80 border-l border-emerald-200 pl-1.5 text-[11px] font-mono">
            {formatTimestamp(fetchedAt)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-medium ${className}`}>
      <Building2 className="w-3 h-3 text-slate-500" />
      <span>National MSME Registry</span>
      <span className="text-slate-400 border-l border-slate-300 pl-1.5 text-[11px] font-mono">
        Active Index
      </span>
    </div>
  );
}
