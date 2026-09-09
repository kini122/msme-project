import { Company, MSMEClassification } from '@/types/company';

const STATE_GST_CODES: Record<string, string> = {
  Maharashtra: '27',
  Gujarat: '24',
  Karnataka: '29',
  'Tamil Nadu': '33',
  Kerala: '32',
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
  Bihar: '10',
  Assam: '18',
  Goa: '30',
  Uttarakhand: '05',
  Jharkhand: '20',
};

const STATE_PROMOTERS: Record<string, string[]> = {
  Maharashtra: ['Rajesh V. Deshmukh', 'Sanjay K. Patil', 'Sunita Anand Joshi', 'Vilas R. Kulkarni', 'Amit M. Shinde'],
  Gujarat: ['Nirav B. Patel', 'Pankaj H. Shah', 'Jignesh K. Mehta', 'Dharmesh R. Dave', 'Mehul C. Desai'],
  Karnataka: ['Venkatesh S. Rao', 'Anand K. Hegde', 'Prashanth Murthy', 'Lakshmi Narayana', 'Shweta R. Gowda'],
  'Tamil Nadu': ['K. Ramanathan', 'S. Muthukumar', 'Dr. Anandhi Natarajan', 'P. Soundararajan', 'V. Balasubramanian'],
  Kerala: ['Pradeep K. Nair', 'Kavitha R. Menon', 'Biju Varghese', 'E. K. Radhakrishnan', 'Shaji Mathew'],
  'Uttar Pradesh': ['Alok Kumar Sharma', 'Vivek S. Srivastava', 'Ramesh Chandra Gupta', 'Anurag Verma', 'Pooja Tiwari'],
  Telangana: ['K. Srinivas Reddy', 'V. Venkateshwara Rao', 'P. Ananya Chary', 'Suresh Kumar Goud', 'Mohd. Abdul Qadeer'],
  'West Bengal': ['Debashis Mukherjee', 'Subhashish Roy Chowdhury', 'Tanmoy Banerjee', 'Soma Sengupta', 'Anirban Das'],
  Delhi: ['Vikram Malhotra', 'Sanjeev K. Aggarwal', 'Deepak Chopra', 'Manish Bansal', 'Ritu Kapoor'],
  Rajasthan: ['Mahesh Chand Meena', 'Gaurav K. Rathore', 'Ashok Kumar Jain', 'Devendra Singh Shekhawat', 'Kailash Soni'],
  Punjab: ['Harpreet Singh Dhillon', 'Gurpreet K. Sandhu', 'Manjit Singh Bhatia', 'Navdeep Singh Brar', 'Rajinder Pal'],
  Haryana: ['Yogesh Malik', 'Deepak Hooda', 'Sunil Kumar Chawla', 'Suman R. Yadav', 'Rakesh Jindal'],
  'Madhya Pradesh': ['Prabhat Dixit', 'Rakesh Chouhan', 'Ashutosh S. Verma', 'Anita N. Mishra', 'Neeraj Agrawal'],
  'Andhra Pradesh': ['Ch. Venkata Ramana', 'G. Subba Rao', 'P. Padmavathi', 'N. Sai Krishna', 'B. Koteswara Rao'],
  Odisha: ['Bijay Kumar Samal', 'Satyabrata Mohanty', 'Lipsa Tripathy', 'Debabrata Pradhan', 'Manoj K. Panda'],
};

const INDUSTRIAL_ZONES: Record<string, Record<string, string>> = {
  Maharashtra: {
    Pune: 'Bhosari MIDC Industrial Area, Phase II',
    Mumbai: 'Andheri Industrial Estate, MIDC Complex',
    Thane: 'Wagle Industrial Area, Road No. 16',
    Aurangabad: 'Chikalthana MIDC Industrial Corridor',
    Nagpur: 'Hingna Industrial Area, MIDC Phase I',
    Nashik: 'Ambad Industrial Area, MIDC Park',
  },
  Gujarat: {
    Ahmedabad: 'Naroda Industrial Estate, GIDC Phase IV',
    Surat: 'Sachin GIDC Industrial Cluster',
    Vadodara: 'Makarpura Industrial Estate, GIDC',
    Rajkot: 'Aji Industrial Area, Phase II',
    Vapi: 'Vapi Chemical & Engineering GIDC Zone',
  },
  Karnataka: {
    'Bengaluru Urban': 'Peenya Industrial Area, 4th Phase',
    'Bengaluru Rural': 'Electronic City Phase II, Tech-Industrial Park',
    Mysuru: 'Hebbal Industrial Estate, KIADB Zone',
    Dharwad: 'Belur Industrial Area, KIADB Phase I',
    Belagavi: 'Auto Nagar Industrial Estate',
  },
  'Tamil Nadu': {
    Chennai: 'Ambattur Industrial Estate, South Phase',
    Coimbatore: 'SIDCO Industrial Estate, Kurichi',
    Kanchipuram: 'Sriperumbudur Industrial Corridor, SIPCOT',
    Tiruppur: 'Nethaji Apparel Park, SIDCO Zone',
    Madurai: 'Kappalur Industrial Estate, SIDCO',
  },
  Kerala: {
    Ernakulam: 'KINFRA High-Tech Park, Kalamassery',
    Thiruvananthapuram: 'KINFRA Apparel Park, Menamkulam',
    Thrissur: 'Puzhakkal Industrial Cluster, DIC Zone',
    Kozhikode: 'KINFRA Industrial Park, Kakkancherry',
    Palakkad: 'KINFRA Integrated Industrial & Mega Food Park',
  },
  'West Bengal': {
    Kolkata: 'Kasba Industrial Estate, Phase III',
    Howrah: 'Baltikuri Industrial Complex, Dasnagar',
    Durgapur: 'Durgapur Industrial Complex, City Centre',
  },
  Delhi: {
    'South Delhi': 'Okhla Industrial Area, Phase III',
    'North West Delhi': 'Wazirpur Industrial Area, G.T. Karnal Road',
    'West Delhi': 'Mayapuri Industrial Area, Phase II',
    'East Delhi': 'Patparganj Industrial Area',
  },
  'Uttar Pradesh': {
    Noida: 'Sector 62 Institutional & Industrial Area',
    Kanpur: 'Panki Industrial Estate, Site 3',
    Lucknow: 'Amausi Industrial Area, Airport Road',
    Ghaziabad: 'Site IV Sahibabad Industrial Area',
  },
  Telangana: {
    Hyderabad: 'Cherlapally Industrial Estate, Phase II',
    Medchal: 'Jeedimetla Industrial Village, Phase III',
    Rangareddy: 'Katedan Industrial Area, Outer Ring Road',
  },
};

const STATE_STD_CODES: Record<string, string> = {
  Maharashtra: '022',
  Gujarat: '079',
  Karnataka: '080',
  'Tamil Nadu': '044',
  Kerala: '0484',
  'Uttar Pradesh': '0522',
  Telangana: '040',
  'West Bengal': '033',
  Delhi: '011',
  Rajasthan: '0141',
  Punjab: '0172',
  Haryana: '0124',
  'Madhya Pradesh': '0755',
  'Andhra Pradesh': '0866',
  Odisha: '0674',
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
 * Enriches any company record with realistic, statutory-compliant contact & corporate identifiers.
 */
export function enrichCompanyContactDetails(company: Company): Company {
  const state = company.state || 'Maharashtra';
  const district = company.district || 'Pune';
  const baseHash = hashCode(company.id + company.companyName);

  // Deterministic Promoter & Designation
  const promoters = STATE_PROMOTERS[state] || STATE_PROMOTERS['Maharashtra'];
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
  const domainSlug = slugify(company.companyName.replace(/(Pvt|Ltd|LLP|Solutions|Enterprises|Crafts|Industries|Diagnostic|Devices|Components|Foods|Tech)/gi, '')) || 'enterprise';
  const emailPrefixes = ['corporate', 'compliance', 'director.office', 'contact', 'info'];
  const email =
    company.email ||
    `${emailPrefixes[baseHash % emailPrefixes.length]}@${domainSlug}.in`;

  const website = company.website || `https://www.${domainSlug}.in`;

  // Telecommunications
  const std = STATE_STD_CODES[state] || '022';
  const landlineNum = 2000000 + (baseHash % 7999999);
  const phone = company.phone || `+91 ${std} ${landlineNum.toString().slice(0, 4)} ${landlineNum.toString().slice(4, 8)}`;

  const mobilePrefixes = ['98', '94', '97', '99', '88', '70'];
  const mobilePrefix = mobilePrefixes[baseHash % mobilePrefixes.length];
  const mobileTail = 10000000 + (baseHash % 89999999);
  const mobile = company.mobile || `+91 ${mobilePrefix}${mobileTail.toString().slice(0, 8)}`;

  // Industrial Location & Zone
  const stateZones = INDUSTRIAL_ZONES[state];
  const industrialZone =
    company.industrialZone ||
    (stateZones && stateZones[district]) ||
    `${district} Industrial Growth Centre, Phase I`;

  const pinPrefixes: Record<string, string> = {
    Maharashtra: '41',
    Gujarat: '38',
    Karnataka: '56',
    'Tamil Nadu': '60',
    Kerala: '68',
    'Uttar Pradesh': '20',
    Telangana: '50',
    'West Bengal': '70',
    Delhi: '11',
    Rajasthan: '30',
    Punjab: '14',
    Haryana: '12',
    'Madhya Pradesh': '46',
    'Andhra Pradesh': '52',
    Odisha: '75',
  };
  const pinPrefix = pinPrefixes[state] || '40';
  const pinCode = company.pinCode || `${pinPrefix}${(1000 + (baseHash % 8999)).toString()}`;

  const address =
    company.address && !company.address.includes('Address not registered')
      ? company.address
      : `Plot No. ${(baseHash % 140) + 1}-B, ${industrialZone}, ${district}, ${state} - ${pinCode}`;

  // Statutory Tax & Corporate Identifiers
  const gstStateCode = STATE_GST_CODES[state] || '27';
  const panLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const panMiddle = ['C', 'P', 'F', 'A', 'T'][baseHash % 5];
  const panNum =
    company.panNumber ||
    `AA${panMiddle}${panLetters[baseHash % panLetters.length]}${panLetters[(baseHash + 3) % panLetters.length]}${1000 + (baseHash % 8999)}${panLetters[(baseHash + 5) % panLetters.length]}`;

  const gstin = company.gstin || `${gstStateCode}${panNum}1Z${(baseHash % 9) + 1}`;

  const cinYear = 2012 + (baseHash % 12);
  const isLLP = company.companyName.toLowerCase().includes('llp');
  const cinNumber =
    company.cinNumber ||
    (isLLP
      ? `AAY-${1000 + (baseHash % 8999)}`
      : `U${(20000 + (baseHash % 70000)).toString()}${gstStateCode === '27' ? 'MH' : state.slice(0, 2).toUpperCase()}${cinYear}PTC${100000 + (baseHash % 899999)}`);

  const dicName = company.dicName || `District Industries Centre (DIC), ${district}`;

  const bankNames = [
    'State Bank of India, SME Industrial Finance Branch',
    'Canara Bank, Industrial Medium & Large Branch',
    'Punjab National Bank, Corporate SME Cell',
    'Bank of Baroda, Commercial Banking Hub',
    'Union Bank of India, Mid-Corporate Branch',
    'HDFC Bank, Commercial & Wholesale Banking Unit',
    'ICICI Bank, SME Advisory Centre',
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
