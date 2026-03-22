'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  focusAreas: string[];
}

const PAGE_SIZE = 20;

function cleanFocusAreas(areas: string[]): string[] {
  return areas
    .map((a) => {
      const colonIdx = a.indexOf(':');
      if (colonIdx > 0 && colonIdx < 60) {
        const afterColon = a.slice(colonIdx + 1).trim();
        if (afterColon) return afterColon;
      }
      return a.trim();
    })
    .filter((a) => a.length > 0 && a.length < 120);
}

export default function KeyFocusAreasSection({ focusAreas }: Props) {
  const [shown, setShown] = useState(PAGE_SIZE);

  const cleaned = cleanFocusAreas(focusAreas || []);
  if (cleaned.length === 0) return null;

  const visible = cleaned.slice(0, shown);
  const remaining = cleaned.length - shown;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Key Focus Areas</h2>
      </div>
      <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {visible.map((area, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-[#7d7373] hover:border-[#ffba00] hover:text-[#ffba00] transition-colors"
            >
              {area}
            </span>
          ))}
        </div>
        {remaining > 0 && (
          <button
            onClick={() => setShown(s => s + PAGE_SIZE)}
            className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#ff4f12] hover:text-gray-900 transition-colors"
          >
            <ChevronDown strokeWidth={2} className="w-3.5 h-3.5" />
            View more ({remaining} remaining)
          </button>
        )}
        {shown > PAGE_SIZE && (
          <button
            onClick={() => setShown(PAGE_SIZE)}
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ChevronUp strokeWidth={2} className="w-3.5 h-3.5" />
            Show less
          </button>
        )}
      </div>
    </div>
  );
}
