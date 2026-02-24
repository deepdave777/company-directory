'use client';

import { LinkSimple } from '@phosphor-icons/react';
import { AffiliatedCompany } from '@/lib/types';
import { ensureHttps } from '@/lib/utils';

interface Props {
  companies: AffiliatedCompany[];
}

function cleanAffiliatedName(raw: string): string {
  // Strip header prefix like "Affiliated Organizations & Regional Branches: Remotasks"
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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <LinkSimple className="w-5 h-5 text-[#ff4f12]" />
        <h2 className="text-lg font-semibold text-gray-900">Affiliated Companies</h2>
      </div>
      <div className="space-y-2">
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
                  className="text-sm text-[#ff4f12] hover:underline font-medium"
                >
                  {compName}
                </a>
              ) : (
                <span className="text-sm text-[#ff4f12] font-medium">{compName}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
