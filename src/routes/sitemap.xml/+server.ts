import { PUBLIC_BASE_URL } from "$env/static/public";
import { languages } from "$lib/settings/settings.store";
import { supabase } from "$lib/supabase.config";
import { error } from "@sveltejs/kit";

export async function GET() {
  const { data: response, error: fetchError } = await supabase.functions.invoke(`duas/routes`);
  if (fetchError) {
    error(500);
  }
  const duas: string[] = response.data.route_names;
  const defaultLang = "en";
  return new Response(
    `
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
		>
    ${duas.map(dua => `
      ${languages.map(lang => lang.value).map(lang => `
        <url>
          <loc>${PUBLIC_BASE_URL}/${lang}/${dua}</loc>
          ${languages.map(lang => lang.value).map(otherLang => `
            <xhtml:link rel="alternate" hreflang="${otherLang}" href="${PUBLIC_BASE_URL}/${otherLang}/duas/${dua}" />
          `).join("")}
          <xhtml:link rel="alternate" hreflang="x-default" href="${PUBLIC_BASE_URL}/${defaultLang}/duas/${dua}" />
        </url>
      `).join("")}
    `).join("")}
		</urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
}