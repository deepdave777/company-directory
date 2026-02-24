'use client';

import { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Core Technologies</h2>
      <div className="flex flex-wrap gap-2">
        {visible.map((tech, i) => (
          <span
            key={i}
            className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
      {remaining > 0 && (
        <button
          onClick={() => setShown(s => s + PAGE_SIZE)}
          className="mt-4 flex items-center gap-1 text-sm text-[#ff4f12] font-medium hover:underline"
        >
          <CaretDown className="w-4 h-4" />
          View More ({remaining} remaining)
        </button>
      )}
      {shown > PAGE_SIZE && (
        <button
          onClick={() => setShown(PAGE_SIZE)}
          className="mt-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <CaretUp className="w-4 h-4" />
          Show less
        </button>
      )}
    </div>
  );
}
