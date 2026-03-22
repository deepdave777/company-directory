'use client';

import { Link } from 'lucide-react';
import { AffiliatedCompany } from '@/lib/types';
import { ensureHttps } from '@/lib/utils';

interface Props {
  companies: AffiliatedCompany[];
}

function cleanAffiliatedName(raw: string): string {
  const colonIdx = raw.indexOf(':');
  if (colonIdx > 0 && colonIdx < 80) {
    const after = raw.slice(colonIdx + 1).trim();
    if (after) return after;
  }
  return raw.trim();
}

export default function AffiliatedCompaniesSection({ companies }: Props) {
  if (!companies || companies.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Affiliated Companies</h2>
      </div>
      <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
        <div className="flex flex-wrap gap-2.5">
          {companies.map((comp, i) => {
            const rawName = typeof comp === 'string' ? comp : (comp.name || '');
            const compName = cleanAffiliatedName(rawName);
            if (!compName) return null;
            const compUrl = typeof comp === 'string' ? null : (comp.url || comp.website || null);
            return (
              <div key={i}>
                {compUrl ? (
                  <a
                    href={ensureHttps(compUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-[#7d7373] hover:border-[#ff4f12] hover:text-[#ff4f12] transition-colors"
                  >
                    {compName}
                  </a>
                ) : (
                  <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-[#7d7373]">
                    {compName}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
