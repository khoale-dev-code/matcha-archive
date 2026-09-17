import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OriginStory } from "@/components/brands/OriginStory";
import { PriceReference } from "@/components/ui/PriceReference";
import { getTeaProductBySlug } from "@/lib/data/repository";
import { teaProducts } from "@/lib/data/seed";
import { getT } from "@/i18n.server";
import { localizedText } from "@/lib/i18n/content";
import { withLocalePath } from "@/lib/i18n/routing";

export const revalidate = 180;
export function generateStaticParams() { return teaProducts.filter((item) => item.is_visible && item.tea_type !== "matcha").map((item) => ({ slug: item.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, { t, lng }] = await Promise.all([params, getT("common")]);
  const product = await getTeaProductBySlug(slug);
  if (!product || product.tea_type === "matcha") return { title: t("meta.teaNotFound") };
  const description = localizedText(lng, product.tasting_summary_vi, product.tasting_summary_en, product.name);
  const canonical = withLocalePath(`/tea/${product.slug}`, lng);
  return {
    title: `${product.name} — ${t(`teaTypes.${product.tea_type}`)} ${t("meta.teaProfile")}`,
    description,
    alternates: { canonical, languages: { vi: `/tea/${product.slug}`, en: `/en/tea/${product.slug}` } },
  };
}

export default async function TeaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, { t, lng }] = await Promise.all([params, getT("common")]);
  const product = await getTeaProductBySlug(slug);
  if (!product || product.tea_type === "matcha") notFound();
  const summary = localizedText(lng, product.tasting_summary_vi, product.tasting_summary_en, t("detail.dataMissing"));
  const description = localizedText(lng, product.description_vi, product.description_en, "");
  return (
    <>
      <section className="detail-hero">
        <div className="section-shell">
          <div className="detail-hero__crumbs"><Link href={withLocalePath("/brands", lng)} className="inline-flex items-center gap-1"><ArrowLeft size={12} /> {t("tea.brandArchive")}</Link><span>/</span><span>{t(`teaTypes.${product.tea_type}`)}</span><span>/</span><span>{product.name}</span></div>
          <div className="detail-hero__grid">
            <div className="detail-hero__visual">{product.image_url ? <Image src={product.image_url} alt={`${product.name} editorial reference visual`} fill priority sizes="(max-width: 900px) 100vw, 44vw" className="object-cover" /> : null}</div>
            <div>
              <p className="eyebrow">{t(`teaTypes.${product.tea_type}`)} / {t("tea.separate")}</p>
              {product.japanese_name ? <div className="detail-hero__kanji mt-5">{product.japanese_name}</div> : null}
              <h1 className="detail-hero__name">{product.name}</h1>
              <div className="detail-hero__brand">{product.brand?.name ?? t("detail.brandPending")}</div>
              <p className="detail-hero__summary">{summary}</p>
              <div className="mt-8 max-w-sm"><PriceReference price={product.price} unit={product.price_unit} note={product.price_note} /></div>
            </div>
          </div>
        </div>
      </section>
      {description ? <section className="detail-section detail-section--soft"><div className="section-shell tasting-note-layout"><div><p className="eyebrow">{t("tea.type")}</p><h2 className="display-title mt-4">{t("tea.hojichaTitleA")} <em>{t("tea.hojichaTitleB")}</em></h2></div><div className="intro-copy"><p>{description}</p><p>{summary}</p></div></div></section> : null}
      <section className="detail-section"><div className="section-shell"><OriginStory product={product} brand={product.brand} /></div></section>
    </>
  );
}
