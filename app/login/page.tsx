'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Building2,
  Shield,
  UserCheck,
} from 'lucide-react';

const QUICK_ROLES = [
  {
    id: 'admin',
    name: 'CA Rajesh Rangamani',
    roleLabel: 'Senior Partner (Admin)',
    email: 'admin@carangamani.com',
    pass: 'Admin@2026',
    badge: 'Full Access',
  },
  {
    id: 'emp1',
    name: 'Ananya Nair',
    roleLabel: 'Statutory Analyst',
    email: 'employee1@carangamani.com',
    pass: 'Staff@2026',
    badge: 'Associate',
  },
  {
    id: 'emp2',
    name: 'Rahul Menon',
    roleLabel: 'Compliance Associate',
    email: 'employee2@carangamani.com',
    pass: 'Staff@2026',
    badge: 'Associate',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('admin@carangamani.com');
  const [password, setPassword] = useState('Admin@2026');
  const [selectedRoleId, setSelectedRoleId] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to overview
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/overview');
    }
  }, [isAuthenticated, router]);

  const handleSelectRole = (role: typeof QUICK_ROLES[0]) => {
    setSelectedRoleId(role.id);
    setEmail(role.email);
    setPassword(role.pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your corporate email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/overview');
    } else {
      setError(res.error || 'Invalid credentials. Please verify and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-950/50 mb-1 border border-emerald-400/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold font-heading text-white tracking-tight">
            CA Rangamani Associates
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Kerala MSME Statutory & Scheme Intelligence Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-heading">
                Staff Authentication
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sign in with authorized corporate credentials
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Staff Portal
            </span>
          </div>

          {/* Role Preset Tabs */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Authorized Account:
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800/80">
              {QUICK_ROLES.map((role) => {
                const isSelected = selectedRoleId === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(role)}
                    className={`py-2 px-1.5 rounded-md text-center transition flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-slate-800 text-emerald-300 font-semibold shadow-xs border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    <span className="text-[11px] truncate w-full block">
                      {role.name.split(' ')[0]} {role.name.split(' ')[1] || ''}
                    </span>
                    <span className="text-[9px] text-slate-500 block truncate">
                      {role.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-lg text-xs text-rose-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@carangamani.com"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-500 hover:text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 transition"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In to Portal</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Corporate Footer */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500">
            CA Rangamani Associates • Chartered Accountants © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
