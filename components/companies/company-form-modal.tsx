'use client';

import React, { useState, useEffect } from 'react';
import { Company, MSMEClassification, CompanyCustomKPIs } from '@/types/company';
import { KERALA_DISTRICTS, KERALA_SECTORS } from '@/lib/data/districts';
import { formatINR } from '@/lib/formatters/currency';
import {
  X,
  Building2,
  Coins,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Layers,
  Leaf,
  Award,
  Globe,
  Users,
  CreditCard,
  Percent,
} from 'lucide-react';

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Company) => void;
  initialCompany?: Company | null;
  mode?: 'create' | 'edit';
}

export function CompanyFormModal({
  isOpen,
  onClose,
  onSave,
  initialCompany,
  mode = 'edit',
}: CompanyFormModalProps) {
  const [activeTab, setActiveTab] = useState<'statutory' | 'financials' | 'kpis'>('statutory');

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [udyamNumber, setUdyamNumber] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [classification, setClassification] = useState<MSMEClassification>('Micro');
  const [sector, setSector] = useState('Food & Agro Processing');
  const [state, setState] = useState('Kerala');
  const [district, setDistrict] = useState('Ernakulam');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [dicName, setDicName] = useState('');
  const [nicCode, setNicCode] = useState('');

  // Contacts & Tax IDs
  const [promoterName, setPromoterName] = useState('');
  const [designation, setDesignation] = useState('Managing Director');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [website, setWebsite] = useState('');
  const [gstin, setGstin] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [bankBranch, setBankBranch] = useState('');

  // Financials
  const [turnover, setTurnover] = useState<number>(15000000);
  const [investment, setInvestment] = useState<number>(2500000);

  // Custom KPIs
  const [kpis, setKpis] = useState<CompanyCustomKPIs>({
    isExporter: false,
    exportTurnoverPercentage: 0,
    womenOwnershipPercentage: 0,
    scStOwnershipPercentage: 0,
    greenEnergyAdoption: false,
    greenEnergyInvestment: 0,
    techUpgradeInvestment: 0,
    zedCertification: 'None',
    isoCertified: false,
    employeeCount: 25,
    creditRequirement: 0,
    existingCreditAvailment: 0,
    hasRndFacility: false,
  });

  useEffect(() => {
    if (initialCompany) {
      setCompanyName(initialCompany.companyName || '');
      setUdyamNumber(initialCompany.udyamNumber || '');
      setRegistrationDate(initialCompany.registrationDate || '2022-04-10');
      setClassification(initialCompany.classification || 'Micro');
      setSector(initialCompany.sector || 'Food & Agro Processing');
      setState(initialCompany.state || 'Kerala');
      setDistrict(initialCompany.district || 'Ernakulam');
      setAddress(initialCompany.address || '');
      setPinCode(initialCompany.pinCode || '');
      setDicName(initialCompany.dicName || `District Industries Centre (DIC), ${initialCompany.district || 'Ernakulam'}`);
      setNicCode(initialCompany.nicCode || '1079 - Agro & Food Processing');

      setPromoterName(initialCompany.promoterName || '');
      setDesignation(initialCompany.designation || 'Managing Director');
      setEmail(initialCompany.email || '');
      setPhone(initialCompany.phone || '');
      setMobile(initialCompany.mobile || '');
      setWebsite(initialCompany.website || '');
      setGstin(initialCompany.gstin || '');
      setPanNumber(initialCompany.panNumber || '');
      setCinNumber(initialCompany.cinNumber || '');
      setBankBranch(initialCompany.bankBranch || '');

      setTurnover(initialCompany.turnover || 15000000);
      setInvestment(initialCompany.investment || 2500000);

      setKpis({
        isExporter: initialCompany.kpis?.isExporter ?? false,
        exportTurnoverPercentage: initialCompany.kpis?.exportTurnoverPercentage ?? 0,
        womenOwnershipPercentage: initialCompany.kpis?.womenOwnershipPercentage ?? 0,
        scStOwnershipPercentage: initialCompany.kpis?.scStOwnershipPercentage ?? 0,
        greenEnergyAdoption: initialCompany.kpis?.greenEnergyAdoption ?? false,
        greenEnergyInvestment: initialCompany.kpis?.greenEnergyInvestment ?? 0,
        techUpgradeInvestment: initialCompany.kpis?.techUpgradeInvestment ?? 0,
        zedCertification: initialCompany.kpis?.zedCertification ?? 'None',
        isoCertified: initialCompany.kpis?.isoCertified ?? false,
        employeeCount: initialCompany.kpis?.employeeCount ?? 20,
        creditRequirement: initialCompany.kpis?.creditRequirement ?? 0,
        existingCreditAvailment: initialCompany.kpis?.existingCreditAvailment ?? 0,
        hasRndFacility: initialCompany.kpis?.hasRndFacility ?? false,
      });
    } else {
      // Defaults for brand new custom company
      const randomId = String(Date.now()).slice(-5);
      setCompanyName('');
      setUdyamNumber(`UDYAM-KL-11-00${randomId}`);
      setRegistrationDate(new Date().toISOString().split('T')[0]);
      setClassification('Small');
      setSector('Food & Agro Processing');
      setState('Kerala');
      setDistrict('Ernakulam');
      setAddress('');
      setPinCode('682001');
      setDicName('District Industries Centre (DIC), Ernakulam');
      setNicCode('1079 - Food & Agro Value Addition');
      setPromoterName('');
      setDesignation('Managing Director');
      setEmail('');
      setPhone('');
      setMobile('');
      setWebsite('');
      setGstin('');
      setPanNumber('');
      setCinNumber('');
      setBankBranch('State Bank of India, SME Branch Kochi');
      setTurnover(45000000);
      setInvestment(12000000);
      setKpis({
        isExporter: false,
        exportTurnoverPercentage: 0,
        womenOwnershipPercentage: 0,
        scStOwnershipPercentage: 0,
        greenEnergyAdoption: false,
        greenEnergyInvestment: 0,
        techUpgradeInvestment: 0,
        zedCertification: 'None',
        isoCertified: false,
        employeeCount: 35,
        creditRequirement: 5000000,
        existingCreditAvailment: 0,
        hasRndFacility: false,
      });
    }
  }, [initialCompany, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert('Please enter an enterprise name.');
      return;
    }

    const compiled: Company = {
      id: initialCompany?.id || `CUSTOM-${Date.now()}`,
      companyName: companyName.trim(),
      udyamNumber: udyamNumber.trim() || undefined,
      registrationDate: registrationDate || undefined,
      classification,
      investment: Number(investment) || 0,
      turnover: Number(turnover) || 0,
      nicCode: nicCode.trim() || undefined,
      sector,
      state: 'Kerala',
      district,
      address: address.trim() || undefined,
      source: initialCompany?.source === 'rapidapi' ? 'rapidapi' : 'custom',
      fetchedAt: initialCompany?.fetchedAt || new Date().toISOString(),

      promoterName: promoterName.trim() || undefined,
      designation: designation.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      mobile: mobile.trim() || undefined,
      website: website.trim() || undefined,
      pinCode: pinCode.trim() || undefined,
      industrialZone: initialCompany?.industrialZone || `${district} KINFRA Industrial Complex`,
      gstin: gstin.trim() || undefined,
      panNumber: panNumber.trim() || undefined,
      cinNumber: cinNumber.trim() || undefined,
      dicName: dicName.trim() || undefined,
      bankBranch: bankBranch.trim() || undefined,

      kpis: {
        ...kpis,
        exportTurnoverPercentage: Number(kpis.exportTurnoverPercentage) || 0,
        womenOwnershipPercentage: Number(kpis.womenOwnershipPercentage) || 0,
        scStOwnershipPercentage: Number(kpis.scStOwnershipPercentage) || 0,
        greenEnergyInvestment: Number(kpis.greenEnergyInvestment) || 0,
        techUpgradeInvestment: Number(kpis.techUpgradeInvestment) || 0,
        creditRequirement: Number(kpis.creditRequirement) || 0,
        existingCreditAvailment: Number(kpis.existingCreditAvailment) || 0,
        employeeCount: Number(kpis.employeeCount) || undefined,
      },
    };

    onSave(compiled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-sm text-slate-900">
                {mode === 'create'
                  ? 'Register New Kerala Enterprise'
                  : `Edit Enterprise & Enrich KPIs: ${companyName || initialCompany?.companyName || 'Enterprise Profile'}`}
              </h3>
              <p className="text-[11px] text-slate-500">
                Update statutory attributes, financial scale, and specialized operational KPIs for scheme matching.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('statutory')}
            className={`py-2.5 px-3 border-b-2 font-semibold text-xs flex items-center gap-1.5 transition ${
              activeTab === 'statutory'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. Statutory & Identity</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financials')}
            className={`py-2.5 px-3 border-b-2 font-semibold text-xs flex items-center gap-1.5 transition ${
              activeTab === 'financials'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>2. Financial Scale</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kpis')}
            className={`py-2.5 px-3 border-b-2 font-semibold text-xs flex items-center gap-1.5 transition ${
              activeTab === 'kpis'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>3. Scheme Enrichment KPIs</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: Statutory & Identity */}
          {activeTab === 'statutory' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Legal Enterprise Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="e.g. Zenith Marine Processing Private Limited"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Udyam Registration Number (URN)
                  </label>
                  <input
                    type="text"
                    value={udyamNumber}
                    onChange={(e) => setUdyamNumber(e.target.value)}
                    placeholder="e.g. UDYAM-KL-11-0001404"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Classification Selector */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                  MSME Statutory Classification
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Micro', 'Small', 'Medium'] as MSMEClassification[]).map((cls) => {
                    const isSelected = classification === cls;
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setClassification(cls)}
                        className={`p-2.5 rounded-lg border text-left transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs">{cls} Enterprise</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {cls === 'Micro' && 'Turnover ≤ ₹10 Cr | Inv ≤ ₹2.5 Cr'}
                          {cls === 'Small' && 'Turnover ≤ ₹100 Cr | Inv ≤ ₹25 Cr'}
                          {cls === 'Medium' && 'Turnover ≤ ₹500 Cr | Inv ≤ ₹125 Cr'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sector & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Kerala Industry Sector
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {KERALA_SECTORS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Kerala District Jurisdiction (14 Districts)
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setDicName(`District Industries Centre (DIC), ${e.target.value}`);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {KERALA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NIC Code & Incorporation Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    NIC Activity Code / Description
                  </label>
                  <input
                    type="text"
                    value={nicCode}
                    onChange={(e) => setNicCode(e.target.value)}
                    placeholder="e.g. 1079 - Manufacture of agro & food products"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Incorporation / Commencement Date
                  </label>
                  <input
                    type="date"
                    value={registrationDate}
                    onChange={(e) => setRegistrationDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Address & PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Plant / Principal Operating Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Plot 18, KINFRA Mega Food Park, Kakkancherry"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 682001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Tax Identifiers & Direct Contact Details */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Statutory Registrations & Corporate Contacts:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                      GSTIN (State Code: 32)
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="e.g. 32AAACB1294F1Z5"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                      PAN Card Number
                    </label>
                    <input
                      type="text"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value)}
                      placeholder="e.g. AAACB1294F"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. corporate@company.in"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                      Promoter / Signatory Name
                    </label>
                    <input
                      type="text"
                      value={promoterName}
                      onChange={(e) => setPromoterName(e.target.value)}
                      placeholder="e.g. Pradeep K. Nair"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. +91 98471 28942"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                      SME Banking Hub
                    </label>
                    <input
                      type="text"
                      value={bankBranch}
                      onChange={(e) => setBankBranch(e.target.value)}
                      placeholder="e.g. State Bank of India, Kochi SME Hub"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Financial Scale */}
          {activeTab === 'financials' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Annual Audited Turnover (₹)
                    </label>
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {formatINR(turnover)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={turnover}
                    onChange={(e) => setTurnover(Number(e.target.value))}
                    min={0}
                    step={100000}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Statutory threshold ceiling: Micro (≤ ₹10 Cr), Small (≤ ₹100 Cr), Medium (≤ ₹500 Cr).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Plant & Machinery Investment (₹)
                    </label>
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {formatINR(investment)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(Number(e.target.value))}
                    min={0}
                    step={100000}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Statutory investment ceiling: Micro (≤ ₹2.5 Cr), Small (≤ ₹25 Cr), Medium (≤ ₹125 Cr).
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Total Full-Time Employee Workforce
                </label>
                <input
                  type="number"
                  value={kpis.employeeCount || 20}
                  onChange={(e) =>
                    setKpis({ ...kpis, employeeCount: Number(e.target.value) })
                  }
                  min={1}
                  className="w-full max-w-xs px-3 py-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500">
                  Used in evaluating employment generation schemes (PMEGP, Aatmanirbhar Bharat Rozgar Yojana).
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Scheme Enrichment KPIs */}
          {activeTab === 'kpis' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="font-semibold text-emerald-950">
                    Deterministic Scheme Matching Engine Parameters
                  </strong>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    These specialized operational parameters match the enterprise against specific ministerial subsidies (Export incentives, Solar/Green subsidies, ZED certifications, and Credit Guarantees).
                  </p>
                </div>
              </div>

              {/* KPI 1: Export Profile */}
              <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">
                        Export & Foreign Exchange Profile
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Qualifies for EPCG, RoDTEP, Spices Board & Marine Products (MPEDA) export subsidies.
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kpis.isExporter || false}
                      onChange={(e) =>
                        setKpis({ ...kpis, isExporter: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span className="font-semibold text-xs text-slate-700">
                      Active Exporter
                    </span>
                  </label>
                </div>

                {kpis.isExporter && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                    <label className="text-[11px] font-medium text-slate-600">
                      Export Turnover Share (%):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={kpis.exportTurnoverPercentage || 0}
                        onChange={(e) =>
                          setKpis({
                            ...kpis,
                            exportTurnoverPercentage: Math.min(100, Math.max(0, Number(e.target.value))),
                          })
                        }
                        min={0}
                        max={100}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                      <span className="text-slate-500 font-semibold">%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* KPI 2: ZED & Quality Certification */}
              <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">
                        MSME Sustainable (ZED) & Quality Standards
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Qualifies for MSME Sustainable ZED Certification subsidies (up to 85% grant) and ISO reimbursements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      ZED Certification Status
                    </label>
                    <select
                      value={kpis.zedCertification || 'None'}
                      onChange={(e) =>
                        setKpis({
                          ...kpis,
                          zedCertification: e.target.value as any,
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="None">None (Uncertified)</option>
                      <option value="Bronze">Bronze (Eligible for 85% Micro / 60% Small Subsidy)</option>
                      <option value="Silver">Silver Certified</option>
                      <option value="Gold">Gold Certified (Highest Quality Tier)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="isoCert"
                      checked={kpis.isoCertified || false}
                      onChange={(e) =>
                        setKpis({ ...kpis, isoCertified: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <label htmlFor="isoCert" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      ISO 9001 / ISO 22000 / HACCP Certified
                    </label>
                  </div>
                </div>
              </div>

              {/* KPI 3: Green Energy / Solar Adoption */}
              <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">
                        Green Energy & Rooftop Solar Adoption
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Qualifies for PM Surya Ghar, BEE Energy Efficiency, and Green MSME capital grants.
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kpis.greenEnergyAdoption || false}
                      onChange={(e) =>
                        setKpis({ ...kpis, greenEnergyAdoption: e.target.checked })
                      }
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                    />
                    <span className="font-semibold text-xs text-slate-700">
                      Clean Energy Adopted
                    </span>
                  </label>
                </div>

                {kpis.greenEnergyAdoption && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                    <label className="text-[11px] font-medium text-slate-600">
                      Clean Tech / Solar Investment (₹):
                    </label>
                    <input
                      type="number"
                      value={kpis.greenEnergyInvestment || 0}
                      onChange={(e) =>
                        setKpis({
                          ...kpis,
                          greenEnergyInvestment: Number(e.target.value),
                        })
                      }
                      step={50000}
                      className="w-36 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                    />
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                      {formatINR(kpis.greenEnergyInvestment || 0)}
                    </span>
                  </div>
                )}
              </div>

              {/* KPI 4: Credit Guarantee & Debt Requirements */}
              <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">
                      Credit Guarantee & Collateral-Free Debt Requirements
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Qualifies for CGTMSE (up to ₹5 Cr collateral-free coverage) and Interest Subvention Scheme.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Proposed Debt / Credit Need (₹)
                    </label>
                    <input
                      type="number"
                      value={kpis.creditRequirement || 0}
                      onChange={(e) =>
                        setKpis({
                          ...kpis,
                          creditRequirement: Number(e.target.value),
                        })
                      }
                      step={100000}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800"
                    />
                    <span className="text-[10px] font-mono text-indigo-700 font-semibold mt-0.5 block">
                      {formatINR(kpis.creditRequirement || 0)}
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Existing Bank Credit / Loans (₹)
                    </label>
                    <input
                      type="number"
                      value={kpis.existingCreditAvailment || 0}
                      onChange={(e) =>
                        setKpis({
                          ...kpis,
                          existingCreditAvailment: Number(e.target.value),
                        })
                      }
                      step={100000}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800"
                    />
                    <span className="text-[10px] font-mono text-slate-600 font-semibold mt-0.5 block">
                      {formatINR(kpis.existingCreditAvailment || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* KPI 5: Social Ownership (Women / SC-ST) */}
              <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">
                      Inclusive Ownership & Priority Cohorts
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Qualifies for Stand-Up India (up to ₹1 Cr loan), Mudra Yojana (Tarun/Kishore), and special DIC grants.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Women Equity / Promoter Share (%)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={kpis.womenOwnershipPercentage || 0}
                        onChange={(e) =>
                          setKpis({
                            ...kpis,
                            womenOwnershipPercentage: Math.min(100, Math.max(0, Number(e.target.value))),
                          })
                        }
                        min={0}
                        max={100}
                        className="w-24 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                      <span className="text-slate-500 font-semibold">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      SC / ST Ownership Share (%)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={kpis.scStOwnershipPercentage || 0}
                        onChange={(e) =>
                          setKpis({
                            ...kpis,
                            scStOwnershipPercentage: Math.min(100, Math.max(0, Number(e.target.value))),
                          })
                        }
                        min={0}
                        max={100}
                        className="w-24 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                      <span className="text-slate-500 font-semibold">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save & Recalculate Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
