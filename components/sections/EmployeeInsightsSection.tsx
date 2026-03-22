'use client';

import { Users } from 'lucide-react';
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
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

  const monthData = normalizeHeadcountByMonth(byMonth)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ month, count }) => ({ month, count }));

  const hasData = headcount != null || top5.length > 0 || monthData.length > 0;
  if (!hasData) return null;

  const BAR_COLORS = ['#ff4f12', '#ffba00', '#82c92f', '#e8679a', '#9ca3af'];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Employee Insights</h2>
      </div>
      <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
        {/* Headcount number */}
        {headcount != null && (
          <div className="mb-6 pb-4 border-b border-[#7d7373]">
            <p className="text-2xl font-bold text-gray-900">{headcount.toLocaleString()}</p>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mt-0.5">Total Global Headcount</p>
          </div>
        )}

        {/* Headcount by Location — Pie chart */}
        {top5.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4 pb-2 border-b border-[#7d7373]">Headcount by Location</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={top5}
                    dataKey="count"
                    nameKey="country"
                    cx="40%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    stroke="none"
                    paddingAngle={2}
                  >
                    {top5.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ fontSize: 12, borderRadius: 0, border: '1px solid #f3f4f6', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                    itemStyle={{ color: '#ff4f12' }}
                    formatter={(value: number | undefined) => [(value ?? 0).toLocaleString(), 'Employees']}
                  />
                  <Legend 
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ paddingLeft: '20px' }}
                    content={(props) => {
                      const { payload } = props;
                      return (
                        <div className="flex flex-col gap-2.5">
                          {payload?.map((entry, index) => (
                            <div key={`item-${index}`} className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 flex-shrink-0" style={{ backgroundColor: entry.color }} />
                              <span className="text-[10px] font-semibold tracking-wide uppercase text-gray-600 truncate max-w-[120px]" title={entry.value as string}>{entry.value}</span>
                              <span className="text-xs font-semibold tabular-nums text-gray-900 ml-auto">
                                {top5[index]?.count.toLocaleString() || ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Headcount Over Time — area chart */}
        {monthData.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-5 pb-2 border-b border-[#7d7373]">Headcount Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthData}
                  margin={{ top: 5, right: 16, left: 0, bottom: 18 }}
                >
                  <defs>
                    <linearGradient id="hcGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffba00" stopOpacity={0.3} />
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
                    dy={10}
                    tickFormatter={(v: string) => v ? v.toUpperCase() : ''}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 0, border: '1px solid #f3f4f6', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                    formatter={(value: number | undefined) => [(value ?? 0).toLocaleString(), 'Employees']}
                    itemStyle={{ color: '#ff4f12' }}
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
    </div>
  );
}
