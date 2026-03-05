import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
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
