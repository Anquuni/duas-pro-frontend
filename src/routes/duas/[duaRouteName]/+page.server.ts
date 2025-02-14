import { supabase } from "$lib/supabase.config";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const { data, error } = await supabase.functions.invoke("duas/" + params.duaRouteName + "?languages=ar,tl,en");
  if (error) {
    console.error("Error fetching single dua:", error);
  }

  const code = url.searchParams.get("code");

  return {
    dua: data.data,
    routeName: params.duaRouteName,
    code: code,
  };
}
