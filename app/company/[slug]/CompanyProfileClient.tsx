'use client';

import { Company } from '@/lib/types';
import { getCompanyBySlug } from '@/lib/data/companies';
import CompanyProfile from '@/components/CompanyProfile';
import LayoutWrapper from '@/components/LayoutWrapper';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';

interface Props {
  slug: string;
  initialCompany?: Company | null;
}

export default function CompanyProfileClient({ slug, initialCompany }: Props) {
  const [mounted, setMounted] = useState(false);
  const [company, setCompany] = useState<Company | null>(initialCompany || null);
  const [loading, setLoading] = useState(!initialCompany);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCompany) {
      setMounted(true);
      return;
    }

    async function fetchCompany() {
      try {
        setError(null);
        console.log('Fetching company with slug:', slug);
        const companyData = await getCompanyBySlug(slug);
        console.log('Company data:', companyData);
        setCompany(companyData);
      } catch (err) {
        console.error('Error fetching company:', err);
        setError('Failed to load company');
      } finally {
        setLoading(false);
        setMounted(true);
      }
    }
    fetchCompany();
  }, [slug, initialCompany]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 border-2 border-[#ff4f12] border-t-transparent animate-spin" />
        <p className="text-sm text-gray-500">Loading company...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-red-500 font-medium">Error</p>
        <p className="text-sm text-gray-500">{error}</p>
        <Link href="/" className="text-sm text-[#ff4f12] hover:underline mt-2">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="pt-14">
          <div className="max-w-7xl mx-auto px-16 py-6">
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
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
