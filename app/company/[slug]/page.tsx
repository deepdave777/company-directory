import { Company } from '@/lib/types';
import { getCompanyBySlug } from '@/lib/data/companies';
import CompanyProfile from '@/components/CompanyProfile';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://floqer-company-directory.netlify.app';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  const canonical = `${siteUrl}/company/${slug}`;
  return {
    title: company ? `${company.W2} – Floqer Directory` : 'Company – Floqer Directory',
    description: company?.['Business Description'] || '',
    alternates: {
      canonical,
    },
    openGraph: {
      url: canonical,
      title: company ? `${company.W2} – Floqer Directory` : 'Company – Floqer Directory',
      description: company?.['Business Description'] || '',
      type: 'website',
    },
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
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
            <CompanyProfile company={company} />
          )}
        </div>
      </div>
    </div>
  );
}
