import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase";
import { qualifyLeadWithClaude } from "@/lib/ai";
import { sendLeadEmail, sendTelegramNotification } from "@/lib/integrations";

const schema = z.object({
  agentSlug: z.string().min(2),
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  insurance_type: z.string().min(2),
  current_coverage: z.string().min(2),
  timeline: z.string().min(2),
  zip_code: z.string().min(3)
});

export async function POST(req: Request) {
  const start = Date.now();

  try {
    const payload = schema.parse(await req.json());
    const supabase = createSupabaseServerClient();

    const { data: agent, error: agentError } = await supabase.from("agents").select("*").eq("slug", payload.agentSlug).maybeSingle();
    if (agentError || !agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const qualification = await qualifyLeadWithClaude({
      agent,
      lead: {
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        insurance_type: payload.insurance_type,
        current_coverage: payload.current_coverage,
        timeline: payload.timeline,
        zip_code: payload.zip_code
      }
    });

    const { data: insertedLead, error: insertError } = await supabase
      .from("leads")
      .insert({
        agent_id: agent.id,
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        insurance_type: payload.insurance_type,
        current_coverage: payload.current_coverage,
        timeline: payload.timeline,
        zip_code: payload.zip_code,
        qualification_score: qualification.score,
        qualification_reason: qualification.reason,
        ai_response: qualification.emailResponse,
        status: qualification.score >= 7 ? "qualified" : "new"
      })
      .select("*")
      .single();

    if (insertError || !insertedLead) {
      return NextResponse.json({ error: insertError?.message ?? "Failed to save lead" }, { status: 500 });
    }

    await Promise.allSettled([
      sendLeadEmail(insertedLead, agent, qualification.emailResponse),
      sendTelegramNotification(agent, insertedLead)
    ]);

    return NextResponse.json({
      lead: insertedLead,
      qualification,
      elapsedMs: Date.now() - start
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
