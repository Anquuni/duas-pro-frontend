import { PUBLIC_BASE_URL } from "$env/static/public";

export async function GET() {
  return new Response(
    `
		User-agent: *
		Disallow: 
		Sitemap: ${PUBLIC_BASE_URL}/sitemap.xml
		`.trim(),
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
