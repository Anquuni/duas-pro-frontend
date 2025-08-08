import { supabase } from "$lib/supabase.config";
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types'

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
    duaSlug: params.duaRouteName,
    lang: systemLang,
  };
}

export const actions: Actions = {
  reportLineError: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const duaSlug = formData.get('duaSlug') as string
    const lang = formData.get('lang') as string
    const lineNumber = formData.get('lineNumber') as string
    const email = formData.get('email') as string
    const errorDescription = formData.get('errorDescription') as string

    if (!errorDescription) {
      return fail(400, { errorDescription, missing: true })
    }

    const { error } = await supabase
      .from("error_reports")
      .insert({
        dua_slug: duaSlug,
        language_code: lang,
        line_number: lineNumber,
        user_email: email,
        error_description: errorDescription,
      });
    if (error) {
      console.error(error)
      return { success: false, error: JSON.stringify(error) };
    } else {
      return { success: true };
    }
  },
}
