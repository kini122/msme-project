import { Company } from '@/types/company';
import { Scheme } from '@/types/scheme';
import { MatchCheck, RuleState, SchemeMatch } from '@/types/matching';
import { generateExplanation } from './explanations';
import { calculateMatchScoreAndStatus } from './score-match';

function normalizeText(str?: string | null): string {
  return (str || '').trim().toLowerCase();
}

function hasKeyword(target: string, keywords: string[]): boolean {
  const norm = normalizeText(target);
  return keywords.some((kw) => norm.includes(kw));
}

const INDIVIDUAL_EXCLUSION_KEYWORDS = [
  'professorship',
  'visiting professor',
  'fellowship',
  'scholarship',
  'internship',
  'fellowship scheme',
  'student',
  'school student',
  'college student',
  'agnipath',
  'ex-servicemen',
  'widow pension',
  'old age pension',
  'artist in different cultural',
  'cultural fields',
  'teleeducation',
  'afghan students',
  'community toilet',
  'pay and use',
  'treatment of serious disease',
  'non pensioner',
  'hostel for obc',
  'coaching for sc',
  'maternity benefit',
  'disability pension',
  'bsr fellowship',
  'aicte -',
  'aicte –',
  'voluntary organizations working for welfare',
];

const COMMERCIAL_MINISTRIES = [
  'ministry of msme',
  'micro, small and medium enterprises',
  'ministry of food processing',
  'ministry of commerce',
  'ministry of agriculture',
  'ministry of heavy industries',
  'ministry of textiles',
  'ministry of electronics',
  'ministry of new and renewable energy',
  'ministry of fisheries',
  'department of industries',
  'directorate of industries',
  'kinfra',
  'ksidc',
  'sidbi',
  'kvic',
  'coir board',
  'spices board',
  'rubber board',
  'mpeda',
  'cgtmse',
];

export function matchCompanyToScheme(company: Company, scheme: Scheme): SchemeMatch {
  const checks: MatchCheck[] = [];
  const schemeFullText = `${scheme.name} ${scheme.description || ''} ${scheme.category || ''} ${scheme.ministry || ''} ${scheme.tags?.join(' ') || ''} ${scheme.schemeFor || ''}`.toLowerCase();
  const schemeSlug = (scheme.slug || scheme.id || '').toLowerCase();

  // 1. Enterprise Scope & Commercial Eligibility Gatekeeper
  const isIndividualWelfare = INDIVIDUAL_EXCLUSION_KEYWORDS.some((kw) =>
    hasKeyword(schemeFullText, [kw])
  );

  const isCommercialMinistry = COMMERCIAL_MINISTRIES.some((m) =>
    hasKeyword(scheme.ministry || '', [m]) || hasKeyword(schemeFullText, [m])
  );

  let scopeState: RuleState = 'pass';
  if (isIndividualWelfare && !isCommercialMinistry) {
    scopeState = 'fail';
  }

  checks.push({
    key: 'enterprise_scope',
    label: 'Enterprise & Commercial Scope',
    state: scopeState,
    required: true,
    reason:
      scopeState === 'pass'
        ? 'Scheme provides commercial enterprise, statutory subsidy, or industrial assistance.'
        : 'Scheme targets individual citizen, student, or academic welfare (ineligible for commercial MSME entities).',
  });

  // 2. MSME Statutory Classification Check
  let classState: RuleState;
  if (!company.classification) {
    classState = 'unknown';
  } else if (!scheme.classifications || scheme.classifications.length === 0) {
    classState = 'pass';
  } else {
    const isSupported = scheme.classifications.some(
      (c) => normalizeText(c) === normalizeText(company.classification)
    );
    classState = isSupported ? 'pass' : 'fail';
  }

  checks.push({
    key: 'classification',
    label: 'MSME Classification Eligibility',
    state: classState,
    required: true,
    reason: generateExplanation('classification', classState, company, scheme),
  });

  // 3. Sector & NIC Activity Alignment Check
  let sectorState: RuleState;
  const compSectorNorm = normalizeText(company.sector);
  const compNicNorm = normalizeText(company.nicCode);

  const isSchemeCoirOnly = schemeSlug.includes('coir') || schemeFullText.includes('coir industry');
  const isSchemeSeafoodOnly = schemeSlug.includes('mpeda') || (schemeFullText.includes('marine') && schemeFullText.includes('seafood'));
  const isSchemeITOnly = schemeSlug.includes('kerala-startup') || schemeSlug.includes('karnataka-elec') || (schemeFullText.includes('software') && !schemeFullText.includes('manufacturing'));
  const isSchemeTextileOnly = schemeFullText.includes('handloom') && !schemeFullText.includes('food');

  const isCompanyFood = compSectorNorm.includes('food') || compSectorNorm.includes('agro') || compSectorNorm.includes('spice') || compNicNorm.startsWith('10');
  const isCompanyMarine = compSectorNorm.includes('marine') || compSectorNorm.includes('seafood') || compNicNorm.startsWith('102');
  const isCompanyCoir = compSectorNorm.includes('coir') || compSectorNorm.includes('textile') || compNicNorm.startsWith('13');
  const isCompanyIT = compSectorNorm.includes('it') || compSectorNorm.includes('software') || compNicNorm.startsWith('62');

  if (isSchemeCoirOnly && !isCompanyCoir) {
    sectorState = 'fail';
  } else if (isSchemeSeafoodOnly && !isCompanyMarine && !isCompanyFood) {
    sectorState = 'fail';
  } else if (isSchemeITOnly && !isCompanyIT) {
    sectorState = 'fail';
  } else if (isSchemeTextileOnly && !isCompanyCoir) {
    sectorState = 'fail';
  } else if (!scheme.sectors || scheme.sectors.length === 0) {
    sectorState = 'pass';
  } else {
    const isSectorMatched = scheme.sectors.some((s) => {
      const normSchemeSector = normalizeText(s);
      return (
        compSectorNorm.includes(normSchemeSector) ||
        normSchemeSector.includes(compSectorNorm) ||
        compNicNorm.includes(normSchemeSector) ||
        (normSchemeSector.includes('food') && isCompanyFood) ||
        (normSchemeSector.includes('agro') && isCompanyFood) ||
        (normSchemeSector.includes('spice') && isCompanyFood) ||
        (normSchemeSector.includes('marine') && isCompanyMarine) ||
        (normSchemeSector.includes('manufacturing') && !isCompanyIT)
      );
    });
    sectorState = isSectorMatched ? 'pass' : 'fail';
  }

  checks.push({
    key: 'sector',
    label: 'Industry Sector & NIC Alignment',
    state: sectorState,
    required: true,
    reason:
      sectorState === 'pass'
        ? isCompanyFood && (schemeSlug.includes('pmfme') || schemeSlug.includes('spices'))
          ? `Primary sector match: Enterprise activity "${company.sector || 'Food Processing'}" directly aligns with scheme mandate.`
          : `Sector "${company.sector || 'Manufacturing'}" is eligible under scheme guidelines.`
        : `Sector "${company.sector || 'Manufacturing'}" is outside scheme scope (${(scheme.sectors || []).join(', ') || 'Specialized Industry'}).`,
  });

  // 4. State / Regional Jurisdiction Check
  let stateState: RuleState;
  const compStateNorm = normalizeText(company.state || 'Kerala');

  if (!scheme.states || scheme.states.length === 0) {
    stateState = 'pass';
  } else {
    const isStateMatched = scheme.states.some((st) => {
      const stNorm = normalizeText(st);
      return stNorm === compStateNorm || stNorm === 'all' || stNorm === 'pan-india' || stNorm === 'kerala';
    });
    stateState = isStateMatched ? 'pass' : 'fail';
  }

  checks.push({
    key: 'state',
    label: 'State Jurisdiction (Kerala / Central)',
    state: stateState,
    required: true,
    reason:
      stateState === 'pass'
        ? (!scheme.states || scheme.states.length === 0)
          ? 'Pan-India Central Scheme with no state restrictions.'
          : `Company registered in "${company.state || 'Kerala'}" matches scheme jurisdiction.`
        : `Scheme restricted to ${scheme.states.join(', ')}; company is registered in "${company.state || 'Kerala'}".`,
  });

  // 5. Annual Turnover Limits Check
  let turnoverState: RuleState;
  const statutoryTurnoverCeilings: Record<string, number> = {
    Micro: 50000000,     // ₹5 Cr
    Small: 500000000,   // ₹50 Cr
    Medium: 2500000000, // ₹250 Cr
  };

  const compStatutoryCeiling = statutoryTurnoverCeilings[company.classification || 'Micro'] || 50000000;

  if (scheme.maxTurnover == null && scheme.minTurnover == null) {
    turnoverState = 'pass';
  } else if (company.turnover != null) {
    let passes = true;
    if (scheme.maxTurnover != null && company.turnover > scheme.maxTurnover) {
      passes = false;
    }
    if (scheme.minTurnover != null && company.turnover < scheme.minTurnover) {
      passes = false;
    }
    turnoverState = passes ? 'pass' : 'fail';
  } else {
    // If turnover is pending audit entry, evaluate against statutory classification ceiling
    if (scheme.minTurnover != null) {
      turnoverState = 'unknown';
    } else if (scheme.maxTurnover != null && scheme.maxTurnover >= compStatutoryCeiling) {
      turnoverState = 'pass'; // Guaranteed compliant by official MSME classification
    } else {
      turnoverState = 'pass';
    }
  }

  checks.push({
    key: 'turnover',
    label: 'Annual Turnover Eligibility Threshold',
    state: turnoverState,
    required: true,
    reason: generateExplanation('turnover', turnoverState, company, scheme),
  });

  // 6. Plant & Machinery Investment Limit Check
  let investmentState: RuleState;
  const statutoryInvestmentCeilings: Record<string, number> = {
    Micro: 10000000,    // ₹1 Cr
    Small: 100000000,  // ₹10 Cr
    Medium: 500000000, // ₹50 Cr
  };
  const compStatutoryInvCeiling = statutoryInvestmentCeilings[company.classification || 'Micro'] || 10000000;

  if (scheme.maxInvestment == null && scheme.minInvestment == null) {
    investmentState = 'pass';
  } else if (company.investment != null) {
    let passes = true;
    if (scheme.maxInvestment != null && company.investment > scheme.maxInvestment) {
      passes = false;
    }
    if (scheme.minInvestment != null && company.investment < scheme.minInvestment) {
      passes = false;
    }
    investmentState = passes ? 'pass' : 'fail';
  } else {
    // If P&M investment is pending audit entry, evaluate against statutory classification ceiling
    if (scheme.minInvestment != null) {
      investmentState = 'unknown';
    } else if (scheme.maxInvestment != null && scheme.maxInvestment >= compStatutoryInvCeiling) {
      investmentState = 'pass'; // Guaranteed compliant by official MSME classification
    } else {
      investmentState = 'pass';
    }
  }

  checks.push({
    key: 'investment',
    label: 'Plant & Machinery Capital Ceiling',
    state: investmentState,
    required: false,
    reason: generateExplanation('investment', investmentState, company, scheme),
  });

  // 7. Conditional Specialized Scheme Checks (Only when specifically relevant!)

  // 7a. Export Mandate (EPCG, RoDTEP, MPEDA, Spices Board Export)
  const isExportScheme =
    schemeSlug.includes('epcg') ||
    schemeSlug.includes('rodtep') ||
    schemeSlug.includes('mpeda') ||
    schemeSlug.includes('spices-board');

  if (isExportScheme) {
    const isExp = Boolean(company.kpis?.isExporter || (company.kpis?.exportTurnoverPercentage || 0) > 0);
    const expState: RuleState = isExp ? 'pass' : 'fail';
    checks.push({
      key: 'export_kpi',
      label: 'Export Mandate & Trade KPI',
      state: expState,
      required: true,
      reason: isExp
        ? `Active exporter status verified with ${company.kpis?.exportTurnoverPercentage || 0}% export turnover share.`
        : `Scheme is restricted to active export entities. Currently 0% export share (Domestic Only).`,
    });
  }

  // 7b. Clean Energy / Rooftop Solar Scheme
  const isGreenScheme =
    schemeSlug.includes('clean-energy') ||
    schemeSlug.includes('solar') ||
    schemeSlug.includes('surya');

  if (isGreenScheme) {
    const isGreen = Boolean(company.kpis?.greenEnergyAdoption || (company.kpis?.greenEnergyInvestment || 0) > 0);
    const greenState: RuleState = isGreen ? 'pass' : 'fail';
    checks.push({
      key: 'green_kpi',
      label: 'Clean Energy / Solar Adoption KPI',
      state: greenState,
      required: true,
      reason: isGreen
        ? `Clean energy / rooftop solar installation verified.`
        : `Requires planned or existing captive rooftop solar / clean energy capital investment.`,
    });
  }

  // 7c. ZED Sustainable Certification Scheme (ONLY for ZED specific scheme)
  const isZedScheme = schemeSlug === 'zed' || schemeSlug === 'sch-zed' || scheme.name.toLowerCase().includes('sustainable (zed)');

  if (isZedScheme) {
    const hasZed = Boolean(company.kpis?.zedCertification && company.kpis.zedCertification !== 'None');
    const techState: RuleState = hasZed ? 'pass' : 'fail';

    checks.push({
      key: 'tech_quality_kpi',
      label: 'ZED Certification Standard KPI',
      state: techState,
      required: true,
      reason: hasZed
        ? `Holding ZED ${company.kpis?.zedCertification} Certification (qualifies for immediate grant disbursement).`
        : `Manufacturing unit qualifies to apply for ZED assessment to unlock up to 85% certification subsidy.`,
    });
  }

  // 7d. Institutional Debt / Credit Schemes (CGTMSE, KSIDC Loan, Kerala Interest Subvention)
  const isCreditScheme =
    schemeSlug.includes('cgtmse') ||
    schemeSlug.includes('ksidc') ||
    schemeSlug.includes('interest-subvention');

  if (isCreditScheme) {
    checks.push({
      key: 'credit_kpi',
      label: 'Institutional Debt / Credit Facility',
      state: 'pass',
      required: false,
      reason: company.kpis?.creditRequirement
        ? `Proposed debt requirement of ₹${(company.kpis.creditRequirement / 100000).toFixed(1)} Lakh qualifies for statutory credit support / guarantee.`
        : `Statutory MSME credit guarantee and subvention coverage applicable upon loan application.`,
    });
  }

  // 7e. Social Inclusion (Stand-Up India only)
  const isSocialScheme = schemeSlug.includes('sui') || schemeSlug.includes('stand-up');

  if (isSocialScheme) {
    const isWomen = (company.kpis?.womenOwnershipPercentage || 0) >= 51;
    const isScSt = (company.kpis?.scStOwnershipPercentage || 0) >= 51;
    const socialState: RuleState = isWomen || isScSt ? 'pass' : 'fail';
    checks.push({
      key: 'social_kpi',
      label: 'Inclusive Ownership KPI (Women / SC-ST)',
      state: socialState,
      required: true,
      reason: isWomen
        ? `Women equity holding (${company.kpis?.womenOwnershipPercentage}%) satisfies the ≥51% mandate.`
        : isScSt
        ? `SC/ST equity holding (${company.kpis?.scStOwnershipPercentage}%) satisfies affirmative procurement mandates.`
        : `Scheme is restricted to majority Women or SC/ST promoted enterprises (≥51% equity share).`,
    });
  }

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
    .map((scheme) => matchCompanyToScheme(company, scheme))
    .sort((a, b) => {
      // 1. Primary Sort: Absolute match score descending (e.g. 100%, 95%, 90%, 80%, 65%, 45%, etc.)
      const scoreDiff = (b.score || 0) - (a.score || 0);
      if (scoreDiff !== 0) return scoreDiff;

      // 2. Status Priority
      const statusWeight: Record<string, number> = {
        strong_match: 4,
        possible_match: 3,
        low_match: 2,
        unknown: 1,
        not_matched: 0,
      };
      const diff = (statusWeight[b.status] || 0) - (statusWeight[a.status] || 0);
      if (diff !== 0) return diff;

      // 3. Alphabetical fallback
      return a.schemeName.localeCompare(b.schemeName);
    });
}

export function getMatchingCompaniesForScheme(
  scheme: Scheme,
  companies: Company[]
): Array<{ company: Company; match: SchemeMatch }> {
  return companies
    .map((company) => ({
      company,
      match: matchCompanyToScheme(company, scheme),
    }))
    .filter((item) => item.match.status !== 'not_matched')
    .sort((a, b) => (b.match.score || 0) - (a.match.score || 0));
}
