import { languages } from '$lib/settings/settings.store.js';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const lang = params.lang;
  if (languages.find(l => l.value === lang)) {
    redirect(307, `${params.lang}/duas`);
  } else {
    // Language does not exist
    error(410);
  }
}
