'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users } from '@phosphor-icons/react';
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

  // Use SEO-friendly name-based slug
  const slug = createSafeSlug(name);

  return (
    <Link href={`/company/${slug}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#ff4f12] hover:shadow-md transition-all duration-200 cursor-pointer group h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
            {logo ? (
              <Image
                src={logo}
                alt={name}
                width={48}
                height={48}
                className="w-full h-full object-contain"
                unoptimized
              />
            ) : (
              <span className="text-gray-400 font-bold text-lg">
                {name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-[#ff4f12] transition-colors truncate">
              {name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{industry}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          {hq && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {hq}
            </span>
          )}
          {employeeRange && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {employeeRange}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {stage && (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ff4f12] text-white">
              {stage}
            </span>
          )}
          {type && (
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              {type}
            </span>
          )}
          {revenue && (
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              {revenue}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
