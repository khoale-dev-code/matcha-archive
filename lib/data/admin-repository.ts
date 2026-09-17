import "server-only";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { teaBrands, teaProducts } from "@/lib/data/seed";
import type { SiteContentRecord, TeaBrand, TeaProduct } from "@/lib/types/tea";

export async function getAdminTeaBrands(): Promise<TeaBrand[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return teaBrands;
  const { data, error } = await supabase.from("tea_brands").select("*").order("sort_order", { ascending: true });
  if (error) return teaBrands;
  return (data ?? []) as TeaBrand[];
}

export async function getAdminTeaProducts(): Promise<TeaProduct[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return teaProducts;
  const { data, error } = await supabase
    .from("tea_products")
    .select("*, brand:tea_brands(*)")
    .order("sort_order", { ascending: true });
  if (error) return teaProducts;
  return (data ?? []) as TeaProduct[];
}

export async function getAdminSiteContent(key: string): Promise<SiteContentRecord | null> {
  const supabase = getAdminSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.from("site_settings").select("*").eq("key", key).maybeSingle();
  if (error || !data) return null;
  return data as SiteContentRecord;
}
