import { supabase } from "$lib/supabase.config";
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const systemLang = params.lang?.toLowerCase();
  const languages = ["ar", "translit", systemLang && systemLang !== "ar" ? systemLang : "en"];

  let requestUrl = `collections?languages=${languages}`;
  const { data: response, error: errorResponse } = await supabase.functions.invoke(requestUrl);
  if (errorResponse) {
    console.error(`Error while fetching all collections from ${requestUrl}: ${errorResponse}`)
    error(404);
  }

  return {
    collections: response.data,
  };
}
