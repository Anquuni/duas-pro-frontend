import { PUBLIC_BASE_URL } from "$env/static/public";

export async function GET() {
  const lines = [
    "User-agent: *",
    "Disallow:",
    `Sitemap: ${PUBLIC_BASE_URL}/sitemap.xml`
  ];
  return new Response(lines.join("\n"), {
    headers: { 'Content-Type': 'text/plain' }
  });
}
