import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/auth";

const patchSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "closed"]).optional(),
  notes: z.string().max(5000).optional()
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { user, error: authError } = await getAuthenticatedUser(req);
  if (authError || !user) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .eq("agent_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead: data });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { user, error: authError } = await getAuthenticatedUser(req);
  if (authError || !user) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  try {
    const payload = patchSchema.parse(await req.json());
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("leads")
      .update({
        ...(payload.status ? { status: payload.status } : {}),
        ...(payload.notes !== undefined ? { notes: payload.notes } : {})
      })
      .eq("id", params.id)
      .eq("agent_id", user.id)
      .select("*")
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Failed to update lead" }, { status: 400 });
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
