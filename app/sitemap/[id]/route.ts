import { supabase } from '@/lib/supabase';
import { createSafeSlug } from '@/lib/slugUtils';
import { NextRequest } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://floqer-company-directory.netlify.app';
const URLS_PER_SITEMAP = 50000;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pageNum = parseInt(id, 10);

  // Page 0 = static pages (homepage, etc.)
  if (pageNum === 0) {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }

  // Pages 1+ = company URLs (paginated, 50K per page)
  try {
    const offset = (pageNum - 1) * URLS_PER_SITEMAP;

    const { data: companies, error } = await supabase
      .from('companies')
      .select('W2')
      .order('W2', { ascending: true })
      .range(offset, offset + URLS_PER_SITEMAP - 1);

    if (error || !companies || companies.length === 0) {
      return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
        headers: { 'Content-Type': 'application/xml' },
      });
    }

    const urls = companies
      .filter((c) => c.W2)
      .map(
        (c) => `  <url>
    <loc>${SITE_URL}/company/${createSafeSlug(c.W2)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
