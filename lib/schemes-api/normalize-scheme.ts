import { ApiMitraScheme } from '@/types/apimitra';
import { Scheme } from '@/types/scheme';
import { MSMEClassification } from '@/types/company';

const INDIVIDUAL_WELFARE_KEYWORDS = [
  'fellowship',
  'scholarship',
  'professorship',
  'internship',
  'student',
  'school',
  'college',
  'agnipath',
  'ex-servicemen',
  'widow',
  'pension',
  'artist',
  'afghan',
  'toilet',
  'hostel',
  'degree',
  'coaching',
  'maternity',
  'disability',
  'allowance',
  'phd',
  'stipend',
  'tribal youth',
  'advisory committee',
];

const COMMERCIAL_MSME_KEYWORDS = [
  'msme',
  'enterprise',
  'business',
  'industry',
  'factory',
  'manufacturing',
  'processing',
  'cgtmse',
  'subsidy',
  'credit',
  'guarantee',
  'export',
  'trade',
  'startup',
  'cluster',
  'kinfra',
  'dic',
  'coir',
  'spices',
  'rubber',
  'marine',
  'agro',
  'food',
  'textile',
  'zed',
  'clcss',
  'technology upgradation',
  'machinery',
  'working capital',
  'surya ghar',
  'solar rooftop',
];

export function normalizeApiMitraScheme(raw: ApiMitraScheme): Scheme {
  const governmentType =
    raw.level && raw.level.toLowerCase().includes('state') ? 'State' : 'Central';

  // Process beneficiary states
  let states: string[] = [];
  if (
    raw.beneficiary_state &&
    raw.beneficiary_state.toLowerCase() !== 'all' &&
    raw.beneficiary_state.toLowerCase() !== 'pan-india' &&
    raw.beneficiary_state.trim() !== ''
  ) {
    states = raw.beneficiary_state
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Process tags
  const tags = raw.tags
    ? raw.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const textContent = `${raw.scheme_name} ${raw.brief || ''} ${raw.tags || ''} ${raw.categories || ''} ${raw.ministry || ''}`.toLowerCase();

  // Classify target beneficiary
  const isIndividual = INDIVIDUAL_WELFARE_KEYWORDS.some((kw) => textContent.includes(kw));
  const isCommercial = COMMERCIAL_MSME_KEYWORDS.some((kw) => textContent.includes(kw));
  const targetBeneficiary = !isIndividual && (isCommercial || textContent.includes('business') || textContent.includes('commercial'))
    ? 'Enterprise'
    : isIndividual
    ? 'Individual'
    : 'Both';

  // Supported Classifications
  const classifications: MSMEClassification[] = ['Micro', 'Small', 'Medium'];

  // Precise Sector Extraction
  const sectors: string[] = [];
  if (textContent.includes('food') || textContent.includes('agri') || textContent.includes('kisan') || textContent.includes('spices') || textContent.includes('dairy') || textContent.includes('agro')) {
    sectors.push('Food & Agro Processing', 'Spices & Oleoresins');
  }
  if (textContent.includes('marine') || textContent.includes('fisheries') || textContent.includes('seafood') || textContent.includes('aquaculture')) {
    sectors.push('Marine & Seafood Exports');
  }
  if (textContent.includes('rubber') || textContent.includes('polymer')) {
    sectors.push('Rubber & Polymers');
  }
  if (textContent.includes('textile') || textContent.includes('handloom') || textContent.includes('weaver') || textContent.includes('coir')) {
    sectors.push('Coir & Handloom Textiles');
  }
  if (textContent.includes('it ') || textContent.includes('software') || textContent.includes('digital') || textContent.includes('cyber') || textContent.includes('electronics')) {
    sectors.push('IT & Software Services');
  }
  if (textContent.includes('ayush') || textContent.includes('ayurveda') || textContent.includes('pharma') || textContent.includes('medical device')) {
    sectors.push('Ayurveda & Healthcare Products');
  }
  if (textContent.includes('solar') || textContent.includes('renewable') || textContent.includes('clean energy')) {
    sectors.push('Renewable Energy & Solar');
  }
  if (textContent.includes('machinery') || textContent.includes('engineering') || textContent.includes('tooling') || textContent.includes('precision')) {
    sectors.push('Light Engineering & Machinery');
  }

  const slug = raw.slug || raw.id;
  const officialUrl = slug
    ? `https://www.myscheme.gov.in/schemes/${slug}`
    : 'https://www.myscheme.gov.in/';

  return {
    id: raw.id || slug,
    slug: raw.slug,
    name: raw.scheme_name,
    shortTitle: raw.short_title,
    description: raw.brief || raw.scheme_name,
    category: raw.categories || 'Business & Entrepreneurship',
    governmentType,
    ministry: raw.ministry || 'Government of India',
    classifications,
    sectors: Array.from(new Set(sectors)),
    states,
    schemeFor: raw.scheme_for || (targetBeneficiary === 'Enterprise' ? 'Commercial MSME Enterprises' : 'Individual Citizens'),
    tags,
    closeDate: raw.close_date,
    minTurnover: null,
    maxTurnover: null,
    minInvestment: null,
    maxInvestment: null,
    officialUrl,
    source: 'myscheme',
  };
}
