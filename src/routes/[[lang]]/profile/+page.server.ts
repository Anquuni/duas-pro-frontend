import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

function generateCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => chars[b % chars.length]).join("");
}

export const load: PageServerLoad = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session) redirect(303, "/");

  const { data: sessions, error } = await locals.supabase
    .from("live_reading_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Failed to load sessions:", error.message);

  return { user, sessions: sessions ?? [] };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const { session } = await locals.safeGetSession();
    if (!session) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const name = (form.get("name") as string)?.trim();
    const dua_slug = form.get("dua_slug") as string;
    const dua_title = JSON.parse(form.get("dua_title") as string);
    const schedule = JSON.parse(form.get("schedule") as string);

    if (!name || !dua_slug) return fail(400, { error: "Missing required fields" });

    const { error } = await locals.supabase.from("live_reading_sessions").insert({
      user_id: session.user.id,
      code: generateCode(),
      name,
      dua_slug,
      dua_title,
      schedule,
    });

    if (error) return fail(500, { error: error.message });
    return { success: true };
  },

  update: async ({ request, locals }) => {
    const { session } = await locals.safeGetSession();
    if (!session) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = form.get("id") as string;
    const name = (form.get("name") as string)?.trim();
    const schedule = JSON.parse(form.get("schedule") as string);

    if (!id || !name) return fail(400, { error: "Missing required fields" });

    const { error } = await locals.supabase
      .from("live_reading_sessions")
      .update({ name, schedule })
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) return fail(500, { error: error.message });
    return { success: true };
  },

  delete: async ({ request, locals }) => {
    const { session } = await locals.safeGetSession();
    if (!session) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = form.get("id") as string;

    if (!id) return fail(400, { error: "Missing id" });

    const { error } = await locals.supabase
      .from("live_reading_sessions")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) return fail(500, { error: error.message });
    return { success: true };
  },
};
