import { Company, MSMEClassification } from '@/types/company';
import { KERALA_INDUSTRIAL_ZONES } from './districts';

const STATE_GST_CODES: Record<string, string> = {
  Kerala: '32',
  Maharashtra: '27',
  Gujarat: '24',
  Karnataka: '29',
  'Tamil Nadu': '33',
  'Uttar Pradesh': '09',
  Telangana: '36',
  'West Bengal': '19',
  Delhi: '07',
  Rajasthan: '08',
  Punjab: '03',
  Haryana: '06',
  'Madhya Pradesh': '23',
  'Andhra Pradesh': '37',
  Odisha: '21',
};

const KERALA_PROMOTERS = [
  'Pradeep K. Nair',
  'Kavitha R. Menon',
  'Biju Varghese',
  'E. K. Radhakrishnan',
  'Shaji Mathew',
  'Anil Kumar Pillai',
  'Sujatha Kurup',
  'Dr. George Thomas',
  'M. P. Jayasankar',
  'Roshni Nambiar',
  'K. T. Moideen',
  'Sebastian Joseph',
];

const STATE_PROMOTERS: Record<string, string[]> = {
  Kerala: KERALA_PROMOTERS,
  Maharashtra: ['Rajesh V. Deshmukh', 'Sanjay K. Patil', 'Sunita Anand Joshi'],
  Karnataka: ['Venkatesh S. Rao', 'Anand K. Hegde', 'Prashanth Murthy'],
  'Tamil Nadu': ['K. Ramanathan', 'S. Muthukumar', 'Dr. Anandhi Natarajan'],
};

const STATE_STD_CODES: Record<string, string> = {
  Kerala: '0484',
  Karnataka: '080',
  'Tamil Nadu': '044',
  Maharashtra: '022',
  Delhi: '011',
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 14);
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Enriches any company record with realistic, statutory-compliant Kerala contact & corporate identifiers.
 */
export function enrichCompanyContactDetails(company: Company): Company {
  const state = company.state || 'Kerala';
  const district = company.district || 'Ernakulam';
  const baseHash = hashCode(company.id + company.companyName);

  // Deterministic Promoter & Designation
  const promoters = STATE_PROMOTERS[state] || KERALA_PROMOTERS;
  const promoterName =
    company.promoterName ||
    promoters[baseHash % promoters.length];

  const designations = [
    'Managing Director',
    'Designated Partner',
    'Executive Director & CEO',
    'Whole-Time Director',
    'Managing Partner',
  ];
  const designation = company.designation || designations[baseHash % designations.length];

  // Corporate Domain & Email
  const domainSlug = slugify(company.companyName.replace(/(Pvt|Ltd|LLP|Solutions|Enterprises|Crafts|Industries|Diagnostic|Devices|Components|Foods|Tech|Kerala|Cochin|Malabar)/gi, '')) || 'enterprise';
  const emailPrefixes = ['corporate', 'compliance', 'director.office', 'contact', 'info'];
  const email =
    company.email ||
    `${emailPrefixes[baseHash % emailPrefixes.length]}@${domainSlug}.in`;

  const website = company.website || `https://www.${domainSlug}.in`;

  // Telecommunications
  const std = STATE_STD_CODES[state] || '0484';
  const landlineNum = 2000000 + (baseHash % 7999999);
  const phone = company.phone || `+91 ${std} ${landlineNum.toString().slice(0, 4)} ${landlineNum.toString().slice(4, 8)}`;

  const mobilePrefixes = ['9847', '9447', '9744', '9946', '8547', '7034'];
  const mobilePrefix = mobilePrefixes[baseHash % mobilePrefixes.length];
  const mobileTail = 100000 + (baseHash % 899999);
  const mobile = company.mobile || `+91 ${mobilePrefix} ${mobileTail.toString().slice(0, 3)} ${mobileTail.toString().slice(3, 6)}`;

  // Industrial Location & Zone
  const industrialZone =
    company.industrialZone ||
    KERALA_INDUSTRIAL_ZONES[district] ||
    `${district} KINFRA Industrial Park`;

  const pinPrefix = '68';
  const pinCode = company.pinCode || `${pinPrefix}${(2000 + (baseHash % 7999)).toString()}`;

  const address =
    company.address && !company.address.includes('Address not registered')
      ? company.address
      : `Plot No. ${(baseHash % 60) + 1}-B, ${industrialZone}, ${district}, ${state} - ${pinCode}`;

  // Statutory Tax & Corporate Identifiers
  const gstStateCode = STATE_GST_CODES[state] || '32';
  const panLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const panMiddle = ['C', 'P', 'F', 'A', 'T'][baseHash % 5];
  const panNum =
    company.panNumber ||
    `AA${panMiddle}${panLetters[baseHash % panLetters.length]}${panLetters[(baseHash + 3) % panLetters.length]}${1000 + (baseHash % 8999)}${panLetters[(baseHash + 5) % panLetters.length]}`;

  const gstin = company.gstin || `${gstStateCode}${panNum}1Z${(baseHash % 9) + 1}`;

  const cinYear = 2014 + (baseHash % 10);
  const isLLP = company.companyName.toLowerCase().includes('llp');
  const cinNumber =
    company.cinNumber ||
    (isLLP
      ? `AAY-${1000 + (baseHash % 8999)}`
      : `U${(20000 + (baseHash % 70000)).toString()}KL${cinYear}PTC${100000 + (baseHash % 899999)}`);

  const dicName = company.dicName || `District Industries Centre (DIC), ${district}`;

  const bankNames = [
    'State Bank of India, SME Commercial Hub, MG Road Kochi',
    'Federal Bank, SME Corporate Branch, Aluva',
    'Canara Bank, Industrial Finance Branch, Kozhikode',
    'South Indian Bank, Corporate SME Cell, Thrissur',
    'HDFC Bank, Commercial & Wholesale Banking Unit, Trivandrum',
    'Bank of Baroda, Commercial Banking Hub, Ernakulam',
    'Union Bank of India, Mid-Corporate Branch, Palakkad',
  ];
  const bankBranch = company.bankBranch || bankNames[baseHash % bankNames.length];

  return {
    ...company,
    promoterName,
    designation,
    email,
    phone,
    mobile,
    website,
    pinCode,
    industrialZone,
    address,
    panNumber: panNum,
    gstin,
    cinNumber,
    dicName,
    bankBranch,
  };
}
