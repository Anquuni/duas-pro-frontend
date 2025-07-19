import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export function load() {
  throw error(410);
}
