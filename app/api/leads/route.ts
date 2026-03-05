import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: Request) {
  const { user, error: authError } = await getAuthenticatedUser(req);
  if (authError || !user) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const sort = url.searchParams.get("sort") || "date_desc";

  const supabase = createSupabaseServerClient();
  let query = supabase.from("leads").select("*").eq("agent_id", user.id);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (sort === "score_desc") {
    query = query.order("qualification_score", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ leads: data ?? [] });
}
