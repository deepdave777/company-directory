import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://floqer-company-directory.netlify.app';
const COMPANIES_PER_SITEMAP = 50000;

export async function GET() {
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
    const totalPages = Math.ceil(total / COMPANIES_PER_SITEMAP);

    // Create sitemap index entries
    const sitemapIndexEntries = [];
    
    for (let i = 1; i <= totalPages; i++) {
      sitemapIndexEntries.push({
        url: `${SITE_URL}/sitemap/${i}.xml`,
        lastModified: new Date(),
      });
    }

    // Generate sitemap index XML
    const sitemapEntries = [
      ...baseEntries.map(entry => `
    <url>
      <loc>${entry.url}</loc>
      <lastmod>${entry.lastModified.toISOString()}</lastmod>
      <changefreq>${entry.changeFrequency}</changefreq>
      <priority>${entry.priority}</priority>
    </url>`),
      ...sitemapIndexEntries.map(entry => `
    <sitemap>
      <loc>${entry.url}</loc>
      <lastmod>${entry.lastModified.toISOString()}</lastmod>
    </sitemap>`),
    ].join('');

    const sitemap = total > COMPANIES_PER_SITEMAP 
      ? `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`
      : `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (e) {
    // Fallback to basic sitemap if there's an error
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${baseEntries.map(entry => `
    <url>
      <loc>${entry.url}</loc>
      <lastmod>${entry.lastModified.toISOString()}</lastmod>
      <changefreq>${entry.changeFrequency}</changefreq>
      <priority>${entry.priority}</priority>
    </url>`).join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}
