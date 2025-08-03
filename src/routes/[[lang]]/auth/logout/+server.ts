import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
  console.log("Trying to sign out...");

  const { error } = await locals.supabase.auth.signOut();

  if (error) {
    console.error("Error while signing out:", error.message);
    return json({ error: error.message }, { status: 500 });
  }

  console.log("Successfully signed out.");
  return json({ success: true });
};
