import { NextResponse } from "next/server";

const DEMO_AGENT = {
  id: "demo",
  name: "LeadSpark Demo",
  agency_name: "LeadSpark Insurance",
  insurance_types: ["Auto", "Home", "Life", "Commercial", "Health"],
  calendar_link: null,
  brand_voice: "Professional, friendly, and fast",
  slug: "demo"
};

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    if (params.slug === "demo") {
      return NextResponse.json({ agent: DEMO_AGENT });
    }
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const { createSupabaseServerClient } = await import("@/lib/supabase");
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("agents")
    .select("id,name,agency_name,insurance_types,calendar_link,brand_voice,slug")
    .eq("slug", params.slug)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({ agent: data });
}
