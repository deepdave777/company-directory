'use client';

import { useState } from 'react';
import { Plus, Minus, CaretDown, Question } from '@phosphor-icons/react';
import { FAQ } from '@/lib/types';

interface Props {
  faqs: FAQ[];
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);
  const question = faq.question || (faq as Record<string, string>)['q'] || `Question ${index + 1}`;
  const answer = faq.answer || (faq as Record<string, string>)['a'] || '';

  return (
    <div className="border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900 pr-4">{question}</span>
        <CaretDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQsSection({ faqs }: Props) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Question className="w-5 h-5 text-[#ff4f12]" />
        <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} index={i} />
        ))}
      </div>
    </div>
  );
}
