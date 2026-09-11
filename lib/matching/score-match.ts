import { MatchCheck, MatchStatus } from '@/types/matching';

export const CRITERIA_WEIGHTS: Record<string, number> = {
  enterprise_scope: 30,
  classification: 25,
  sector: 30,
  state: 20,
  turnover: 15,
  investment: 15,
  export_kpi: 25,
  green_kpi: 20,
  tech_quality_kpi: 20,
  credit_kpi: 15,
  social_kpi: 25,
};

export function calculateMatchScoreAndStatus(checks: MatchCheck[]): {
  score: number | null;
  status: MatchStatus;
} {
  if (!checks || checks.length === 0) {
    return { score: null, status: 'unknown' };
  }

  const allUnknown = checks.every((c) => c.state === 'unknown');
  if (allUnknown) {
    return { score: null, status: 'unknown' };
  }

  let earnedWeight = 0;
  let totalApplicableWeight = 0;
  let requiredFails = 0;

  for (const check of checks) {
    if (check.state === 'not_applicable') continue;

    const weight = CRITERIA_WEIGHTS[check.key] || 15;
    totalApplicableWeight += weight;

    if (check.state === 'pass') {
      earnedWeight += weight;
    } else if (check.state === 'unknown') {
      earnedWeight += weight * 0.5; // Partial credit for unverified optional fields
    } else if (check.state === 'fail') {
      if (check.required) {
        requiredFails++;
      }
    }
  }

  if (totalApplicableWeight === 0) {
    return { score: 50, status: 'possible_match' };
  }

  // Base percentage calculation (0 to 100)
  let rawPercentage = Math.round((earnedWeight / totalApplicableWeight) * 100);

  // Progressive penalty for required failures instead of a flat 30% clamping
  let finalScore = rawPercentage;
  if (requiredFails > 0) {
    // Each hard failure scales down the confidence progressively
    const penaltyFactor = Math.pow(0.65, requiredFails);
    finalScore = Math.max(10, Math.round(rawPercentage * penaltyFactor));
  }

  // Determine status tier
  let status: MatchStatus;
  if (finalScore >= 85) {
    status = 'strong_match';
  } else if (finalScore >= 60) {
    status = 'possible_match';
  } else if (finalScore >= 35) {
    status = 'low_match';
  } else {
    status = 'not_matched';
  }

  return {
    score: finalScore,
    status,
  };
}
