import { NextResponse } from "next/server";
import { z } from "zod";

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

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_NOTIFY_CHAT_ID;
  if (!token || !chatId) return { ok: false, reason: "missing config" };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  return { ok: res.ok };
}

export async function POST(req: Request) {
  try {
    const payload = schema.parse(await req.json());
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // --- Full mode (Supabase configured) ---
    if (supabaseUrl) {
      const { createSupabaseServerClient } = await import("@/lib/supabase");
      const { qualifyLeadWithClaude } = await import("@/lib/ai");
      const { sendLeadEmail, sendTelegramNotification } = await import("@/lib/integrations");
      const supabase = createSupabaseServerClient();

      const { data: agent, error: agentError } = await supabase
        .from("agents")
        .select("*")
        .eq("slug", payload.agentSlug)
        .maybeSingle();

      if (agentError || !agent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }

      const qualification = await qualifyLeadWithClaude({ agent, lead: payload });

      const { data: lead, error: insertError } = await supabase
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

      if (insertError || !lead) {
        return NextResponse.json({ error: insertError?.message ?? "Failed to save" }, { status: 500 });
      }

      await Promise.allSettled([
        sendLeadEmail(lead, agent, qualification.emailResponse),
        sendTelegramNotification(agent, lead)
      ]);

      return NextResponse.json({ ok: true, lead, qualification });
    }

    // --- Demo mode (no Supabase) ---
    const text = [
      "NEW LEAD (LeadSpark)",
      `Name: ${payload.full_name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Type: ${payload.insurance_type}`,
      `Coverage: ${payload.current_coverage}`,
      `Timeline: ${payload.timeline}`,
      `ZIP: ${payload.zip_code}`
    ].join("\n");

    const telegram = await sendTelegram(text);

    return NextResponse.json({ ok: true, telegram });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid" }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
