import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(base: Record<string, unknown>, incoming: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(incoming)) {
    if (isObject(value) && isObject(output[key])) {
      output[key] = deepMerge(output[key] as Record<string, unknown>, value);
    } else {
      output[key] = value;
    }
  }
  return output;
}

export async function PUT(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin is not configured. Add env values first." }, { status: 503 });
  }

  const body = await request.json();
  const { data: existing } = await supabase.from("site_settings").select("title, body, payload").eq("key", key).maybeSingle();
  const currentPayload = isObject(existing?.payload) ? existing.payload : {};
  const incomingPayload = isObject(body.payload) ? body.payload : {};

  const row = {
    key,
    title: body.title !== undefined ? body.title : (existing?.title ?? null),
    body: body.body !== undefined ? body.body : (existing?.body ?? null),
    payload: deepMerge(currentPayload, incomingPayload),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("site_settings").upsert(row, { onConflict: "key" }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (key === "homepage") {
    revalidateTag("homepage-media", "max");
    revalidatePath("/", "layout");
    revalidatePath("/en", "layout");
  }

  return NextResponse.json({ data });
}
