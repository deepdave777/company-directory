'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users } from 'lucide-react';
import { Company } from '@/lib/types';
import { formatFundingStage } from '@/lib/utils';
import { createSafeSlug } from '@/lib/slugUtils';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const name = company.W2 || 'Unknown Company';
  const industry = company['Company Industry'] || '';
  const hq = company.HQ || '';
  const employeeRange = company['Employee Range'] || '';
  const currentStage = formatFundingStage(company['Current Funding Stage']);
  const stage = currentStage || '';
  const type = company['Public or Private Company Type'] || '';
  const revenue = company['Revenue Range'] || '';
  const logo = company['Company Logo URL'];

  const slug = createSafeSlug(name);

  return (
    <Link href={`/company/${slug}`} className="block h-full focus:outline-none focus:ring-2 focus:ring-[#ff4f12]/20">
      <div className="bg-white border border-[#7d7373] p-5 hover:border-gray-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer group h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center border border-[#7d7373]">
            {logo ? (
              <Image
                src={logo}
                alt={name}
                width={40}
                height={40}
                className="w-full h-full object-contain p-1"
                unoptimized
              />
            ) : (
              <span className="text-gray-400 font-medium text-sm">{name.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-[15px] group-hover:text-[#ff4f12] transition-colors truncate leading-snug">
              {name}
            </h3>
            <p className="text-xs text-gray-400 truncate mt-0.5">{industry}</p>
          </div>
        </div>

        <div className="flex-1" />

        {/* Meta row */}
        <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-3 pt-3 border-t border-[#7d7373/60]">
          {hq && (
            <span className="flex items-center gap-1">
              <MapPin strokeWidth={1.5} className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{hq}</span>
            </span>
          )}
          {employeeRange && (
            <span className="flex items-center gap-1">
              <Users strokeWidth={1.5} className="w-3 h-3" />
              {employeeRange}
            </span>
          )}
        </div>

        {/* Tags — clean, no dot decorators */}
        <div className="flex flex-wrap gap-1.5 text-[10px] font-medium tracking-wide uppercase text-gray-500">
          {stage && (
            <span className="px-2 py-0.5 bg-[#fff1ec] text-[#ff4f12] border border-[#ffd5c2]/60">
              {stage}
            </span>
          )}
          {type && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-500 border border-[#7d7373]">
              {type}
            </span>
          )}
          {revenue && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-500 border border-[#7d7373]">
              {revenue}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
