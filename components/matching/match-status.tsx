import React from 'react';
import { MatchStatus } from '@/types/matching';
import { CheckCircle2, HelpCircle, AlertCircle, XCircle } from 'lucide-react';

interface MatchStatusBadgeProps {
  status: MatchStatus;
  score?: number | null;
  className?: string;
  showIcon?: boolean;
}

export function MatchStatusBadge({
  status,
  score,
  className = '',
  showIcon = true,
}: MatchStatusBadgeProps) {
  let label = 'Unknown';
  let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = HelpCircle;

  switch (status) {
    case 'strong_match':
      label = 'Strong Match';
      badgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
      Icon = CheckCircle2;
      break;
    case 'possible_match':
      label = 'Possible Match';
      badgeClasses = 'bg-blue-50 text-blue-800 border-blue-300 font-medium';
      Icon = CheckCircle2;
      break;
    case 'low_match':
      label = 'Low Match';
      badgeClasses = 'bg-amber-50 text-amber-800 border-amber-300';
      Icon = AlertCircle;
      break;
    case 'not_matched':
      label = 'Not Matched';
      badgeClasses = 'bg-rose-50 text-rose-800 border-rose-200';
      Icon = XCircle;
      break;
    case 'unknown':
    default:
      label = 'Incomplete Data';
      badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      Icon = HelpCircle;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${badgeClasses} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
      {score !== null && score !== undefined && (
        <span className="ml-1 pl-1 border-l border-current/20 font-mono text-[11px]">
          {score}%
        </span>
      )}
    </span>
  );
}
