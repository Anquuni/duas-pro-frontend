import { supabase } from "$lib/supabase.config";
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  const systemLang = params.lang?.toLowerCase();

  let requestUrl = `posts?language=${systemLang}&page=1&size=20`;
  const { data: response, error: errorResponse } = await supabase.functions.invoke(requestUrl);
  if (errorResponse) {
    console.error(`Error while fetching all blog posts from ${requestUrl}: ${errorResponse}`)
    error(404);
  }

  return {
    posts: response.data,
  };
}
