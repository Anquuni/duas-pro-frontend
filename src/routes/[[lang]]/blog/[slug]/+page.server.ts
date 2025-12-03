import { supabase } from "$lib/supabase.config";
import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
  let requestUrl = `posts?language=${params.lang?.toLowerCase()}&slug=${params.slug}`;

  const { data: response, error: errorResponse } = await supabase.functions.invoke(requestUrl);
  if (errorResponse) {
    console.error(`Error while fetching post from ${requestUrl}: ${errorResponse}`)
    error(404);
  }

  return {
    post: response.data
  };
}
