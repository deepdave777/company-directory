import { supabase } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://floqer-company-directory.netlify.app';
const URLS_PER_SITEMAP = 50000;

export async function GET() {
  try {
    // Get total company count
    const { count } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });

    const total = count || 0;
    const totalSitemaps = Math.max(1, Math.ceil(total / URLS_PER_SITEMAP));

    // Generate sitemap index pointing to paginated sub-sitemaps
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap/0.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
${Array.from({ length: totalSitemaps }, (_, i) => `  <sitemap>
    <loc>${SITE_URL}/sitemap/${i + 1}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    // Fallback: minimal sitemap index with just the base pages
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap/0.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new Response(fallback, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}
