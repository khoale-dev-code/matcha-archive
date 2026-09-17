import { unstable_cache } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase/server";
import { getSeedBrandBySlug, getSeedProductBySlug, teaBrands, teaProducts } from "@/lib/data/seed";
import type { TeaBrand, TeaProduct } from "@/lib/types/tea";

const PUBLIC_REVALIDATE_SECONDS = 180;

function attachBrands(products: TeaProduct[], brands: TeaBrand[]) {
  return products.map((product) => ({
    ...product,
    brand: brands.find((brand) => brand.id === product.brand_id) ?? product.brand ?? null,
  }));
}

async function loadTeaBrands(): Promise<TeaBrand[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return teaBrands.filter((item) => item.is_visible);

  const { data, error } = await supabase
    .from("tea_brands")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return teaBrands.filter((item) => item.is_visible);
  return data as TeaBrand[];
}

const getCachedTeaBrands = unstable_cache(
  loadTeaBrands,
  ["matcha-archive-public-brands-v1"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["tea-brands"],
  },
);

export async function getTeaBrands(): Promise<TeaBrand[]> {
  return getCachedTeaBrands();
}

async function loadTeaProducts(teaType: string | null): Promise<TeaProduct[]> {
  const supabase = getPublicSupabase();

  if (!supabase) {
    return teaProducts.filter(
      (item) => item.is_visible && (!teaType || item.tea_type === teaType),
    );
  }

  let query = supabase
    .from("tea_products")
    .select("*, brand:tea_brands(*)")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (teaType) query = query.eq("tea_type", teaType);

  const { data, error } = await query;

  if (error || !data?.length) {
    return attachBrands(
      teaProducts.filter(
        (item) => item.is_visible && (!teaType || item.tea_type === teaType),
      ),
      teaBrands.filter((item) => item.is_visible),
    );
  }

  return data as TeaProduct[];
}

const getCachedTeaProducts = unstable_cache(
  loadTeaProducts,
  ["matcha-archive-public-products-v1"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["tea-products", "tea-brands"],
  },
);

export async function getTeaProducts(options?: { teaType?: string }): Promise<TeaProduct[]> {
  return getCachedTeaProducts(options?.teaType ?? null);
}

async function loadTeaProductBySlug(slug: string): Promise<TeaProduct | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return getSeedProductBySlug(slug);

  const { data, error } = await supabase
    .from("tea_products")
    .select("*, brand:tea_brands(*)")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();

  if (error || !data) return getSeedProductBySlug(slug);
  return data as TeaProduct;
}

const getCachedTeaProductBySlug = unstable_cache(
  loadTeaProductBySlug,
  ["matcha-archive-public-product-by-slug-v1"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["tea-products", "tea-brands"],
  },
);

export async function getTeaProductBySlug(slug: string): Promise<TeaProduct | null> {
  return getCachedTeaProductBySlug(slug);
}

async function loadTeaBrandBySlug(slug: string): Promise<TeaBrand | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return getSeedBrandBySlug(slug);

  const { data, error } = await supabase
    .from("tea_brands")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();

  if (error || !data) return getSeedBrandBySlug(slug);
  return data as TeaBrand;
}

const getCachedTeaBrandBySlug = unstable_cache(
  loadTeaBrandBySlug,
  ["matcha-archive-public-brand-by-slug-v1"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["tea-brands"],
  },
);

export async function getTeaBrandBySlug(slug: string): Promise<TeaBrand | null> {
  return getCachedTeaBrandBySlug(slug);
}

export async function getProductsForBrand(brandId: string) {
  const all = await getTeaProducts();
  return all.filter((product) => product.brand_id === brandId);
}
