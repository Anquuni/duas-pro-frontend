import { supabase } from "$lib/supabase.config";
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '20');
  const types = url.searchParams.get('types');
  const searchWord = url.searchParams.get('search-word');

  const systemLang = params.lang?.toLowerCase();
  const languages = ["ar", "translit", systemLang && systemLang !== "ar" ? systemLang : "en"];

  let requestUrl = `duas?languages=${languages}&page=${page}&size=${size}`;
  if (types) {
    requestUrl += `&types=${types}`;
  }
  if (searchWord) {
    requestUrl += `&search-word=${encodeURIComponent(searchWord)}`;
  }

  const { data: response, error: errorResponse } = await supabase.functions.invoke(requestUrl);
  if (errorResponse) {
    console.error(`Error while fetching all duas from ${requestUrl}: ${errorResponse}`)
    error(404);
  }

  return {
    duas: response.data,
    pagination: response.pagination,
  };
}
