import { supabase } from "$lib/supabase.config";
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types'
import type { DuaLine } from "$lib/types/dua.model";

function transformLines(rawLines: any[]): DuaLine[] {
  return rawLines.map((raw) => {
    const flat: Record<string, any> = {
      begin_of_section: raw.begin_of_section ?? false,
      type: raw.type ?? "TEXT",
      repetitions_number: raw.repetitions_number ?? null,
    };
    for (const t of raw.translations ?? []) {
      flat[t.language] = t.text;
      if (t.section_title) {
        flat["section_title_" + t.language] = t.section_title;
      }
    }
    return flat as DuaLine;
  });
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const systemLang = params.lang?.toLowerCase();
  const firstTranslation = systemLang && systemLang !== "ar" ? systemLang : "en";
  const languages = ["ar", "translit", firstTranslation];

  const secondTranslation = url.searchParams.get("lang2");
  if (secondTranslation && secondTranslation !== "ar" && secondTranslation !== "translit" && secondTranslation !== firstTranslation) {
    languages.push(secondTranslation);
  }

  const { data: response, error: errorResponse } = await supabase.functions.invoke(`duas/${params.duaRouteName}?languages=${languages}`);
  if (errorResponse) {
    error(404);
  }

  const dua = response.data;
  dua.lines = transformLines(dua.lines);

  return {
    dua,
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
