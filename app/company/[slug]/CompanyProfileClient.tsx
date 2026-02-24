'use client';

import { Company } from '@/lib/types';
import { getCompanyBySlug } from '@/lib/data/companies';
import CompanyProfile from '@/components/CompanyProfile';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';

interface Props {
  slug: string;
}

export default function CompanyProfileClient({ slug }: Props) {
  const [mounted, setMounted] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      const companyData = await getCompanyBySlug(slug);
      setCompany(companyData);
      setLoading(false);
      setMounted(true);
    }
    fetchCompany();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 border-2 border-[#ff4f12] border-t-transparent animate-spin" />
        <p className="text-sm text-gray-500">Loading company...</p>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/"
        className={`inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mt-8 mb-6 ${
          mounted ? 'slide-in-left' : 'opacity-0'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </Link>

      {!company ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-gray-700 font-medium text-lg">Company not found</p>
          <p className="text-sm text-gray-500">We couldn&apos;t find a company matching &quot;{decodeURIComponent(slug)}&quot;</p>
          <Link href="/" className="text-sm text-[#ff4f12] hover:underline mt-2">
            Back to Directory
          </Link>
        </div>
      ) : (
        <div className={mounted ? 'fade-in' : 'opacity-0'}>
          <CompanyProfile company={company} />
        </div>
      )}
    </>
  );
}
