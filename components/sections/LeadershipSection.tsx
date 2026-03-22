'use client';

import { User, Linkedin } from 'lucide-react';
import { jsonToArray, ensureHttps } from '@/lib/utils';

interface Props {
  leadership: string | null | undefined;
  ceoName?: string | null;
  ceoLinkedin?: string | null;
  ceoScore?: number | null;
}

interface LeaderEntry {
  name?: string;
  title?: string;
  linkedin?: string;
  stats: Array<{ label: string; value: number }>;
}

function parseAllLeaders(
  value: unknown,
  ceoName?: string | null,
  ceoLinkedin?: string | null,
  ceoScore?: number | null
): LeaderEntry[] {
  let arr: unknown[] = [];
  if (value) {
    if (typeof value === 'string') {
      const cleaned = value
        .replace(/"([^"]+):\"\s*"/g, '"$1": "')
        .replace(/,\s*([}\]])/g, '$1');
      try {
        const parsed = JSON.parse(cleaned);
        arr = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        arr = [];
      }
    } else {
      arr = jsonToArray(value);
    }
  }

  const SCORE_LABEL_MAP: Record<string, string> = {
    'CEO Rating': 'CEO Rating',
    'Leadership Score': 'Leadership',
    'Manager Score': 'Manager',
    'Manager': 'Manager',
    'Executive Team Score': 'Exec Team',
  };

  const parsedLeaders = arr
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

  if (ceoName) {
    const hasCeoInParsed = parsedLeaders.some((l) => l.name?.toLowerCase() === ceoName.toLowerCase());
    if (!hasCeoInParsed) {
      parsedLeaders.unshift({
        name: ceoName,
        title: 'CEO',
        linkedin: ceoLinkedin || undefined,
        stats: ceoScore ? [{ label: 'CEO Rating', value: ceoScore }] : [],
      });
    }
  }

  return parsedLeaders;
}

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function LeadershipSection({ leadership, ceoName, ceoLinkedin, ceoScore }: Props) {
  const leaders = parseAllLeaders(leadership, ceoName, ceoLinkedin, ceoScore);
  if (leaders.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Leadership</h2>
      </div>
      <div className="bg-white border border-[#7d7373] p-5 sm:p-6 space-y-3">
        {leaders.map((leader, idx) => (
          <div key={idx} className="border border-[#7d7373] p-4 group hover:border-[#ff4f12]/30 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start justify-between">
              <div className="flex items-center sm:items-start gap-3.5 flex-shrink-0 text-center sm:text-left">
                <div className="w-12 h-12 bg-[#fff1ec] flex items-center justify-center flex-shrink-0">
                  <User strokeWidth={1.5} className="w-6 h-6 text-[#ff4f12]" />
                </div>
                <div className="min-w-0">
                  {leader.name && <p className="font-semibold text-gray-900 text-sm">{leader.name}</p>}
                  {leader.title && <p className="text-xs text-gray-500 mt-0.5">{leader.title}</p>}
                  {leader.linkedin && (
                    <a
                      href={ensureHttps(leader.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-[#ff4f12] mt-2 hover:text-gray-900 transition-colors uppercase tracking-widest font-semibold"
                    >
                      <Linkedin strokeWidth={1.5} className="w-3 h-3" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {leader.stats.length > 0 && (
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5 flex-shrink-0">
                  {leader.stats.map((stat, i) => {
                    const data = [
                      { name: 'Score', value: stat.value },
                      { name: 'Remaining', value: 100 - stat.value },
                    ];
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-16 h-16 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={20}
                                outerRadius={28}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                              >
                                <Cell key="cell-0" fill="#82c92f" />
                                <Cell key="cell-1" fill="#f3f4f6" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-900">{stat.value}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
