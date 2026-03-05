import { createClient } from "@supabase/supabase-js";

function getUrl() {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!v) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  return v;
}

function getKey() {
  const v = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!v) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  return v;
}

export function createSupabaseBrowserClient() {
  return createClient(getUrl(), getKey());
}

export function createSupabaseServerClient() {
  return createClient(getUrl(), getKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
