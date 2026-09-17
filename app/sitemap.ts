import type { MetadataRoute } from "next";
import { teaBrands, teaProducts } from "@/lib/data/seed";
import { teaProfileHref } from "@/lib/routes";
import { withLocalePath } from "@/lib/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const staticRoutes = ["/", "/matcha", "/brands", "/guide", "/about", "/contact"];
  const dynamicRoutes = [
    ...teaProducts.filter((item) => item.is_visible).map((item) => teaProfileHref(item)),
    ...teaBrands.filter((item) => item.is_visible).map((item) => `/brands/${item.slug}`),
  ];
  const routes = [...staticRoutes, ...dynamicRoutes];

  return routes.flatMap((path) => (["vi", "en"] as const).map((lng) => ({
    url: `${base}${withLocalePath(path, lng)}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : staticRoutes.includes(path) ? 0.8 : 0.7,
    alternates: {
      languages: {
        vi: `${base}${withLocalePath(path, "vi")}`,
        en: `${base}${withLocalePath(path, "en")}`,
      },
    },
  })));
}
