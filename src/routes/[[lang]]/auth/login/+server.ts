import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, url, locals }) => {
	const { email } = await request.json();
  const redirectTo = url.searchParams.get('redirectTo') ?? '/';
  console.log("Trying to sent Magic Link to " + email + " with redirecting to " + redirectTo);

  if (!email) {
    return json({ success: null, error: 'Missing email', status: 400  });
  }

  const { data, error: signInError } = await locals.supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        // TODO: Add i18n to email templates
        // description: "email.magic_link.description",
        // button: "email.magic_link.button",
        // footer_note: "email.magic_link.footer_note",
        description: "Click and confirm that you want to sign in to duas.pro. This link will expire in 60 minutes.",
        button: "Log In",
        footer_note: "If you did not request this link, you can safely ignore this email.",
      }
    }
  });

  if (signInError) {
    return json({ success: false, error: 'Email konnte nicht gesendet werden. Grund: ' + signInError.message, status: 400  });
  }

  console.log("Magic Link sent to:", email);
  return json({ success: true });
};
