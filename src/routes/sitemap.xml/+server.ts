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
  const duas: string[] = response.data.route_names;
  const defaultLang = "en";
  const alternativeLangs = nonTranslitLanguages.map(l => l.value).filter(l => l !== defaultLang);

  return new Response(
    `
		<?xml version="1.0" encoding="UTF-8"?>
		<urlset
			xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="http://www.w3.org/1999/xhtml"
		>

    ${pages.map(({ path, priority }) => `
      <url>
        <loc>${PUBLIC_BASE_URL}/${defaultLang}/${path}</loc>
        <priority>${priority}</priority>
        <changefreq>monthly</changefreq>
        ${alternativeLangs.map(otherLang => `
          <xhtml:link rel="alternate" hreflang="${otherLang}" href="${PUBLIC_BASE_URL}/${otherLang}/${path}" />
        `).join("")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${PUBLIC_BASE_URL}/${defaultLang}/${path}" />
      </url>
    `).join("")}

    ${duas.map(dua => `
        <url>
          <loc>${PUBLIC_BASE_URL}/${defaultLang}/duas/${dua}</loc>
          <priority>0.8</priority>
          <changefreq>monthly</changefreq>
          ${alternativeLangs.map(otherLang => `
            <xhtml:link rel="alternate" hreflang="${otherLang}" href="${PUBLIC_BASE_URL}/${otherLang}/duas/${dua}" />
          `).join("")}
          <xhtml:link rel="alternate" hreflang="x-default" href="${PUBLIC_BASE_URL}/${defaultLang}/duas/${dua}" />
        </url>
    `).join("")}
		</urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
}