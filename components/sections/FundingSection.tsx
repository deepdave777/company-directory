'use client';

import { FundingRound } from '@/lib/types';
import { formatNumber, formatDate, normalizeFundingRounds, formatFundingStage } from '@/lib/utils';

interface Props {
  numberOfRounds: number | null | undefined;
  currentStage: string | null | undefined;
  totalFunding: number | null | undefined;
  fundingRounds: FundingRound[];
}

export default function FundingSection({ numberOfRounds, currentStage, totalFunding, fundingRounds }: Props) {
  const hasData = numberOfRounds != null || currentStage || totalFunding != null || fundingRounds.length > 0;
  if (!hasData) return null;

  const normalized = normalizeFundingRounds(fundingRounds);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Funding</h2>
      </div>
      <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
        {/* Summary stats — inline row */}
        <div className="flex flex-wrap gap-8 mb-6 pb-5 border-b border-[#7d7373]">
          {numberOfRounds != null && (
            <div>
              <p className="text-2xl font-bold text-gray-900">{numberOfRounds}</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mt-0.5">Rounds</p>
            </div>
          )}
          {currentStage && (
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatFundingStage(currentStage)}</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mt-0.5">Current Stage</p>
            </div>
          )}
          {totalFunding != null && (
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalFunding)}</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mt-0.5">Total Funding</p>
            </div>
          )}
        </div>

        {/* Funding rounds — horizontally scrollable table */}
        {normalized.length > 0 && (
          <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
            <table className="min-w-[700px] w-full text-sm">
              <thead>
                <tr className="border-b border-[#7d7373]">
                  <th className="text-left py-3 pr-6 text-[10px] font-semibold text-gray-400 uppercase tracking-widest w-[180px]">Round</th>
                  <th className="text-left py-3 pr-6 text-[10px] font-semibold text-gray-400 uppercase tracking-widest w-[120px]">Amount</th>
                  <th className="text-left py-3 pr-6 text-[10px] font-semibold text-gray-400 uppercase tracking-widest w-[140px]">Date</th>
                  <th className="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Investors</th>
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
                    <tr key={i} className="border-b border-[#7d7373] hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3.5 pr-6">
                        <span className="inline-block whitespace-nowrap px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest bg-gray-50 text-gray-700 border border-[#7d7373] group-hover:border-[#ff4f12] group-hover:text-[#ff4f12] transition-colors">
                          {roundType}
                        </span>
                      </td>
                      <td className="py-3.5 pr-6 font-semibold text-gray-900 whitespace-nowrap">{displayAmount}</td>
                      <td className="py-3.5 pr-6 text-gray-500 whitespace-nowrap">{date !== '—' ? formatDate(String(date)) : '—'}</td>
                      <td className="py-3.5 text-gray-500">{investors}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
