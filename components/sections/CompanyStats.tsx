'use client';

import { Company } from '@/lib/types';
import { formatFundingStage } from '@/lib/utils';

interface Props {
  company: Company;
}

export default function CompanyStats({ company }: Props) {
  const stats = [
    { 
      label: 'Employees', 
      value: company['Employee Range'] || 'N/A', 
      sub: company['Employee Headcount'] ? `${company['Employee Headcount'].toLocaleString()} Total` : 'Est. Range' 
    },
    { 
      label: 'Revenue', 
      value: company['Revenue Range'] || 'N/A', 
      sub: 'Annual Estimated' 
    },
    { 
      label: 'Company Stage', 
      value: formatFundingStage(company['Current Funding Stage']) || company['Public or Private Company Type'] || 'N/A', 
      sub: 'Current Status' 
    },
    { 
      label: 'Headquarters', 
      value: company.HQ || 'N/A', 
      sub: company['Company Address'] ? 'Global HQ' : '' 
    },
  ];

  return (
    <div className="border-b border-[#7d7373] bg-white py-8 shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#7d7373]">
        {stats.map((stat, idx) => (
          <div key={idx} className="px-6 py-4 lg:py-0 first:pl-0 last:pr-0 flex flex-col justify-start group">
            <div className="text-4xl lg:text-5xl font-normal text-gray-900 mb-2 truncate leading-none tracking-tight font-display group-hover:text-[#ff4f12] transition-colors">
              {stat.value}
            </div>
            <div className="text-xs font-bold tracking-widest text-gray-900 uppercase">
              {stat.label}
            </div>
            {stat.sub && (
              <div className="text-xs text-gray-500 mt-1">
                {stat.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
