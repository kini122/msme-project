import React from 'react';
import { MatchCheck } from '@/types/matching';
import { Check, X, HelpCircle, Minus } from 'lucide-react';

interface MatchReasonsProps {
  checks: MatchCheck[];
  className?: string;
  compact?: boolean;
}

export function MatchReasons({
  checks,
  className = '',
  compact = false,
}: MatchReasonsProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {checks.map((check) => {
        let stateIcon = <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
        let stateBg = 'bg-emerald-50/60 border-emerald-100 text-slate-800';
        let badgeColor = 'text-emerald-700 bg-emerald-100';

        if (check.state === 'fail') {
          stateIcon = <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
          stateBg = 'bg-rose-50/60 border-rose-100 text-rose-950';
          badgeColor = 'text-rose-700 bg-rose-100';
        } else if (check.state === 'unknown') {
          stateIcon = <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
          stateBg = 'bg-slate-50 border-slate-200 text-slate-600';
          badgeColor = 'text-slate-600 bg-slate-200';
        } else if (check.state === 'not_applicable') {
          stateIcon = <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
          stateBg = 'bg-slate-50 border-slate-200 text-slate-600';
          badgeColor = 'text-slate-600 bg-slate-200';
        }

        if (compact) {
          return (
            <div key={check.key} className="flex items-start gap-2 text-xs">
              <span className="mt-0.5">{stateIcon}</span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-slate-700 mr-1.5">
                  {check.label}:
                </span>
                <span className="text-slate-600">{check.reason}</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={check.key}
            className={`p-2.5 rounded border flex items-start gap-2.5 text-xs transition-colors ${stateBg}`}
          >
            <span className="mt-0.5">{stateIcon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-semibold">{check.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase font-semibold ${badgeColor}`}
                >
                  {check.state.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11.5px] leading-relaxed opacity-90">
                {check.reason}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
