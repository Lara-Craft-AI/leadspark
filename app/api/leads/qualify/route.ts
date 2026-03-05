import { NextResponse } from "next/server";
import { z } from "zod";
import { qualifyLeadWithClaude } from "@/lib/ai";
import { createSupabaseServerClient } from "@/lib/supabase";

const schema = z.object({
  agentSlug: z.string().min(2),
  lead: z.object({
    full_name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7),
    insurance_type: z.string().min(2),
    current_coverage: z.string().min(2),
    timeline: z.string().min(2),
    zip_code: z.string().min(3)
  })
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const supabase = createSupabaseServerClient();

    const { data: agent, error } = await supabase.from("agents").select("*").eq("slug", body.agentSlug).maybeSingle();
    if (error || !agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const result = await qualifyLeadWithClaude({
      agent,
      lead: body.lead
    });

    return NextResponse.json({ qualification: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
