import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    realtime: {
        worker: true,
        heartbeatCallback: (status) => {
            console.log("Realtime heartbeat:", status);
            if (status === "disconnected") {
                supabase.realtime.connect();
            }
        }
    }
});
