import { PUBLIC_BASE_URL } from "$env/static/public";
import { nonTranslitLanguages } from "$lib/settings/settings.store";
import { supabase } from "$lib/supabase.config";
import { error } from "@sveltejs/kit";

export async function GET() {
  const pages = [
    { path: "", priority: 1.0 },
    { path: "duas", priority: 0.9 }
  ];

  const { data: response, error: fetchError } = await supabase.functions.invoke(`duas/routes`);
  if (fetchError) {
    error(500);
  }

  const duas: string[] = response.data.slugs;
  const defaultLang = "en";
  const languages = nonTranslitLanguages.map(l => l.value); // z.B. ["en", "de", "ar"]

  function buildHreflangBlock(path: string) {
    return languages.map(lang =>
      `<xhtml:link rel="alternate" hreflang="${lang}" href="${PUBLIC_BASE_URL}/${lang}/${path}" />`
    ).join("") +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${PUBLIC_BASE_URL}/${defaultLang}/${path}" />`;
  }

  function buildUrlEntries(path: string, priority: number) {
    return languages.map(lang => `
      <url>
        <loc>${PUBLIC_BASE_URL}/${lang}/${path}</loc>
        <priority>${priority}</priority>
        <changefreq>monthly</changefreq>
        ${buildHreflangBlock(path)}
      </url>
    `).join("");
  }

  function buildDuaEntries(duas: string[]) {
    return duas.flatMap(dua =>
      languages.map(lang => `
        <url>
          <loc>${PUBLIC_BASE_URL}/${lang}/duas/${dua}</loc>
          <priority>0.8</priority>
          <changefreq>monthly</changefreq>
          ${buildHreflangBlock(`duas/${dua}`)}
        </url>
      `)
    ).join("");
  }

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
      <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
      >
        ${pages.map(p => buildUrlEntries(p.path, p.priority)).join("")}
        ${buildDuaEntries(duas)}
      </urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
}
