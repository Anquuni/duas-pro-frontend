import { supabase } from "$lib/supabase.config";
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const systemLang = params.lang?.toUpperCase();
  const languages = ["ar", "translit", systemLang && systemLang !== "ar" ? systemLang : "en"];
  const { data: response, error: errorResponse } = await supabase.functions.invoke(`duas?languages=ar,translit,${languages}&page=1&size=100`);
  if (errorResponse) {
    error(404);
  }

  return {
    duas: response.data,
  };
}
