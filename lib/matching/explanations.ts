import { Company } from '@/types/company';
import { Scheme } from '@/types/scheme';
import { MatchCheckKey, RuleState } from '@/types/matching';
import { formatINR } from '../formatters/currency';

export function generateExplanation(
  key: MatchCheckKey,
  state: RuleState,
  company: Company,
  scheme: Scheme
): string {
  switch (key) {
    case 'classification':
      if (state === 'pass') {
        return `Enterprise classification "${company.classification}" is supported by scheme (${scheme.classifications.join(', ')}).`;
      }
      if (state === 'fail') {
        return `Classification "${company.classification || 'Unknown'}" is not supported. Eligible: ${scheme.classifications.join(', ')}.`;
      }
      return 'Enterprise classification is missing in company record.';

    case 'sector':
      if (state === 'pass') {
        if (!scheme.sectors || scheme.sectors.length === 0) {
          return 'Scheme is sector-agnostic (open to all industry sectors).';
        }
        return `Sector "${company.sector}" matches scheme eligible sectors.`;
      }
      if (state === 'fail') {
        return `Sector "${company.sector || 'Unknown'}" is outside scheme scope (${scheme.sectors.join(', ')}).`;
      }
      return 'Sector information is unavailable in company record.';

    case 'state':
      if (state === 'pass') {
        if (!scheme.states || scheme.states.length === 0) {
          return 'Pan-India Central Scheme with no state restrictions.';
        }
        return `Company registered state "${company.state}" matches scheme jurisdiction.`;
      }
      if (state === 'fail') {
        return `Scheme restricted to ${scheme.states.join(', ')}; company is registered in "${company.state || 'Unknown'}".`;
      }
      return 'State jurisdiction is missing in company profile.';

    case 'turnover':
      if (state === 'pass') {
        if (!scheme.maxTurnover && !scheme.minTurnover) {
          return 'No strict turnover ceiling or floor specified for this scheme.';
        }
        return `Reported turnover ${formatINR(company.turnover)} complies with threshold (Max: ${formatINR(scheme.maxTurnover)}).`;
      }
      if (state === 'fail') {
        if (scheme.maxTurnover && company.turnover && company.turnover > scheme.maxTurnover) {
          return `Turnover ${formatINR(company.turnover)} exceeds maximum ceiling of ${formatINR(scheme.maxTurnover)}.`;
        }
        if (scheme.minTurnover && company.turnover && company.turnover < scheme.minTurnover) {
          return `Turnover ${formatINR(company.turnover)} is below minimum requirement of ${formatINR(scheme.minTurnover)}.`;
        }
        return 'Turnover does not meet scheme financial parameters.';
      }
      return 'Turnover data is missing or not provided by live source.';

    case 'investment':
      if (state === 'pass') {
        if (!scheme.maxInvestment && !scheme.minInvestment) {
          return 'No plant & machinery investment ceiling configured.';
        }
        return `Investment ${formatINR(company.investment)} is within scheme limits (Max: ${formatINR(scheme.maxInvestment)}).`;
      }
      if (state === 'fail') {
        if (scheme.maxInvestment && company.investment && company.investment > scheme.maxInvestment) {
          return `Investment in P&M ${formatINR(company.investment)} exceeds ceiling of ${formatINR(scheme.maxInvestment)}.`;
        }
        if (scheme.minInvestment && company.investment && company.investment < scheme.minInvestment) {
          return `Investment ${formatINR(company.investment)} is below required minimum of ${formatINR(scheme.minInvestment)}.`;
        }
        return 'Investment in Plant & Machinery does not meet scheme threshold.';
      }
      return 'Plant & Machinery investment value is unavailable.';

    default:
      return 'Criterion evaluated.';
  }
}
