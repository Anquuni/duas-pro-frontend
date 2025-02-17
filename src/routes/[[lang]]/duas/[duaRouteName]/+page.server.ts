import { supabase } from "$lib/supabase.config";
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const systemLang = params.lang?.toUpperCase();
  const languages = ["AR", "TL", systemLang && systemLang !== "AR" ? systemLang : "EN"];
  const { data, error: fetchError } = await supabase.functions.invoke(`duas/${params.duaRouteName}?languages=ar,tl,${languages}`);
  if (fetchError) {
    error(404);
  }

  const code = url.searchParams.get("code");

  return {
    dua: data.data,
    routeName: params.duaRouteName,
    code: code,
  };
}
