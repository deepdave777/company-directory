'use client';

import { useState } from 'react';
import { Plus, Minus, ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ } from '@/lib/types';

interface Props {
  faqs: FAQ[];
}

export default function FAQsSection({ faqs }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">FAQs</h2>
      </div>
      <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
        <div className="divide-y divide-gray-50">
          {faqs.map((faq, i) => {
            const question = faq.question || (faq as Record<string, unknown>).q as string || '';
            const answer = faq.answer || (faq as Record<string, unknown>).a as string || '';
            if (!question) return null;
            return (
            <div key={i} className="py-3 first:pt-0 last:pb-0">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex items-start justify-between gap-3 w-full text-left group"
              >
                <span className="text-sm font-medium text-gray-900 group-hover:text-[#ff4f12] transition-colors leading-relaxed">
                  {question}
                </span>
                {openIdx === i ? (
                  <Minus strokeWidth={2} className="w-4 h-4 text-[#ff4f12] flex-shrink-0 mt-0.5" />
                ) : (
                  <Plus strokeWidth={2} className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
              </button>
              {openIdx === i && answer && (
                <p className="text-sm text-gray-600 leading-relaxed mt-2 pl-0">
                  {answer}
                </p>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
