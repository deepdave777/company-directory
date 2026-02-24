import { supabase } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://floqer-company-directory.netlify.app';

export default async function sitemap() {
  const baseEntries = [
    { url: `${SITE_URL}/`, lastModified: new Date() },
  ];

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id, W2, "Last Updated"');

    if (error || !data) return baseEntries;

    const companyEntries = data.map((row) => {
      const nameSlug = encodeURIComponent((row.W2 || '').toLowerCase().replace(/\s+/g, '-'));
      const slug = row.id || nameSlug;
      const lastMod = row['Last Updated'] ? new Date(row['Last Updated']) : new Date();
      return {
        url: `${SITE_URL}/company/${slug}`,
        lastModified: lastMod,
      };
    });

    return [...baseEntries, ...companyEntries];
  } catch (e) {
    return baseEntries;
  }
}
