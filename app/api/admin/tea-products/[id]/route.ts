import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const allowed = [
  "slug", "name", "japanese_name", "brand_id", "tea_type", "origin_country", "origin_region",
  "description_vi", "description_en", "tasting_summary_vi", "tasting_summary_en", "aroma",
  "body_score", "umami_score", "sweetness_score", "bitterness_score", "creaminess_score", "finish",
  "tasting_notes", "recommended_for", "brewing_matcha_grams", "brewing_water_ml", "brewing_temperature",
  "brewing_time", "price", "price_unit", "price_note", "is_featured", "is_visible", "sort_order",
  "image_url", "gallery", "source_page"
] as const;

function sanitize(body: Record<string, unknown>) {
  return Object.fromEntries(allowed.filter((key) => key in body).map((key) => [key, body[key]]));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase admin is not configured. Add env values first." }, { status: 503 });
  const body = sanitize(await request.json());
  const { data, error } = await supabase.from("tea_products").update(body).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("tea-products", "max");
  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase admin is not configured." }, { status: 503 });
  const { error } = await supabase.from("tea_products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("tea-products", "max");
  return NextResponse.json({ ok: true });
}
