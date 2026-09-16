'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { KpiCard } from '@/components/overview/kpi-card';
import { OverviewCharts } from '@/components/overview/overview-charts';
import { DisclaimerBanner } from '@/components/ui/disclaimer-banner';
import { useAppData } from '@/lib/store/app-data-context';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Building2,
  PieChart,
  FileCheck2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  const { companies, schemes } = useAppData();
  const { isAdmin, user } = useAuth();

  const totalCompanies = companies.length;
  const microCount = companies.filter((c) => c.classification === 'Micro').length;
  const smallCount = companies.filter((c) => c.classification === 'Small').length;
  const mediumCount = companies.filter((c) => c.classification === 'Medium').length;

  const unclassifiedCount = companies.filter(
    (c) => !c.classification || !['Micro', 'Small', 'Medium'].includes(c.classification)
  ).length;

  // Chart data calculation
  const classificationData = [
    { name: 'Micro', value: microCount, color: '#0284c7' },
    { name: 'Small', value: smallCount, color: '#4f46e5' },
    { name: 'Medium', value: mediumCount, color: '#d97706' },
  ];
  if (unclassifiedCount > 0) {
    classificationData.push({ name: 'Registered MSME', value: unclassifiedCount, color: '#10b981' });
  }

  // Sector breakdown aggregation
  const sectorCountMap: Record<string, number> = {};
  for (const c of companies) {
    const s = c.sector || 'Commercial MSME';
    sectorCountMap[s] = (sectorCountMap[s] || 0) + 1;
  }
  const sectorData = Object.entries(sectorCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  // District breakdown aggregation
  const districtCountMap: Record<string, number> = {};
  for (const c of companies) {
    const d = c.district || 'Kerala';
    districtCountMap[d] = (districtCountMap[d] || 0) + 1;
  }
  const districtData = Object.entries(districtCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Kerala MSME Executive Snapshot"
        description="Executive statutory dashboard evaluating registered Kerala MSME cohort distributions, industrial sector concentrations across all 14 districts, and ministerial scheme capacity."
        source="data.gov.in"
        actions={
          isAdmin ? (
            <div className="flex items-center gap-2">
              <Link
                href="/live-lookup"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded text-xs font-semibold transition shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Verify Enterprise URN</span>
              </Link>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>Logged in as {user?.name} (Read Only)</span>
            </div>
          )
        }
      />

      <DisclaimerBanner />

      {/* KPI Cards Row with Drilldown Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Registered Enterprises"
          value={totalCompanies}
          subtitle="Kerala Statutory Registry"
          badge="100% Verified"
          icon={Building2}
          colorScheme="slate"
          href="/companies"
        />

        <KpiCard
          title="Micro Enterprises"
          value={microCount}
          subtitle="Turnover ≤ ₹10 Cr | Inv ≤ ₹2.5 Cr"
          badge={`${totalCompanies > 0 ? Math.round((microCount / totalCompanies) * 100) : 0}% Share`}
          icon={PieChart}
          colorScheme="sky"
          href="/companies?classification=Micro"
        />

        <KpiCard
          title="Small Enterprises"
          value={smallCount}
          subtitle="Turnover ≤ ₹100 Cr | Inv ≤ ₹25 Cr"
          badge={`${totalCompanies > 0 ? Math.round((smallCount / totalCompanies) * 100) : 0}% Share`}
          icon={TrendingUp}
          colorScheme="indigo"
          href="/companies?classification=Small"
        />

        <KpiCard
          title="Medium Enterprises"
          value={mediumCount}
          subtitle="Turnover ≤ ₹500 Cr | Inv ≤ ₹125 Cr"
          badge={`${totalCompanies > 0 ? Math.round((mediumCount / totalCompanies) * 100) : 0}% Share`}
          icon={ShieldCheck}
          colorScheme="amber"
          href="/companies?classification=Medium"
        />
      </div>

      {/* Analytics Visualizations */}
      <OverviewCharts
        classificationData={classificationData}
        sectorData={sectorData}
        districtData={districtData}
      />

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          href="/companies"
          className="p-5 bg-white border border-slate-200 rounded-lg shadow-subtle hover:shadow-card hover:border-slate-300 transition group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold font-heading text-sm text-slate-900 group-hover:text-blue-600 transition">
              Kerala Company Master List &rarr;
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Browse, filter by Kerala sector and district, sort verified enterprise records, and inspect individual enterprise profiles.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
            <span>Explore {totalCompanies} Kerala Enterprise Dossiers</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/schemes"
          className="p-5 bg-white border border-slate-200 rounded-lg shadow-subtle hover:shadow-card hover:border-slate-300 transition group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold font-heading text-sm text-slate-900 group-hover:text-purple-600 transition">
              Kerala & Central Scheme Explorer &rarr;
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Explore 4,700+ Central and Kerala State MSME programs, filter by nodal ministry, and evaluate qualifying candidate enterprises.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-purple-600 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
            <span>Access Scheme Repository</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        {isAdmin ? (
          <Link
            href="/live-lookup"
            className="p-5 bg-white border border-slate-200 rounded-lg shadow-subtle hover:shadow-card hover:border-slate-300 transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold font-heading text-sm text-slate-900 group-hover:text-amber-600 transition">
                Live Enterprise Verification &rarr;
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Verify active Udyam credentials on-demand and evaluate real-time statutory scheme eligibility across central and Kerala programs.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
              <span>Launch Verification Gateway</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ) : (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg shadow-subtle flex flex-col justify-between opacity-80">
            <div>
              <div className="w-9 h-9 rounded bg-slate-200 text-slate-600 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold font-heading text-sm text-slate-700">
                Live Verification Gateway (Admin Only)
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Direct Udyam statutory gateway queries and API batch synchronization are reserved for Senior Partners & Administrators.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 mt-3 pt-3 border-t border-slate-200 flex items-center gap-1">
              <span>View-Only Employee Access</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
