import { supabase } from "$lib/supabase.config";
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const systemLang = params.lang?.toLowerCase();
  const languages = ["ar", "translit", systemLang && systemLang !== "ar" ? systemLang : "en"];
  const { data: response, error: errorResponse } = await supabase.functions.invoke(`duas/${params.duaRouteName}?languages=${languages}`);
  if (errorResponse) {
    error(404);
  }

  return {
    dua: response.data,
    routeName: params.duaRouteName,
    lang: systemLang,
  };
}
