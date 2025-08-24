import { supabase } from "$lib/supabase.config";
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const systemLang = params.lang?.toLowerCase();
  const languages = ["ar", "translit", systemLang && systemLang !== "ar" ? systemLang : "en"];

  let requestUrl = `duas?languages=${languages}&collections=${params.slug}`;

  const { data: response, error: errorResponse } = await supabase.functions.invoke(requestUrl);
  if (errorResponse) {
    console.error(`Error while fetching all duas from ${requestUrl}: ${errorResponse}`)
    error(404);
  }

  const collection = response.data.length > 0 ? response.data[0].collections.find((c: any) => c.slug === params.slug) : null;

  return {
    duas: response.data,
    collection
  };
}
