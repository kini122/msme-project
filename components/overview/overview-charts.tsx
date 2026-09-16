'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface OverviewChartsProps {
  classificationData: Array<{ name: string; value: number; color: string }>;
  sectorData: Array<{ name: string; count: number }>;
  districtData: Array<{ name: string; count: number }>;
}

export function OverviewCharts({
  classificationData,
  sectorData,
  districtData,
}: OverviewChartsProps) {
  const [activeTab, setActiveTab] = React.useState<'sector' | 'district'>('sector');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 h-80 animate-pulse bg-slate-50" />
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 h-80 animate-pulse bg-slate-50" />
      </div>
    );
  }

  const secondaryChartData = activeTab === 'sector' ? sectorData : districtData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Classification Donut Chart */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Kerala MSME Classification Distribution
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Cohort Share
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Breakdown across Micro, Small, and Medium cohorts across Kerala districts
          </p>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={classificationData}
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {classificationData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [
                  `${value} Enterprises`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
                itemStyle={{ color: '#ffffff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-100 text-center">
          {classificationData.map((item) => (
            <div key={item.name} className="flex-1 min-w-[90px] p-1.5 rounded bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] font-medium text-slate-600 truncate">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-bold font-mono text-slate-900 block">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector & District Breakdown Bar Chart */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Kerala Industry & Regional Concentrations
            </h3>
            {/* Tab switch */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('sector')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  activeTab === 'sector'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                By Sector
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('district')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  activeTab === 'district'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                By District
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Enterprise count clustered by {activeTab === 'sector' ? 'Kerala industrial sector' : 'Kerala district jurisdiction'}
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={secondaryChartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 11, fill: '#334155' }}
              />
              <Tooltip
                formatter={(val: any) => [`${val} Units`, 'Count']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#0284c7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Displaying Top Active Kerala Clusters</span>
          <span className="font-mono">Total Distinct Clusters: {secondaryChartData.length}</span>
        </div>
      </div>
    </div>
  );
}
