import { Company } from '@/lib/types';
import { getCompanyBySlug } from '@/lib/data/companies';
import CompanyProfileClient from './CompanyProfileClient';
import LayoutWrapper from '@/components/LayoutWrapper';
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

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="pt-14">
          <div className="max-w-7xl mx-auto px-16 py-6">
            <CompanyProfileClient slug={slug} />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
