import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key.
// Never import this in client components.
export const supabaseAdmin =
  globalThis.__supabase_admin__ ||
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

if (process.env.NODE_ENV !== "production") {
  globalThis.__supabase_admin__ = supabaseAdmin;
}
