import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  icon: LucideIcon;
  colorScheme?: 'slate' | 'sky' | 'indigo' | 'amber' | 'emerald';
  href?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
  colorScheme = 'slate',
  href,
}: KpiCardProps) {
  const colorMap = {
    slate: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      badgeBg: 'bg-slate-100 text-slate-600',
    },
    sky: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-sky-300',
      iconBg: 'bg-sky-50 text-sky-600',
      badgeBg: 'bg-sky-50 text-sky-700 border border-sky-200',
    },
    indigo: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-indigo-300',
      iconBg: 'bg-indigo-50 text-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    },
    amber: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    emerald: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.slate;

  const content = (
    <div
      className={`${scheme.bg} border ${scheme.border} rounded-lg p-5 shadow-subtle transition-all duration-200 flex flex-col justify-between h-full group relative`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-sans">
            {title}
          </span>
          <div className={`w-8 h-8 rounded flex items-center justify-center ${scheme.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {value}
          </span>
          {badge && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${scheme.badgeBg}`}>
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px]">{subtitle}</span>
        {href && (
          <span className="flex items-center gap-0.5 text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
            <span>Filter</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
