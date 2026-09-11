export const KERALA_DISTRICTS = [
  'Ernakulam',
  'Thiruvananthapuram',
  'Kozhikode',
  'Thrissur',
  'Palakkad',
  'Kollam',
  'Alappuzha',
  'Kottayam',
  'Kannur',
  'Kasaragod',
  'Pathanamthitta',
  'Malappuram',
  'Idukki',
  'Wayanad',
] as const;

export type KeralaDistrict = typeof KERALA_DISTRICTS[number];

export const KERALA_SECTORS = [
  'Food & Agro Processing',
  'Spices & Oleoresins',
  'Marine & Seafood Exports',
  'Rubber & Polymers',
  'IT & Software Services',
  'Ayurveda & Healthcare Products',
  'Coir & Handloom Textiles',
  'Light Engineering & Machinery',
  'Wood & Furniture Products',
  'Renewable Energy & Solar',
] as const;

export const KERALA_INDUSTRIAL_ZONES: Record<string, string> = {
  Ernakulam: 'KINFRA High-Tech Park, Kalamassery / Angamaly Industrial Area',
  Thiruvananthapuram: 'KINFRA Apparel & IT Park, Menamkulam / Technopark Phase III',
  Kozhikode: 'KINFRA Mega Food Park, Kakkancherry / KINFRA Cyberpark',
  Thrissur: 'KINFRA Integrated Industrial Complex, Koratty / Puzhakkal Cluster',
  Palakkad: 'KINFRA Wise Park, Kanjikode Industrial Estate',
  Kollam: 'KINFRA Cashew & Marine Food Processing Zone, Kundara',
  Alappuzha: 'Cherthala Infopark & Coir Industrial Cluster, Aroor',
  Kottayam: 'KINFRA Rubber & Polymer Industrial Complex, Velloor',
  Kannur: 'KINFRA Textile & Industrial Park, Mattannur',
  Kasaragod: 'KINFRA Industrial Growth Centre, Seethangoli',
  Pathanamthitta: 'District Industrial Area, Kozhencherry / Adoor Zone',
  Malappuram: 'INKEL Industrial Greens / Panakkad Mega Cluster',
  Idukki: 'Spices & Agro Industrial Estate, Thodupuzha',
  Wayanad: 'Organic & Plantation Processing Cluster, Meenangadi',
};

export function getDistrictsForState(state?: string): string[] {
  return [...KERALA_DISTRICTS];
}

// Legacy compatibility helper
export const STATE_DISTRICTS_MAP: Record<string, string[]> = {
  Kerala: [...KERALA_DISTRICTS],
};
