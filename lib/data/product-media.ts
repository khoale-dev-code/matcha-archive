import { optimizeCloudinaryUrl } from "@/lib/cloudinary/url";
import type { TeaProduct } from "@/lib/types/tea";

export type ProductMedia = {
  src: string;
  fit: "contain" | "cover";
  position: string;
  altVi: string;
  altEn: string;
  source: "curated" | "product";
};

const curatedProductMedia: Record<string, ProductMedia> = {
  isuzu: {
    src: "/images/tea/marukyu/isuzu.webp",
    fit: "contain",
    position: "center",
    altVi: "Hộp Matcha Isuzu của Marukyu Koyamaen",
    altEn: "Marukyu Koyamaen Isuzu matcha tin",
    source: "curated",
  },
  "chigi-no-shiro": {
    src: "/images/tea/marukyu/chigi-no-shiro.webp",
    fit: "contain",
    position: "center",
    altVi: "Hộp Matcha Chigi no Shiro của Marukyu Koyamaen",
    altEn: "Marukyu Koyamaen Chigi no Shiro matcha tin",
    source: "curated",
  },
  yugen: {
    src: "/images/tea/marukyu/yugen.webp",
    fit: "contain",
    position: "center",
    altVi: "Hộp Matcha Yugen của Marukyu Koyamaen",
    altEn: "Marukyu Koyamaen Yugen matcha tin",
    source: "curated",
  },
  "wako-marukyu-koyamaen": {
    src: "/images/tea/marukyu/wako.webp",
    fit: "contain",
    position: "center",
    altVi: "Hộp Matcha Wako của Marukyu Koyamaen",
    altEn: "Marukyu Koyamaen Wako matcha tin",
    source: "curated",
  },
  kinrin: {
    src: "/images/tea/marukyu/kinrin.webp",
    fit: "contain",
    position: "center",
    altVi: "Hộp Matcha Kinrin của Marukyu Koyamaen",
    altEn: "Marukyu Koyamaen Kinrin matcha tin",
    source: "curated",
  },
  unkaku: {
    src: "/images/tea/marukyu/unkaku.webp",
    fit: "contain",
    position: "center",
    altVi: "Hộp Matcha Unkaku của Marukyu Koyamaen",
    altEn: "Marukyu Koyamaen Unkaku matcha tin",
    source: "curated",
  },
};

const legacyCuratedPaths: Record<string, string[]> = {
  isuzu: ["/images/tea/marukyu/isuzu.jpg"],
  "chigi-no-shiro": ["/images/tea/marukyu/chigi-no-shiro.jpg"],
  yugen: ["/images/tea/marukyu/yugen.jpg"],
  "wako-marukyu-koyamaen": ["/images/tea/marukyu/wako.jpg"],
  kinrin: ["/images/tea/marukyu/kinrin.jpg"],
  unkaku: ["/images/tea/marukyu/unkaku.jpg"],
};

export const HOME_MARUKYU_SLUGS = [
  "isuzu",
  "chigi-no-shiro",
  "yugen",
  "wako-marukyu-koyamaen",
  "kinrin",
  "unkaku",
] as const;

function isLegacySeedVisual(url: string | null | undefined) {
  return !url || /^\/images\/tea\/[^/]+\.svg$/i.test(url);
}

function usesCuratedLocalAsset(product: TeaProduct, curated: ProductMedia) {
  if (product.image_url === curated.src) return true;
  return legacyCuratedPaths[product.slug]?.includes(product.image_url ?? "") ?? false;
}

export function resolveProductMedia(product: TeaProduct): ProductMedia | null {
  const curated = curatedProductMedia[product.slug];

  // Admin/Cloudinary media always wins. Legacy SVG/JPG seed visuals are upgraded
  // to the curated WebP photography supplied for the Marukyu homepage set.
  if (curated && (isLegacySeedVisual(product.image_url) || usesCuratedLocalAsset(product, curated))) {
    return curated;
  }

  if (product.image_url && !isLegacySeedVisual(product.image_url)) {
    return {
      src: optimizeCloudinaryUrl(product.image_url, 900) || product.image_url,
      fit: "cover",
      position: "center",
      altVi: `${product.name} - hình ảnh sản phẩm`,
      altEn: `${product.name} product image`,
      source: "product",
    };
  }

  if (curated) return curated;
  if (!product.image_url) return null;

  return {
    src: product.image_url,
    fit: "cover",
    position: "center",
    altVi: `${product.name} - hình ảnh tham khảo`,
    altEn: `${product.name} reference image`,
    source: "product",
  };
}

export function getHomepageFeaturedMatcha(products: TeaProduct[], limit = 6) {
  const bySlug = new Map(products.map((item) => [item.slug, item]));
  const curated = HOME_MARUKYU_SLUGS
    .map((slug) => bySlug.get(slug))
    .filter((item): item is TeaProduct => Boolean(item && item.is_visible));

  // Keep one coherent photographed tea-house set on the homepage.
  if (curated.length >= Math.min(limit, 4)) {
    return curated.slice(0, limit);
  }

  const seen = new Set(curated.map((item) => item.id));
  const fallback = [
    ...products.filter((item) => item.is_featured && item.is_visible && !seen.has(item.id)),
    ...products.filter((item) => item.is_visible && !item.is_featured && !seen.has(item.id)),
  ];

  return [...curated, ...fallback].slice(0, limit);
}
