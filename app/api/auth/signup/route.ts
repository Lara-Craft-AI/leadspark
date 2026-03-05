import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).optional(),
  name: z.string().min(2),
  agencyName: z.string().min(2),
  phone: z.string().optional(),
  timezone: z.string().min(2),
  insuranceTypes: z.array(z.string()).min(1),
  calendarLink: z.string().url().optional().or(z.literal("")),
  brandVoice: z.string().optional()
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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // --- Full mode (Supabase configured) ---
    if (supabaseUrl) {
      const { createSupabaseServerClient } = await import("@/lib/supabase");
      const { slugify: slugifyLib, uniqueSlug } = await import("@/lib/slug");
      const supabase = createSupabaseServerClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: body.email,
        password: body.password || "temppass123"
      });

      if (authError || !authData.user) {
        return NextResponse.json({ error: authError?.message ?? "Signup failed" }, { status: 400 });
      }

      const base = slugifyLib(body.agencyName || body.name) || `agent-${Math.floor(Math.random() * 100000)}`;
      let slug = base;
      for (let i = 0; i < 50; i += 1) {
        const candidate = uniqueSlug(base, i);
        const { data } = await supabase.from("agents").select("slug").eq("slug", candidate).maybeSingle();
        if (!data) { slug = candidate; break; }
      }

      const { error: agentError } = await supabase.from("agents").insert({
        id: authData.user.id,
        email: body.email,
        name: body.name,
        agency_name: body.agencyName,
        phone: body.phone || null,
        timezone: body.timezone,
        insurance_types: body.insuranceTypes,
        calendar_link: body.calendarLink || null,
        brand_voice: body.brandVoice || null,
        slug
      });

      if (agentError) {
        return NextResponse.json({ error: agentError.message }, { status: 500 });
      }

      return NextResponse.json({
        user: { id: authData.user.id, email: authData.user.email, slug }
      });
    }

    // --- Demo mode (no Supabase) ---
    const slug = slugify(body.agencyName || body.name) || `agent-${Date.now()}`;

    const text = [
      "NEW AGENT SIGNUP (LeadSpark)",
      `Name: ${body.name}`,
      `Agency: ${body.agencyName}`,
      `Email: ${body.email}`,
      `Phone: ${body.phone || "N/A"}`,
      `Timezone: ${body.timezone}`,
      `Insurance: ${body.insuranceTypes.join(", ")}`,
      `Calendar: ${body.calendarLink || "N/A"}`,
      `Slug: ${slug}`
    ].join("\n");

    const telegram = await sendTelegram(text);

    return NextResponse.json({
      user: { id: `demo-${Date.now()}`, email: body.email, slug },
      telegram
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
