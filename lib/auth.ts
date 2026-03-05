import { createSupabaseServerClient } from "@/lib/supabase";

export async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Missing bearer token", user: null };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { error: "Unauthorized", user: null };
  }

  return { error: null, user: data.user };
}
