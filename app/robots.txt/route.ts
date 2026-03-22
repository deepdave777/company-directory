const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://floqer-company-directory.netlify.app';

export async function GET() {
  const robotsTxt = `# Floqer Company Directory
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
