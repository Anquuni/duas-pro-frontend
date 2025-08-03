// src/hooks.server.ts
import { nonTranslitLanguages } from '$lib/settings/settings.store';
import { sequence } from '@sveltejs/kit/hooks';
import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const languageRedirect: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  if (pathname.endsWith(".png") || pathname.endsWith(".svg") || pathname === "favicon.ico" || pathname === "/sitemap.xml" || pathname === "/robots.txt" || pathname === "/c8b81689dc7040adac7ee65a5f2e6cd3.txt") {
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

const supabase: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      /**
       * SvelteKit's cookies API requires `path` to be explicitly set in
       * the cookie options. Setting `path` to `/` replicates previous/
       * standard behavior.
       */
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' })
        })
      },
    },
  })
  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      return { session: null, user: null }
    }
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()
    if (error) {
      // JWT validation has failed
      return { session: null, user: null }
    }
    return { session, user }
  }
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}
const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user
  if (!event.locals.session && event.url.pathname.startsWith('/private')) {
    redirect(303, '/auth')
  }
  if (event.locals.session && event.url.pathname === '/auth') {
    redirect(303, '/private')
  }
  return resolve(event)
}


export const handle: Handle = sequence(languageRedirect, replaceLangInHtmlTag, supabase, authGuard)
