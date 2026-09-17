import type { TeaProduct } from "@/lib/types/tea";
export function teaProfileHref(product: Pick<TeaProduct, "tea_type" | "slug">) {
  return product.tea_type === "matcha" ? `/matcha/${product.slug}` : `/tea/${product.slug}`;
}
