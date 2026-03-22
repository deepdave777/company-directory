'use client';

import { useState } from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { NewsItem } from '@/lib/types';
import { formatDate, ensureHttps } from '@/lib/utils';

interface Props {
  news: NewsItem[];
  aiSummary?: string | null;
}

export default function LatestNewsSection({ news, aiSummary }: Props) {
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(aiSummary || null);

  if (!news || news.length === 0) return null;

  const sorted = [...news]
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    })
    .slice(0, 10);

  const handleGenerateSummary = async () => {
    if (generatedSummary) {
      setAiOpen(!aiOpen);
      return;
    }
    
    try {
      setLoading(true);
      setAiOpen(true);
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'news',
          titles: sorted.map(n => n.title)
        })
      });
      const data = await res.json();
      if (data.summary) {
        setGeneratedSummary(data.summary);
      } else {
        setGeneratedSummary('Failed to generate summary.');
      }
    } catch (e) {
      console.error(e);
      setGeneratedSummary('An error occurred while generating summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Latest News</h2>
      </div>
      <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
        <div className="mb-5 border-b border-[#7d7373] pb-5">
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="flex items-center gap-2 w-full bg-[#fff8f6] border border-[#ffd5c2] px-4 py-3 hover:bg-[#fff1ec] transition-colors disabled:opacity-70"
          >
            <div className="w-5 h-5 bg-[#ff4f12] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold leading-none">AI</span>
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-700">
              {loading ? 'Generating Summary...' : 'Generate Summary'}
            </span>
            <ChevronDown strokeWidth={2} className={`w-4 h-4 text-[#ff4f12] ml-auto transition-transform ${(aiOpen || loading) ? 'rotate-180' : ''}`} />
          </button>
          
          {(aiOpen || loading) && (
            <div className="border border-t-0 border-[#ffd5c2] p-5 bg-white">
              {loading ? (
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <div className="w-4 h-4 rounded-full border-2 border-[#ff4f12] border-t-transparent animate-spin"></div>
                  Reading articles and generating...
                </div>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed max-h-[60px] line-clamp-3">
                  {generatedSummary}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="divide-y divide-[#7d7373]">
          {sorted.map((item, i) => {
            const Wrapper: React.ElementType = item.url ? 'a' : 'div';
            const props = item.url
              ? { href: ensureHttps(item.url), target: '_blank', rel: 'noopener noreferrer' }
              : {};
            return (
              <Wrapper
                key={i}
                {...props}
                className="flex items-start justify-between gap-4 py-3.5 hover:bg-gray-50/50 px-2 -mx-2 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-[#ff4f12] transition-colors leading-relaxed">
                    {item.title}
                  </p>
                  {item.date && (
                    <p className="text-[10px] font-medium tracking-wide text-gray-400 mt-1.5">{formatDate(item.date)}</p>
                  )}
                </div>
                {item.url && (
                  <ExternalLink strokeWidth={1.5} className="w-3.5 h-3.5 text-[#ff4f12] opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0" />
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}
