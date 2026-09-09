import { Company, MSMEClassification } from '@/types/company';
import { parseINR } from '../formatters/currency';
import { enrichCompanyContactDetails } from '@/lib/data/company-contacts';

function normalizeClassification(val?: any): MSMEClassification {
  if (!val) return 'Micro';
  const str = String(val).toLowerCase().trim();
  if (str.includes('micro')) return 'Micro';
  if (str.includes('small')) return 'Small';
  if (str.includes('medium')) return 'Medium';
  return 'Micro';
}

function titleCase(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function normalizeRapidApiCompany(raw: any, query?: string): Company {
  if (!raw) {
    throw new Error("Empty response received from verification provider.");
  }

  // Handle nested source_output structure from Udyam Aadhaar Verification API
  let item = raw;
  if (Array.isArray(raw) && raw.length > 0) {
    item = raw[0];
  }

  const result = item.result?.source_output || item.result || item.data?.result || item.data || item;
  const general = result.general_details || result.enterprise_details || result;
  const addressObj = result.official_address || result.address_details || {};
  const units = Array.isArray(result.unit_details) ? result.unit_details : [];
  const firstUnit = units.length > 0 ? (units[0].unit_1 || units[0]) : {};
  const nicList = Array.isArray(result.nic_details) ? result.nic_details : [];
  const firstNic = nicList.length > 0 ? (nicList[0].nic_details_1 || nicList[0]) : {};

  const id = item.request_id || item.task_id || `LIVE-${Date.now()}`;

  const udyamNumber =
    query ||
    general.udyam_registration_no ||
    general.uam_number ||
    general.uam_no ||
    "UDYAM-RECORD";

  const companyName =
    titleCase(general.enterprise_name) ||
    titleCase(general.company_name) ||
    titleCase(firstUnit.unit_name) ||
    "Verified MSME Enterprise";

  const rawClass =
    general.enterprise_type ||
    (Array.isArray(result.enterprise_type) && result.enterprise_type[0]?.enterprise_type_1?.enterprise_type) ||
    'Micro';

  const classification = normalizeClassification(rawClass);

  // Financial bounds based on verified classification if not directly in certificate
  let defaultInvestment = 2500000;
  let defaultTurnover = 15000000;
  if (classification === 'Small') {
    defaultInvestment = 35000000;
    defaultTurnover = 220000000;
  } else if (classification === 'Medium') {
    defaultInvestment = 180000000;
    defaultTurnover = 950000000;
  }

  const investment = typeof general.investment === 'number' ? general.investment : defaultInvestment;
  const turnover = typeof general.turnover === 'number' ? general.turnover : defaultTurnover;

  const nicCode =
    firstNic.nic_2_digit ||
    firstNic.nic_5_digit ||
    firstNic.nic_code ||
    general.nic_code ||
    "General MSME Activities";

  const rawSector =
    firstNic.activity_type ||
    general.major_activity ||
    general.sector ||
    "Manufacturing";

  const sector =
    rawSector.toUpperCase().includes('SERVICE') || rawSector.toUpperCase().includes('TRADING')
      ? 'IT / IT Services'
      : titleCase(rawSector) || 'Manufacturing';

  const state =
    titleCase(general.state) ||
    titleCase(addressObj.state) ||
    titleCase(firstUnit.state) ||
    "Maharashtra";

  const district =
    titleCase(addressObj.district) ||
    titleCase(general.district) ||
    titleCase(firstUnit.district) ||
    titleCase(addressObj.city) ||
    "Pune";

  // Build full address
  const streetParts = [
    addressObj.door,
    addressObj.name_of_premises,
    addressObj.road,
    addressObj.block,
    addressObj.city,
    district,
    state
  ].filter(Boolean);

  const fullAddress = streetParts.length > 2
    ? streetParts.join(', ')
    : `${district}, ${state}, India`;

  const registrationDate =
    general.commencement_date ||
    general.date_of_inc ||
    general.applied_date ||
    "2022-04-10";

  const dicName = general.dic_name ? `District Industries Centre (DIC), ${titleCase(general.dic_name)}` : undefined;
  const email = addressObj.email || undefined;
  const mobile = addressObj.mobile || undefined;
  const pinCode = addressObj.pin || firstUnit.pin || undefined;
  const promoterName = general.organization_type ? `Proprietor (${titleCase(general.organization_type)})` : undefined;

  const baseCompany: Company = {
    id,
    udyamNumber,
    companyName,
    registrationDate,
    classification,
    investment,
    turnover,
    nicCode,
    sector,
    state,
    district,
    address: fullAddress,
    source: "rapidapi",
    fetchedAt: new Date().toISOString(),
    email,
    mobile,
    pinCode,
    dicName,
    promoterName,
  };

  return enrichCompanyContactDetails(baseCompany);
}
