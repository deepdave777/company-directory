import { Company } from '@/lib/types';
import { parseJsonField } from '@/lib/utils';
import { ensureHttps } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://floqer-company-directory.netlify.app';

interface Props {
  company: Company;
  slug: string;
}

export default function CompanyJsonLd({ company, slug }: Props) {
  const name = company.W2 || 'Unknown';
  const description = company['Business Description'] || '';
  const logo = company['Company Logo URL'] || '';
  const website = company.Website ? ensureHttps(company.Website) : '';
  const foundingYear = company['Founding Year'];
  const address = company['Company Address'];
  const hq = company.HQ;
  const industry = company['Company Industry'];
  const faqs = parseJsonField<{ question?: string; q?: string; answer?: string; a?: string }>(company.FAQs);

  const pageUrl = `${SITE_URL}/company/${slug}`;

  // Organization schema
  const sameAsUrls = [website, company['LinkedIn Company Page URL']].filter(Boolean) as string[];

  const organizationSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: website || pageUrl,
    ...(sameAsUrls.length > 0 && { sameAs: sameAsUrls }),
    ...(logo && { logo }),
    ...(description && { description }),
    ...(foundingYear && { foundingDate: String(foundingYear) }),
    ...(industry && { industry }),
    // CEO as a founder or employee
    ...(company['CEO Name'] && {
      founder: {
        '@type': 'Person',
        name: company['CEO Name'],
        ...(company['CEO LinkedIn'] && { sameAs: ensureHttps(company['CEO LinkedIn']) })
      }
    }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
      },
    }),
    ...(hq && {
      location: {
        '@type': 'Place',
        name: hq,
      },
    }),
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: pageUrl,
      },
    ],
  };

  // FAQPage schema (only if FAQs exist)
  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs
            .filter((f) => (f.question || f.q) && (f.answer || f.a))
            .map((f) => ({
              '@type': 'Question',
              name: f.question || f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer || f.a,
              },
            })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
