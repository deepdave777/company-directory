'use client';

import { Competitor } from '@/lib/types';
import { ensureHttps, cleanCompetitorName } from '@/lib/utils';

interface Props {
  competitors: Competitor[];
}

export default function CompetitorsSection({ competitors }: Props) {
  if (!competitors || competitors.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Competitors</h2>
      </div>
      <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {competitors.map((comp, i) => {
            const rawName = typeof comp === 'string' ? comp : (comp.name || '');
            const compName = cleanCompetitorName(rawName);
            if (!compName) return null;
            const compUrl = typeof comp === 'string' ? null : (comp.website || comp.logo || null);
            return (
              <div
                key={i}
                className="flex-shrink-0 px-4 py-2.5 border border-[#7d7373] hover:border-[#ff4f12] hover:bg-[#fff8f6] transition-all duration-300 cursor-pointer bg-gray-50"
                onClick={() => compUrl && window.open(ensureHttps(compUrl), '_blank')}
              >
                <span className="text-xs font-semibold tracking-wide uppercase text-gray-700 whitespace-nowrap">{compName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
