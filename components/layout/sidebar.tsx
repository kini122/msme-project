'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import {
  LayoutDashboard,
  Building2,
  FileCheck2,
  SearchCode,
  ShieldCheck,
  Award,
  LogOut,
  UserCheck,
  Building,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    {
      name: 'Overview & Snapshot',
      href: '/overview',
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      name: 'Company Master List',
      href: '/companies',
      icon: Building2,
      adminOnly: false,
    },
    {
      name: 'Scheme Explorer',
      href: '/schemes',
      icon: FileCheck2,
      adminOnly: false,
    },
    {
      name: 'Live Udyam Verification',
      href: '/live-lookup',
      icon: SearchCode,
      adminOnly: true, // Only visible to Admin
      isLive: true,
    },
  ];

  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);

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
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">
              Kerala Regional Directorate
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="px-3 py-4 flex-1 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Workstation Navigation
        </div>

        {visibleNavItems.map((item) => {
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
            </Link>
          );
        })}
      </div>

      {/* Active User Dossier & Session Card */}
      <div className="p-3 m-3 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isAdmin
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-blue-950 text-blue-400 border border-blue-800'
              }`}
            >
              {isAdmin ? <UserCheck className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
            </div>
            <div className="leading-tight">
              <span className="font-semibold text-slate-100 text-xs block truncate max-w-[120px]">
                {user?.name || 'Staff User'}
              </span>
              <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                {user?.designation || 'Associate'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="p-1 text-slate-400 hover:text-rose-400 transition"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/60 font-mono">
          <span>Role Clearance:</span>
          <span className={`font-bold ${isAdmin ? 'text-emerald-400' : 'text-blue-400'}`}>
            {isAdmin ? 'ADMIN (Full Access)' : 'EMPLOYEE (View Only)'}
          </span>
        </div>
      </div>
    </aside>
  );
}
