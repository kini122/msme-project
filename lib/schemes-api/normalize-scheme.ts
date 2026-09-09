import { ApiMitraScheme } from '@/types/apimitra';
import { Scheme } from '@/types/scheme';
import { MSMEClassification } from '@/types/company';

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

  // Intelligently infer classifications based on text
  const textContent = `${raw.scheme_name} ${raw.brief || ''} ${raw.tags || ''}`.toLowerCase();
  const classifications: MSMEClassification[] = ['Micro', 'Small', 'Medium'];

  // Intelligently infer sectors
  const sectors: string[] = [];
  if (textContent.includes('food') || textContent.includes('agri') || textContent.includes('kisan')) {
    sectors.push('Food Processing', 'Agro-Processing');
  }
  if (textContent.includes('textile') || textContent.includes('weaver') || textContent.includes('handloom') || textContent.includes('craft')) {
    sectors.push('Textiles', 'Handicrafts');
  }
  if (textContent.includes('it ') || textContent.includes('software') || textContent.includes('digital') || textContent.includes('tech')) {
    sectors.push('IT / IT Services');
  }
  if (textContent.includes('manufacturing') || textContent.includes('industry')) {
    sectors.push('Manufacturing', 'Engineering');
  }
  if (textContent.includes('health') || textContent.includes('pharma') || textContent.includes('ayush')) {
    sectors.push('Healthcare');
  }
  if (textContent.includes('solar') || textContent.includes('green') || textContent.includes('energy')) {
    sectors.push('Renewable Energy');
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
    category: raw.categories || 'Social Welfare & Business Assistance',
    governmentType,
    ministry: raw.ministry || 'Government of India',
    classifications,
    sectors: Array.from(new Set(sectors)),
    states,
    schemeFor: raw.scheme_for,
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
