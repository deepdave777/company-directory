import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | null | undefined): string {
  if (num == null) return 'N/A';
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num}`;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  // Handle formats like "2023-01" → "January 2023"
  const monthMatch = dateStr.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) {
    const date = new Date(parseInt(monthMatch[1]), parseInt(monthMatch[2]) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  // Handle full dates
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  } catch {}
  return dateStr;
}

export function formatShortDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  } catch {}
  return dateStr;
}

export function parseJsonField<T>(field: unknown): T[] {
  if (!field) return [];
  if (Array.isArray(field)) return field as T[];
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function extractDomain(url: string | null | undefined): string {
  if (!url) return '';
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function ensureHttps(url: string | null | undefined): string {
  if (!url) return '#';
  if (url.startsWith('http')) return url;
  return `https://${url}`;
}

export function jsonToArray(value: unknown): unknown[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === 'object') return [parsed];
      return [];
    } catch {
      return [];
    }
  }
  if (typeof value === 'object') return [value];
  return [];
}

export function jsonToRecord(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }
  if (typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
  return {};
}

export function toNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.\-]/g, '');
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

export function normalizeHeadcountByCountry(value: unknown): { country: string; count: number }[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((row) => {
        if (typeof row === 'string') return null;
        const r = row as Record<string, unknown>;
        const country = String(r.country ?? r.name ?? r.Country ?? r.location ?? 'Unknown');
        const count = toNumber(r.count ?? r.headcount ?? r.value ?? r.employees) ?? 0;
        return { country, count };
      })
      .filter((x): x is { country: string; count: number } => Boolean(x && x.count > 0));
  }

  const rec = jsonToRecord(value);
  return Object.entries(rec)
    .map(([country, count]) => ({ country, count: toNumber(count) ?? 0 }))
    .filter((x) => x.count > 0);
}

export function normalizeHeadcountByMonth(value: unknown): { month: string; count: number; sortKey: string }[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((row) => {
        if (typeof row === 'string') return null;
        const r = row as Record<string, unknown>;
        const raw = String(r.month ?? r.date ?? r.period ?? r.Month ?? '');
        const count = toNumber(r.count ?? r.headcount ?? r.value ?? r.employees) ?? 0;
        if (!raw || count <= 0) return null;
        return { month: formatDate(raw) || raw, count, sortKey: raw };
      })
      .filter((x): x is { month: string; count: number; sortKey: string } => Boolean(x));
  }

  const rec = jsonToRecord(value);
  return Object.entries(rec)
    .map(([raw, count]) => ({ month: formatDate(raw) || raw, count: toNumber(count) ?? 0, sortKey: raw }))
    .filter((x) => x.count > 0)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
}

export function normalizeFundingRounds(value: unknown): Array<{ round: string; amount: string; date: string; investors: string }> {
  const arr = jsonToArray(value);
  return arr
    .map((row) => {
      if (typeof row === 'string') return null;
      const r = row as Record<string, unknown>;
      const round = String(r.round ?? r['Round Type'] ?? r.round_type ?? r.type ?? r.stage ?? '—');
      const amount = String(r.amount ?? r.Amount ?? '—');
      const date = String(r.date ?? r.Date ?? r.announced ?? '—');
      const inv = r.investors ?? r.Investors;
      const investors = Array.isArray(inv) ? inv.map(String).join(', ') : (inv ? String(inv) : '—');
      return { round, amount, date, investors };
    })
    .filter((x): x is { round: string; amount: string; date: string; investors: string } => Boolean(x));
}

export function cleanLeadershipJsonString(raw: string): string {
  // Fix broken keys like "CEO Rating:" "83/100" (colon inside the key name)
  // Pattern: "Some Key:" "value" → "Some Key": "value"
  return raw
    .replace(/"([^"]+):"\s*"/g, '"$1": "')
    // Fix trailing commas before closing braces/brackets
    .replace(/,\s*([}\]])/g, '$1');
}

export function normalizeLeadership(value: unknown): { name?: string; title?: string; linkedin?: string; stats: Array<{ label: string; value: number }> } | null {
  if (!value) return null;

  let arr: unknown[] = [];
  if (typeof value === 'string') {
    const cleaned = cleanLeadershipJsonString(value);
    try {
      const parsed = JSON.parse(cleaned);
      arr = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return null;
    }
  } else {
    arr = jsonToArray(value);
  }

  const first = (arr[0] && typeof arr[0] === 'object') ? (arr[0] as Record<string, unknown>) : null;
  if (!first) return null;

  const name = String(first.name ?? first.Name ?? '').trim() || undefined;
  const title = String(first.title ?? first.Title ?? '').trim() || undefined;

  // CEO LinkedIn key variant
  const linkedinRaw = first['CEO LinkedIn'] ?? first.linkedin ?? first.LinkedIn ?? first['LinkedIn Profile'];
  const linkedin = linkedinRaw ? String(linkedinRaw).trim() : undefined;

  // Extract numeric scores from keys containing 'score', 'rating', or 'manager'
  const SCORE_LABEL_MAP: Record<string, string> = {
    'CEO Rating': 'CEO Rating',
    'Leadership Score': 'Leadership',
    'Manager Score': 'Manager',
    'Manager': 'Manager',
    'Executive Team Score': 'Exec Team',
  };

  const stats: Array<{ label: string; value: number }> = [];
  for (const [k, v] of Object.entries(first)) {
    if (!/score|rating|manager/i.test(k)) continue;
    if (/linkedin|url|http/i.test(k)) continue;
    const n = toNumber(v);
    if (n == null || n <= 0) continue;
    const label = SCORE_LABEL_MAP[k] ?? k.replace(/\s*(Score|Rating)$/i, '').trim();
    stats.push({ label, value: Math.max(0, Math.min(100, n)) });
  }

  return { name, title, linkedin, stats };
}

export function cleanCompetitorName(name: string): string {
  // Strip citation noise like [web:1][web:16][web:29] appended by AI scraping
  return name.replace(/(\[web:\d+\])+/g, '').trim();
}

export function formatFundingStage(raw: string | null | undefined): string {
  if (!raw) return '';
  // Convert snake_case like "post_ipo_equity", "series_a", "corporate_round" → readable
  return raw
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bIpo\b/g, 'IPO')
    .replace(/\bAi\b/g, 'AI');
}

export function isValidTicker(ticker: string | null | undefined): boolean {
  if (!ticker) return false;
  const t = ticker.trim();
  if (!t || t === '' || t === '-' || t === 'N/A') return false;
  // Patterns like "N/A (Private)", "N/A - Private", "Not Listed"
  if (/^n\/a/i.test(t) || /private/i.test(t) || /not listed/i.test(t)) return false;
  return true;
}

export function buildYoutubeSearchUrl(title: string, channel?: string): string {
  const q = encodeURIComponent(channel ? `${title} ${channel}` : title);
  return `https://www.youtube.com/results?search_query=${q}`;
}

export function buildRedditUrl(subreddit: string, title: string): string {
  // Link to subreddit search for the post title
  const sub = subreddit.replace(/^r\//, '');
  const q = encodeURIComponent(title);
  return `https://www.reddit.com/r/${sub}/search/?q=${q}&restrict_sr=1`;
}
