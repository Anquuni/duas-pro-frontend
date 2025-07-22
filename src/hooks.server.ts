// src/hooks.server.ts
import { nonTranslitLanguages } from '$lib/settings/settings.store';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const languageRedirect: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  if (pathname.endsWith(".png") || pathname.endsWith(".svg") || pathname === "favicon.ico" || pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return resolve(event);
  }

  const supportedLanguages = nonTranslitLanguages.map(l => l.value);

  // Create a dynamic regex from the list of supported languages
  const langRegex = new RegExp(`^\\/(${supportedLanguages.join('|')})(\\/|$)`);

  // If a language prefix is already present in the URL, continue processing without redirecting
  if (pathname.match(langRegex)) {
    return resolve(event);
  }

  // Retrieve the Accept-Language header from the request
  const acceptLanguage = event.request.headers.get('accept-language');
  let language = 'en'; // Default fallback language

  if (acceptLanguage) {
    // Split the header into individual language codes, remove quality values, and extract the primary language code
    const languagesFromHeader = acceptLanguage.split(',')
      .map(lang => lang.split(';')[0].trim())   // e.g., "de-DE" or "en-US"
      .map(lang => lang.split('-')[0]);         // e.g., "de" or "en"

    // Find the first language that is present in the supportedLanguages list
    const foundLang = languagesFromHeader.find(lang => supportedLanguages.includes(lang));
    if (foundLang) {
      language = foundLang;
    }
  }

  // Redirect to the URL with the appropriate language prefix
  const redirectUrl = new URL(`/${language}${pathname}${event.url.search}`, event.url);
  return Response.redirect(redirectUrl, 301);
};

export const replaceLangInHtmlTag: Handle = async ({ event, resolve }) => {
  const supportedLanguages = nonTranslitLanguages.map(l => l.value);
  const pathname = event.url.pathname;

  // Dynamisch Sprache aus der URL extrahieren
  const langMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const lang = langMatch && supportedLanguages.includes(langMatch[1]) ? langMatch[1] : 'en';

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang)
  });
};

export const handle: Handle = sequence(languageRedirect, replaceLangInHtmlTag)
