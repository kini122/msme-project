'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  FileCheck2,
  SearchCode,
  ShieldCheck,
  Award,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Overview & Snapshot',
    href: '/overview',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Company Master List',
    href: '/companies',
    icon: Building2,
    badge: null,
  },
  {
    name: 'Scheme Explorer',
    href: '/schemes',
    icon: FileCheck2,
    badge: null,
  },
  {
    name: 'Live Udyam Verification',
    href: '/live-lookup',
    icon: SearchCode,
    badge: null,
    isLive: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded bg-emerald-600 flex items-center justify-center text-white shadow-md font-bold text-lg font-heading">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm tracking-tight text-white leading-none">
              MSME INTELLIGENCE
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              CA Rangamani Associates
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="px-3 py-4 flex-1 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Core Workstation
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/overview' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold border-l-3 border-emerald-500 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-emerald-400'
                      : item.isLive
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    item.isLive
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                      : isActive
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Advisory Information Panel */}
      <div className="p-4 m-3 bg-slate-800/60 border border-slate-700/60 rounded-md text-xs space-y-2">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span>Statutory Intelligence</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          National MSME registry intelligence with deterministic eligibility evaluation across central and state policies.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/60">
          <span>Platform Version</span>
          <span className="font-semibold text-slate-200 font-mono">v1.0 Sovereign</span>
        </div>
      </div>
    </aside>
  );
}
