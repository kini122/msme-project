import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function DisclaimerBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-start gap-3 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-md text-amber-950 text-xs leading-relaxed ${className}`}>
      <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
      <p>
        <span className="font-bold text-amber-950">Statutory Notice:</span> Scheme eligibility evaluations are calculated against published Central and State government guidelines. Formal sanction and subsidy disbursement are subject to official nodal agency review.
      </p>
    </div>
  );
}
