import { MatchCheck, MatchStatus } from '@/types/matching';

export const CRITERIA_WEIGHTS = {
  classification: 30,
  sector: 25,
  state: 20,
  turnover: 15,
  investment: 10,
};

export function calculateMatchScoreAndStatus(checks: MatchCheck[]): {
  score: number | null;
  status: MatchStatus;
} {
  const hasHardFailure = checks.some(c => c.state === 'fail');
  const allUnknown = checks.every(c => c.state === 'unknown');

  if (allUnknown) {
    return {
      score: null,
      status: 'unknown',
    };
  }

  let totalScore = 0;
  let hasAnyUnknown = false;

  for (const check of checks) {
    const weight = CRITERIA_WEIGHTS[check.key] || 0;
    if (check.state === 'pass' || check.state === 'not_applicable') {
      totalScore += weight;
    } else if (check.state === 'unknown') {
      hasAnyUnknown = true;
    }
  }

  // If any hard failure exists, it overrides the positive score
  if (hasHardFailure) {
    return {
      score: Math.min(totalScore, 40), // Capped for failed matches
      status: 'not_matched',
    };
  }

  let status: MatchStatus;
  if (totalScore >= 90) {
    status = 'strong_match';
  } else if (totalScore >= 70) {
    status = 'possible_match';
  } else if (totalScore > 0) {
    status = hasAnyUnknown ? 'possible_match' : 'low_match';
  } else {
    status = 'not_matched';
  }

  return {
    score: totalScore,
    status,
  };
}
