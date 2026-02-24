'use client';

import { useState } from 'react';
import { Newspaper, ArrowSquareOut, CaretDown } from '@phosphor-icons/react';
import { NewsItem } from '@/lib/types';
import { formatDate, ensureHttps } from '@/lib/utils';

interface Props {
  news: NewsItem[];
  aiSummary?: string | null;
}

export default function LatestNewsSection({ news, aiSummary }: Props) {
  const [aiOpen, setAiOpen] = useState(false);
  if (!news || news.length === 0) return null;

  const sorted = [...news]
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    })
    .slice(0, 10);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5 text-[#ff4f12]" />
        <h2 className="text-lg font-semibold text-gray-900">Latest News</h2>
      </div>
      {aiSummary && (
        <div className="mb-5">
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="flex items-center gap-2 w-full bg-[#fff8f6] border border-[#ffd5c2] px-4 py-3 hover:bg-[#fff1ec] transition-colors"
          >
            <div className="w-5 h-5 bg-[#ff4f12] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold leading-none">AI</span>
            </div>
            <span className="text-sm font-medium text-gray-700">AI Summary</span>
            <CaretDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${aiOpen ? 'rotate-180' : ''}`} />
          </button>
          {aiOpen && (
            <div className="border border-t-0 border-[#ffd5c2] p-4 bg-white">
              <p className="text-sm text-gray-700 leading-relaxed">{aiSummary}</p>
            </div>
          )}
        </div>
      )}
      <div className="space-y-2">
        {sorted.map((item, i) => {
          const Wrapper: React.ElementType = item.url ? 'a' : 'div';
          const props = item.url
            ? {
                href: ensureHttps(item.url),
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            : {};
          return (
            <Wrapper
              key={i}
              {...props}
              className="flex items-start justify-between gap-3 p-3 border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group bg-white"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-[#ff4f12] transition-colors leading-snug">
                  {item.title}
                </p>
                {item.date && (
                  <p className="text-xs text-gray-400 mt-1">{formatDate(item.date)}</p>
                )}
              </div>
              {item.url && (
                <ArrowSquareOut className="w-4 h-4 text-gray-400 group-hover:text-[#ff4f12] transition-colors mt-0.5 flex-shrink-0" />
              )}
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
