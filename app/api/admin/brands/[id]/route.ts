import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
const allowed = ["slug", "name", "japanese_name", "description_vi", "description_en", "origin_country", "origin_region", "logo_url", "is_visible", "sort_order"] as const;
const sanitize = (body: Record<string, unknown>) => Object.fromEntries(allowed.filter((key) => key in body).map((key) => [key, body[key]]));

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase admin is not configured." }, { status: 503 });
  const { data, error } = await supabase.from("tea_brands").update(sanitize(await request.json())).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("tea-brands", "max");
  revalidateTag("tea-products", "max");
  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase admin is not configured." }, { status: 503 });
  const { error } = await supabase.from("tea_brands").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("tea-brands", "max");
  revalidateTag("tea-products", "max");
  return NextResponse.json({ ok: true });
}
