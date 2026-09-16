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
    case 'enterprise_scope':
      if (state === 'pass') {
        return 'Scheme provides commercial enterprise, statutory capital subsidy, or industrial assistance.';
      }
      return 'Scheme is targeted for individual citizen / student / academic welfare, not applicable to commercial MSME enterprises.';

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
        return `Company registered in "${company.state || 'Kerala'}" matches scheme jurisdiction.`;
      }
      if (state === 'fail') {
        return `Scheme restricted to ${scheme.states.join(', ')}; company is registered in "${company.state || 'Kerala'}".`;
      }
      return 'State jurisdiction is missing in company profile.';

    case 'turnover':
      if (state === 'pass') {
        if (!scheme.maxTurnover && !scheme.minTurnover) {
          return 'No strict turnover ceiling or floor specified for this scheme.';
        }
        if (company.turnover != null) {
          return `Reported turnover ${formatINR(company.turnover)} complies with threshold (Max: ${formatINR(scheme.maxTurnover)}).`;
        }
        return `Turnover pending verification entry. Enterprise verified as ${company.classification || 'MSME'} class (statutory ceiling ≤ ${company.classification === 'Micro' ? '₹5 Cr' : company.classification === 'Small' ? '₹50 Cr' : '₹250 Cr'}).`;
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
      return 'Turnover pending verification entry. Use "Edit / Enrich KPIs" to input client financial figures.';

    case 'investment':
      if (state === 'pass') {
        if (!scheme.maxInvestment && !scheme.minInvestment) {
          return 'No plant & machinery investment ceiling configured.';
        }
        if (company.investment != null) {
          return `Investment ${formatINR(company.investment)} is within scheme limits (Max: ${formatINR(scheme.maxInvestment)}).`;
        }
        return `P&M investment pending verification entry. Enterprise verified as ${company.classification || 'MSME'} class (statutory ceiling ≤ ${company.classification === 'Micro' ? '₹1 Cr' : company.classification === 'Small' ? '₹10 Cr' : '₹50 Cr'}).`;
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
      return 'Plant & Machinery investment value pending verification entry.';

    case 'export_kpi':
      if (state === 'pass') {
        return `Active exporter status confirmed (${company.kpis?.exportTurnoverPercentage || 0}% export turnover share).`;
      }
      return 'Enterprise is not designated as an active exporter in company KPIs.';

    case 'green_kpi':
      if (state === 'pass') {
        return 'Green energy / rooftop solar adoption verified.';
      }
      return 'Clean energy / solar adoption is not configured in enterprise KPIs.';

    case 'tech_quality_kpi':
      if (state === 'pass') {
        return `ZED / Quality certification verified (${company.kpis?.zedCertification || 'Standard Compliant'}).`;
      }
      return 'ZED certification or quality upgrade investment required.';

    case 'credit_kpi':
      return 'Debt and credit guarantee facility applicable.';

    case 'social_kpi':
      if (state === 'pass') {
        return `Inclusive ownership requirements met (${company.kpis?.womenOwnershipPercentage ? `${company.kpis.womenOwnershipPercentage}% Women` : `${company.kpis?.scStOwnershipPercentage}% SC/ST`}).`;
      }
      return 'Scheme requires majority Women or SC/ST promoter ownership (≥51%).';

    default:
      return 'Criterion evaluated.';
  }
}
