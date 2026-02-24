'use client';

import { User, LinkedinLogo } from '@phosphor-icons/react';
import { jsonToArray, ensureHttps } from '@/lib/utils';

interface Props {
  leadership: string | null | undefined;
}

interface LeaderEntry {
  name?: string;
  title?: string;
  linkedin?: string;
  stats: Array<{ label: string; value: number }>;
}

function parseAllLeaders(value: unknown): LeaderEntry[] {
  if (!value) return [];
  let arr: unknown[] = [];
  if (typeof value === 'string') {
    // Fix broken JSON keys like "CEO Rating:" "83/100"
    const cleaned = value
      .replace(/"([^"]+):\"\s*"/g, '"$1": "')
      .replace(/,\s*([}\]])/g, '$1');
    try {
      const parsed = JSON.parse(cleaned);
      arr = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  } else {
    arr = jsonToArray(value);
  }

  const SCORE_LABEL_MAP: Record<string, string> = {
    'CEO Rating': 'CEO Rating',
    'Leadership Score': 'Leadership',
    'Manager Score': 'Manager',
    'Manager': 'Manager',
    'Executive Team Score': 'Exec Team',
  };

  return arr
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const r = item as Record<string, unknown>;
      const name = String(r.name ?? r.Name ?? '').trim() || undefined;
      const title = String(r.title ?? r.Title ?? '').trim() || undefined;
      const linkedinRaw = r['CEO LinkedIn'] ?? r.linkedin ?? r.LinkedIn ?? r['LinkedIn Profile'];
      const linkedin = linkedinRaw ? String(linkedinRaw).trim() : undefined;

      const stats: Array<{ label: string; value: number }> = [];
      for (const [k, v] of Object.entries(r)) {
        if (!/score|rating|manager/i.test(k)) continue;
        if (/linkedin|url|http/i.test(k)) continue;
        const raw = String(v ?? '');
        const numMatch = raw.match(/(\d+)/);
        if (!numMatch) continue;
        const n = parseInt(numMatch[1], 10);
        if (isNaN(n) || n <= 0) continue;
        const label = SCORE_LABEL_MAP[k] ?? k.replace(/\s*(Score|Rating)$/i, '').trim();
        stats.push({ label, value: Math.max(0, Math.min(100, n)) });
      }

      return { name, title, linkedin, stats };
    });
}

export default function LeadershipSection({ leadership }: Props) {
  const leaders = parseAllLeaders(leadership);
  if (leaders.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-[#ff4f12]" />
        <h2 className="text-lg font-semibold text-gray-900">Leadership</h2>
      </div>
      <div className="space-y-4">
        {leaders.map((leader, idx) => {
          const maxValue = leader.stats.length > 0 
            ? Math.max(...leader.stats.map(s => s.value), 100)
            : 100;
          return (
            <div key={idx} className="border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Left: person info */}
                <div className="flex items-start gap-3 flex-shrink-0">
                  <div className="w-12 h-12 bg-[#fff1ec] flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-[#ff4f12]" />
                  </div>
                  <div className="min-w-0">
                    {leader.name && <p className="font-semibold text-gray-900 text-sm">{leader.name}</p>}
                    {leader.title && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{leader.title}</p>}
                    {leader.linkedin && (
                      <a
                        href={ensureHttps(leader.linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#ff4f12] mt-2 hover:underline"
                      >
                        <LinkedinLogo className="w-3 h-3" />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: CSS horizontal bar chart */}
                {leader.stats.length > 0 && (
                  <div className="flex-1 min-w-0">
                    <div className="space-y-4">
                      {leader.stats.map((stat, i) => {
                        const pct = maxValue > 0 ? (stat.value / maxValue) * 100 : 0;
                        return (
                          <div key={i} className="group relative">
                            {/* Label above bar */}
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-medium text-gray-600">
                                {stat.label}
                              </span>
                              <span className="text-xs text-gray-400 tabular-nums">
                                {stat.value}/100
                              </span>
                            </div>
                            {/* Bar track with hover */}
                            <div className="w-full bg-gray-100 h-2.5 relative cursor-pointer">
                              <div
                                className="h-full bg-[#ff4f12] transition-all group-hover:bg-[#e5440d]"
                                style={{ width: `${pct}%` }}
                              />
                              {/* Hover tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="bg-white border border-gray-200 shadow-lg px-3 py-2 whitespace-nowrap">
                                  <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                                  <p className="text-sm font-medium text-[#ff4f12]">Score : {stat.value}</p>
                                </div>
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
