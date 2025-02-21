// src/hooks.server.ts
import { nonTranslitLanguages } from '$lib/settings/settings.store';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

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
      .map(lang => lang.split(';')[0].trim())  // e.g., "de-DE" or "en-US"
      .map(lang => lang.split('-')[0]);         // e.g., "de" or "en"

    // Find the first language that is present in the supportedLanguages list
    const foundLang = languagesFromHeader.find(lang => supportedLanguages.includes(lang));
    if (foundLang) {
      language = foundLang;
    }
  }

  // Redirect to the URL with the appropriate language prefix
  const redirectUrl = new URL(`/${language}${pathname}`, event.url);
  return Response.redirect(redirectUrl, 302);
};
