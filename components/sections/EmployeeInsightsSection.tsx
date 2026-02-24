'use client';

import { Users } from '@phosphor-icons/react';
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { normalizeHeadcountByCountry, normalizeHeadcountByMonth } from '@/lib/utils';

interface Props {
  headcount: number | null | undefined;
  byCountry: unknown;
  byMonth: unknown;
}

const MAX_BARS = 5;

function titleCaseLocation(label: string): string {
  const raw = (label || '').trim();
  if (!raw || raw === '—') return '—';
  return raw
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ');
}

export default function EmployeeInsightsSection({ headcount, byCountry, byMonth }: Props) {
  const top5 = normalizeHeadcountByCountry(byCountry)
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_BARS)
    .map((r) => ({ ...r, country: titleCaseLocation(r.country) }));

  // Always pad to 5 rows for consistent height
  const countryRows = [
    ...top5,
    ...Array.from({ length: Math.max(0, MAX_BARS - top5.length) }, () => ({
      country: '',
      count: 0,
    })),
  ];

  const monthData = normalizeHeadcountByMonth(byMonth)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ month, count }) => ({ month, count }));

  const hasData = headcount != null || top5.length > 0 || monthData.length > 0;
  if (!hasData) return null;

  const maxCount = top5.length > 0 ? top5[0].count : 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Users className="w-5 h-5 text-[#ff4f12]" />
        <h2 className="text-lg font-semibold text-gray-900">Employee Insights</h2>
      </div>

      {/* Big headcount number */}
      {headcount != null && (
        <div className="text-center mb-8">
          <p className="text-6xl font-bold text-gray-900">{headcount.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">Actual Total Headcount</p>
        </div>
      )}

      {/* Headcount by Location — pure CSS horizontal bar chart */}
      {top5.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Headcount by Location</h3>
          <div className="space-y-3">
            {countryRows.map((row, i) => {
              const pct = maxCount > 0 ? (row.count / maxCount) * 100 : 0;
              const isEmpty = !row.country;
              return (
                <div key={i} className="flex items-center gap-2 sm:gap-3 group">
                  {/* Label — responsive width */}
                  <span
                    className="text-xs text-gray-500 text-right flex-shrink-0 w-20 sm:w-28"
                  >
                    {isEmpty ? '' : row.country}
                  </span>
                  {/* Bar track with hover */}
                  <div className="flex-1 bg-gray-100 h-7 relative cursor-pointer min-w-0">
                    {!isEmpty && pct > 0 && (
                      <div
                        className="absolute inset-y-0 left-0 bg-[#ff4f12] transition-all group-hover:bg-[#e5440d]"
                        style={{ width: `${pct}%` }}
                      />
                    )}
                    {/* Hover tooltip */}
                    {!isEmpty && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="bg-white border border-gray-200 shadow-lg px-3 py-2 whitespace-nowrap">
                          <p className="text-xs text-gray-500 mb-0.5">{row.country}</p>
                          <p className="text-sm font-medium text-[#ff4f12]">Employees : {row.count.toLocaleString()}</p>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
                      </div>
                    )}
                  </div>
                  {/* Value */}
                  <span
                    className="text-xs text-gray-500 flex-shrink-0 tabular-nums w-14 sm:w-20 text-right"
                  >
                    {isEmpty ? '' : row.count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Headcount Over Time — area chart with gradient */}
      {monthData.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Headcount Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthData}
                margin={{ top: 5, right: 16, left: 0, bottom: 18 }}
              >
                <defs>
                  <linearGradient id="hcGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4f12" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ff4f12" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  angle={0}
                  textAnchor="middle"
                  interval={Math.max(0, Math.floor(monthData.length / 6) - 1)}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 0, border: '1px solid #e5e7eb' }}
                  formatter={(value: number | undefined) => [(value ?? 0).toLocaleString(), 'Employees']}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#ff4f12"
                  strokeWidth={2}
                  fill="url(#hcGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#ff4f12', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
