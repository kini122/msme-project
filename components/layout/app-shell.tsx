'use client';

import React from 'react';
import { Sidebar } from './sidebar';
import { Clock, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = React.useState<string>('');

  React.useEffect(() => {
    setCurrentTime(
      new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Static Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Operational Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              National MSME & Government Scheme Intelligence
            </span>
            <span className="text-slate-300">|</span>
            <span className="hidden sm:inline-block text-slate-500">
              FY 2024-25 Assessment Environment
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Realtime Clock / Sync indicator */}
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>Registry Sync:</span>
              <span className="font-medium text-slate-800">
                {currentTime || 'Synchronized'} IST
              </span>
            </div>

            {/* Live Verification CTA */}
            <Link
              href="/live-lookup"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded text-xs font-semibold transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Udyam Verification</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Body Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
