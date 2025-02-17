import { BASE_URL } from "$env/static/private";

export async function GET() {
  return new Response(
    `
		User-agent: *
		Disallow: 
		Sitemap: ${BASE_URL}/sitemap.xml
		`.trim(),
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
