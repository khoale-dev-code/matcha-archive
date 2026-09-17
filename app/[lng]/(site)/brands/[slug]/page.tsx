import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MatchaCard } from "@/components/matcha/MatchaCard";
import { getProductsForBrand, getTeaBrandBySlug } from "@/lib/data/repository";
import { teaBrands } from "@/lib/data/seed";
import { getT } from "@/i18n.server";
import { localizedText } from "@/lib/i18n/content";
import { localeAlternates } from "@/lib/i18n/routing";

export const revalidate = 180;

export function generateStaticParams() {
  return teaBrands.filter((item) => item.is_visible).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, { t, lng }] = await Promise.all([params, getT("common")]);
  const brand = await getTeaBrandBySlug(slug);
  if (!brand) return { title: t("meta.brandNotFound") };
  return {
    title: `${brand.name} ${t("meta.matchaGuide")}`,
    description: localizedText(lng, brand.description_vi, brand.description_en, t("meta.brandFallback", { name: brand.name })),
    alternates: localeAlternates(`/brands/${brand.slug}`, lng),
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, { t, lng }] = await Promise.all([params, getT("common")]);
  const brand = await getTeaBrandBySlug(slug);
  if (!brand) notFound();
  const products = await getProductsForBrand(brand.id);
  const description = localizedText(lng, brand.description_vi, brand.description_en, t("brandsPage.descriptionMissing"));

  return (
    <>
      <section className="brand-page-hero">
        <div className="section-shell brand-page-hero__grid">
          <div className="brand-logo-card">
            {brand.logo_url ? <Image src={brand.logo_url} alt={`${brand.name} logo from source document`} width={520} height={240} className="max-h-52 w-full object-contain" priority /> : <span className="jp-name text-8xl">茶</span>}
          </div>
          <div>
            <p className="eyebrow">{t("brandsPage.detailEyebrow")}</p>
            {brand.japanese_name ? <div className="brand-page-jp mt-5">{brand.japanese_name}</div> : null}
            <h1 className="brand-page-title mt-2">{brand.name}</h1>
            <div className="mt-5 text-[10px] font-bold uppercase tracking-[.13em]">{brand.origin_region ?? t("brandsPage.rowRegionPending")} · {brand.origin_country ?? t("detail.countryPending")}</div>
            <p className="brand-page-copy">{description}</p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-shell">
          <div className="border-b border-[color:var(--line)] pb-7">
            <p className="eyebrow">{t("brandsPage.profiles")}</p>
            <h2 className="editorial-title mt-2 text-6xl">{t("brandsPage.profileCount", { count: products.length })}</h2>
          </div>
          <div className="matcha-grid mt-8">{products.map((product, index) => <MatchaCard key={product.id} product={product} index={index} />)}</div>
        </div>
      </section>
    </>
  );
}
