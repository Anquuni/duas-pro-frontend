import type { EmailOtpType } from '@supabase/supabase-js'
import { error, redirect } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const token_hash = url.searchParams.get('token_hash');
  const redirectTo = url.searchParams.get('redirect_to') ?? '/';
  const type = url.searchParams.get('type') as EmailOtpType | null;
  console.log("Trying to confirm user...");

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      console.log("Succesfully confirmed user! Redirecting to: " + redirectTo);
      redirect(303, redirectTo);
    }
  }

  error(401, "User could not be confirmed.");
}
