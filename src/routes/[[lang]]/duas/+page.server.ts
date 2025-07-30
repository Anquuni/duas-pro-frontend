import { supabase } from "$lib/supabase.config";
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '20');
  const systemLang = params.lang?.toLowerCase();
  const languages = ["ar", "translit", systemLang && systemLang !== "ar" ? systemLang : "en"];
  const { data: response, error: errorResponse } = await supabase.functions.invoke(`duas?languages=${languages}&page=${page}&size=${size}`);
  if (errorResponse) {
    console.error(`Error while fetching for languages ${languages} all duas: ${errorResponse}`)
    error(404);
  }

  return {
    duas: response.data,
    page: page,
    size: size,
  };
}
