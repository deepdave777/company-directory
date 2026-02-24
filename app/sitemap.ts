import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://floqer-company-directory.netlify.app';
const COMPANIES_PER_SITEMAP = 50000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base sitemap entries
  const baseEntries = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/company`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  try {
    // Get total company count
    const { count: totalCompanies } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });

    const total = totalCompanies || 0;
    
    // Add company URLs (limit to first 1000 for performance)
    const { data: companies } = await supabase
      .from('companies')
      .select('W2, "Last Updated"')
      .limit(1000)
      .order('W2', { ascending: true });

    const companyEntries = (companies || []).map((row) => {
      const nameSlug = encodeURIComponent((row.W2 || '').toLowerCase().replace(/\s+/g, '-'));
      const slug = nameSlug;
      const lastMod = row['Last Updated'] ? new Date(row['Last Updated']) : new Date();
      
      return {
        url: `${SITE_URL}/company/${slug}`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

    return [...baseEntries, ...companyEntries];

  } catch (e) {
    // Fallback to basic sitemap if there's an error
    return baseEntries;
  }
}
