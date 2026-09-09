import { Company } from '@/types/company';
import { Scheme } from '@/types/scheme';
import { MatchCheck, RuleState, SchemeMatch } from '@/types/matching';
import { generateExplanation } from './explanations';
import { calculateMatchScoreAndStatus } from './score-match';

function normalizeText(str?: string | null): string {
  return (str || '').trim().toLowerCase();
}

export function matchCompanyToScheme(company: Company, scheme: Scheme): SchemeMatch {
  const checks: MatchCheck[] = [];

  // 1. Evaluate Classification
  let classState: RuleState;
  if (!company.classification) {
    classState = 'unknown';
  } else if (!scheme.classifications || scheme.classifications.length === 0) {
    classState = 'pass';
  } else {
    const isSupported = scheme.classifications.some(
      c => normalizeText(c) === normalizeText(company.classification)
    );
    classState = isSupported ? 'pass' : 'fail';
  }

  checks.push({
    key: 'classification',
    label: 'MSME Classification',
    state: classState,
    required: true,
    reason: generateExplanation('classification', classState, company, scheme),
  });

  // 2. Evaluate Sector
  let sectorState: RuleState;
  if (!scheme.sectors || scheme.sectors.length === 0) {
    sectorState = 'pass'; // Agnostic
  } else if (!company.sector) {
    sectorState = 'unknown';
  } else {
    const compSector = normalizeText(company.sector);
    const isSectorMatched = scheme.sectors.some(s => {
      const normSchemeSector = normalizeText(s);
      return (
        compSector.includes(normSchemeSector) ||
        normSchemeSector.includes(compSector)
      );
    });
    sectorState = isSectorMatched ? 'pass' : 'fail';
  }

  checks.push({
    key: 'sector',
    label: 'Industry Sector',
    state: sectorState,
    required: true,
    reason: generateExplanation('sector', sectorState, company, scheme),
  });

  // 3. Evaluate State / UT
  let stateState: RuleState;
  if (!scheme.states || scheme.states.length === 0) {
    stateState = 'pass'; // Pan-India
  } else if (!company.state) {
    stateState = 'unknown';
  } else {
    const compState = normalizeText(company.state);
    const isStateMatched = scheme.states.some(
      st => normalizeText(st) === compState
    );
    stateState = isStateMatched ? 'pass' : 'fail';
  }

  checks.push({
    key: 'state',
    label: 'State / Jurisdiction',
    state: stateState,
    required: true,
    reason: generateExplanation('state', stateState, company, scheme),
  });

  // 4. Evaluate Turnover
  let turnoverState: RuleState;
  if (scheme.maxTurnover == null && scheme.minTurnover == null) {
    turnoverState = 'pass';
  } else if (company.turnover == null) {
    turnoverState = 'unknown';
  } else {
    let passes = true;
    if (scheme.maxTurnover != null && company.turnover > scheme.maxTurnover) {
      passes = false;
    }
    if (scheme.minTurnover != null && company.turnover < scheme.minTurnover) {
      passes = false;
    }
    turnoverState = passes ? 'pass' : 'fail';
  }

  checks.push({
    key: 'turnover',
    label: 'Annual Turnover Limit',
    state: turnoverState,
    required: true,
    reason: generateExplanation('turnover', turnoverState, company, scheme),
  });

  // 5. Evaluate Investment in Plant & Machinery
  let investmentState: RuleState;
  if (scheme.maxInvestment == null && scheme.minInvestment == null) {
    investmentState = 'pass';
  } else if (company.investment == null) {
    investmentState = 'unknown';
  } else {
    let passes = true;
    if (scheme.maxInvestment != null && company.investment > scheme.maxInvestment) {
      passes = false;
    }
    if (scheme.minInvestment != null && company.investment < scheme.minInvestment) {
      passes = false;
    }
    investmentState = passes ? 'pass' : 'fail';
  }

  checks.push({
    key: 'investment',
    label: 'Plant & Machinery Investment',
    state: investmentState,
    required: false,
    reason: generateExplanation('investment', investmentState, company, scheme),
  });

  const { score, status } = calculateMatchScoreAndStatus(checks);

  return {
    schemeId: scheme.id,
    schemeName: scheme.name,
    category: scheme.category,
    governmentType: scheme.governmentType,
    ministry: scheme.ministry,
    officialUrl: scheme.officialUrl,
    score,
    status,
    checks,
  };
}

export function matchCompanyToAllSchemes(company: Company, schemes: Scheme[]): SchemeMatch[] {
  return schemes
    .map(scheme => matchCompanyToScheme(company, scheme))
    .sort((a, b) => {
      // Sort by match status priority and then score
      const statusWeight: Record<string, number> = {
        strong_match: 4,
        possible_match: 3,
        low_match: 2,
        unknown: 1,
        not_matched: 0,
      };
      const diff = (statusWeight[b.status] || 0) - (statusWeight[a.status] || 0);
      if (diff !== 0) return diff;
      return (b.score || 0) - (a.score || 0);
    });
}

export function getMatchingCompaniesForScheme(
  scheme: Scheme,
  companies: Company[]
): Array<{ company: Company; match: SchemeMatch }> {
  return companies
    .map(company => ({
      company,
      match: matchCompanyToScheme(company, scheme),
    }))
    .filter(item => item.match.status !== 'not_matched')
    .sort((a, b) => (b.match.score || 0) - (a.match.score || 0));
}
