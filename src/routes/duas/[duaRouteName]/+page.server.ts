import { supabase } from "$lib/supabase.config";
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const { data, error: fetchError } = await supabase.functions.invoke("duas/" + params.duaRouteName + "?languages=ar,tl,en");
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
