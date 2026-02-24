'use client';

import { Company } from '@/lib/types';
import CompanyCard from './CompanyCard';

interface VirtualCompanyGridProps {
  companies: Company[];
  height?: number;
}

const ITEM_SIZE = 240; // Height of each company card row

const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: Company[] }) => {
  const companies = data;
  const company = companies[index];
  
  if (!company) return null;
  
  return (
    <div style={style}>
      <div className="px-16">
        <CompanyCard company={company} />
      </div>
    </div>
  );
};

export default function VirtualCompanyGrid({ companies, height = 600 }: VirtualCompanyGridProps) {
  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-gray-500 font-medium">No companies found</p>
      </div>
    );
  }

  // For now, use regular grid until we fix react-window import
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-16">
      {companies.map((company) => (
        <CompanyCard key={company.W2} company={company} />
      ))}
    </div>
  );
}
