'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  technologies: string[];
}

const PAGE_SIZE = 20;

export default function TechnologiesSection({ technologies }: Props) {
  const [shown, setShown] = useState(PAGE_SIZE);

  if (!technologies || technologies.length === 0) return null;

  const visible = technologies.slice(0, shown);
  const remaining = technologies.length - shown;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Core Technologies</h2>
      </div>
      <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {visible.map((tech, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-[#7d7373] hover:border-[#ff4f12] hover:text-[#ff4f12] transition-colors"
            >
              {tech}
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
