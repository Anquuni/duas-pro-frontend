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


import type { Actions } from './$types'
export const actions: Actions = {
  updateDuaInfo: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const lineId = formData.get('lineId') as string
    const isInstruction = formData.get('isInstruction') as string
    const isBeginOfSection = formData.get('isBeginOfSection') as string
    const { error } = await supabase
      .from("dua_infos")
      .update({
        is_instruction: isInstruction ? "INSTRUCTION" : "SUPPLICATION",
        begin_of_section: isBeginOfSection,
      })
      .eq("id", lineId);
    if (error) {
      console.error(error)
    } else {
      console.log("success update info")
    }
  },
}
