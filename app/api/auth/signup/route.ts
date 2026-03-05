import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase";
import { slugify, uniqueSlug } from "@/lib/slug";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  agencyName: z.string().min(2),
  phone: z.string().optional(),
  timezone: z.string().min(2),
  insuranceTypes: z.array(z.string()).min(1),
  calendarLink: z.string().url().optional().or(z.literal("")),
  brandVoice: z.string().optional()
});

async function generateAvailableSlug(supabase: ReturnType<typeof createSupabaseServerClient>, baseInput: string) {
  const base = slugify(baseInput) || `agent-${Math.floor(Math.random() * 100000)}`;

  for (let i = 0; i < 50; i += 1) {
    const candidate = uniqueSlug(base, i);
    const { data } = await supabase.from("agents").select("slug").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
  }

  return `${base}-${Date.now()}`;
}

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const supabase = createSupabaseServerClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message ?? "Signup failed" }, { status: 400 });
    }

    const slug = await generateAvailableSlug(supabase, body.agencyName || body.name);

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
      user: {
        id: authData.user.id,
        email: authData.user.email,
        slug
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
