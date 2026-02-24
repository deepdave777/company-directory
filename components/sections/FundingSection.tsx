'use client';

import { CurrencyDollar } from '@phosphor-icons/react';
import { FundingRound } from '@/lib/types';
import { formatNumber, formatDate, normalizeFundingRounds } from '@/lib/utils';

interface Props {
  numberOfRounds: number | null | undefined;
  currentStage: string | null | undefined;
  totalFunding: number | null | undefined;
  fundingRounds: FundingRound[];
}

function getField(obj: FundingRound, keys: string[]): string {
  for (const key of keys) {
    const val = (obj as Record<string, unknown>)[key];
    if (val != null && val !== '') return String(val);
  }
  return '—';
}

function formatInvestors(investors: string | string[] | undefined | null): string {
  if (!investors) return '—';
  if (Array.isArray(investors)) return investors.join(', ') || '—';
  return String(investors);
}

export default function FundingSection({ numberOfRounds, currentStage, totalFunding, fundingRounds }: Props) {
  const hasData = numberOfRounds != null || currentStage || totalFunding != null || fundingRounds.length > 0;
  if (!hasData) return null;

  const normalized = normalizeFundingRounds(fundingRounds);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <CurrencyDollar className="w-5 h-5 text-[#ff4f12]" />
        <h2 className="text-lg font-semibold text-gray-900">Funding</h2>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {numberOfRounds != null && (
          <div className="text-center p-4 border border-gray-100 bg-gray-50">
            <p className="text-3xl font-bold text-gray-900">{numberOfRounds}</p>
            <p className="text-xs text-gray-500 mt-1">Funding Rounds</p>
          </div>
        )}
        {currentStage && (
          <div className="text-center p-4 border border-gray-100 bg-gray-50">
            <p className="text-2xl font-bold text-[#ff4f12]">{currentStage}</p>
            <p className="text-xs text-gray-500 mt-1">Current Round</p>
          </div>
        )}
        {totalFunding != null && (
          <div className="text-center p-4 border border-gray-100 bg-gray-50">
            <p className="text-2xl font-bold text-gray-900">{formatNumber(totalFunding)}</p>
            <p className="text-xs text-gray-500 mt-1">Total Funding</p>
          </div>
        )}
      </div>

      {/* Funding rounds table */}
      {normalized.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Round</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Investors</th>
              </tr>
            </thead>
            <tbody>
              {normalized.map((round, i) => {
                const roundType = round.round || '—';
                const amount = round.amount || '—';
                const date = round.date || '—';
                const investors = round.investors || '—';

                const amountNum = parseFloat(String(amount).replace(/[^0-9.]/g, ''));
                const displayAmount = !isNaN(amountNum) && amountNum > 0 ? formatNumber(amountNum) : String(amount);

                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors">
                        {roundType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-900">{displayAmount}</td>
                    <td className="py-3 px-3 text-gray-500">{date !== '—' ? formatDate(String(date)) : '—'}</td>
                    <td className="py-3 px-3 text-gray-600 max-w-xs truncate" title={investors}>{investors}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
