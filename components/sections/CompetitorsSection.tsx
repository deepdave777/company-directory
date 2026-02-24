'use client';

import { Competitor } from '@/lib/types';
import { ensureHttps, cleanCompetitorName } from '@/lib/utils';
import { Crosshair } from '@phosphor-icons/react';

interface Props {
  competitors: Competitor[];
}

export default function CompetitorsSection({ competitors }: Props) {
  if (!competitors || competitors.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Crosshair className="w-5 h-5 text-[#ff4f12]" />
        <h2 className="text-lg font-semibold text-gray-900">Competitors</h2>
      </div>
      {/* Horizontal scroll carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {competitors.map((comp, i) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const rawName = typeof comp === 'string' ? comp : (comp.name || '');
          const compName = cleanCompetitorName(rawName);
          if (!compName) return null;
          const compUrl = typeof comp === 'string' ? null : (comp.website || comp.logo || null);
          return (
            <div
              key={i}
              className="flex-shrink-0 px-4 py-3 border border-gray-200 hover:border-[#ff4f12] hover:bg-[#fff8f6] transition-all cursor-pointer bg-white"
              onClick={() => compUrl && window.open(ensureHttps(compUrl), '_blank')}
            >
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{compName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
