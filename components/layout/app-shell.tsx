'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Sidebar } from './sidebar';
import { Clock, ShieldCheck, Sparkles, LogOut, User, Building2, Lock } from 'lucide-react';
import Link from 'next/link';
import LoginPage from '@/app/login/page';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isAdmin, logout } = useAuth();
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

  // If on login page, render directly
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If loading session from storage, show clean loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <ShieldCheck className="w-10 h-10 text-emerald-500 animate-pulse mb-3" />
        <span className="text-xs font-mono">Initializing CA Rangamani Associates Portal...</span>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

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
              Kerala MSME Statutory & Scheme Intelligence
            </span>
            <span className="text-slate-300">|</span>
            <span className="hidden sm:inline-block text-slate-500 font-medium">
              CA Rangamani Associates • {user?.branch || 'Kochi'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Realtime Clock / Sync indicator */}
            <div className="hidden md:flex items-center gap-1.5 text-slate-500 font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>Sync:</span>
              <span className="font-medium text-slate-800">
                {currentTime || 'Live'} IST
              </span>
            </div>

            {/* Live Verification CTA - Admin Only */}
            {isAdmin && (
              <Link
                href="/live-lookup"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded text-xs font-semibold transition shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Udyam Verification</span>
              </Link>
            )}

            {/* Active User Pill & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full text-xs">
                <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <span className="font-medium text-slate-800 text-[11px] truncate max-w-[130px]">
                  {user?.name || 'Staff User'}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full ${
                    isAdmin
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'View Only'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                title="Log Out from Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
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
