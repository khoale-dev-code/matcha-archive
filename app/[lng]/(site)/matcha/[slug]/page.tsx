import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { HowToEnjoy } from "@/components/brewing/HowToEnjoy";
import { OriginStory } from "@/components/brands/OriginStory";
import { MatchaCard } from "@/components/matcha/MatchaCard";
import { PriceReference } from "@/components/ui/PriceReference";
import { TastingProfile } from "@/components/tasting/TastingProfile";
import { getTeaProductBySlug, getTeaProducts } from "@/lib/data/repository";
import { teaProducts } from "@/lib/data/seed";
import { getT } from "@/i18n.server";
import { localeAlternates, withLocalePath } from "@/lib/i18n/routing";
import { localizedText } from "@/lib/i18n/content";

export const revalidate = 180;

export function generateStaticParams() {
  return teaProducts.filter((item) => item.is_visible && item.tea_type === "matcha").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, { t, lng }] = await Promise.all([params, getT("common")]);
  const product = await getTeaProductBySlug(slug);
  if (!product) return { title: t("meta.teaNotFound") };
  const description = localizedText(lng, product.tasting_summary_vi, product.tasting_summary_en, t("meta.profileFallback", { name: product.name }));
  return {
    title: `${product.name} Matcha – ${product.brand?.name ?? "Tea Archive"} | ${t("detail.profile")}`,
    description,
    alternates: localeAlternates(`/matcha/${product.slug}`, lng),
    openGraph: {
      title: `${product.name} — ${product.brand?.name ?? "MIE MATCHA"}`,
      description,
      type: "article",
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function MatchaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, { t, lng }] = await Promise.all([params, getT("common")]);
  const product = await getTeaProductBySlug(slug);
  if (!product || product.tea_type !== "matcha") notFound();
  const all = await getTeaProducts({ teaType: "matcha" });
  const related = all.filter((item) => item.id !== product.id).slice(0, 3);
  const brand = product.brand;
  const localizedSummary = localizedText(lng, product.tasting_summary_vi, product.tasting_summary_en, t("detail.dataMissing"));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${product.name} — ${t("detail.profile")}`,
    description: localizedSummary,
    inLanguage: lng,
    about: {
      "@type": "Thing",
      name: `${product.name}${brand?.name ? ` — ${brand.name}` : ""}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="detail-hero">
        <div className="section-shell">
          <div className="detail-hero__crumbs">
            <Link href={withLocalePath("/matcha", lng)} className="inline-flex items-center gap-1"><ArrowLeft size={12} /> {t("detail.library")}</Link>
            <span>/</span><span>{brand?.name ?? t("detail.teaHouse")}</span><span>/</span><span>{product.name}</span>
          </div>
          <div className="detail-hero__grid">
            <div className="detail-hero__visual">
              {product.image_url ? <Image src={product.image_url} alt={`${product.name} editorial reference visual`} fill priority sizes="(max-width: 900px) 100vw, 44vw" className="object-cover" /> : null}
            </div>
            <div>
              <p className="eyebrow">{t(`teaTypes.${product.tea_type}`)} {t("detail.profile")} / {t("detail.sourcePage")} {product.source_page ?? "—"}</p>
              {product.japanese_name ? <div className="detail-hero__kanji mt-5">{product.japanese_name}</div> : null}
              <h1 className="detail-hero__name">{product.name}</h1>
              <div className="detail-hero__brand">
                {brand?.name ?? t("detail.brandPending")} · {brand?.origin_region ?? t("detail.regionPending")} · {brand?.origin_country ?? product.origin_country ?? t("detail.countryPending")}
              </div>
              <p className="detail-hero__summary">{localizedSummary}</p>
              <div className="mt-8 max-w-sm"><PriceReference price={product.price} unit={product.price_unit} note={product.price_note} /></div>
              <dl className="quick-profile">
                <div><dt>{t("detail.brand")}</dt><dd>{brand?.name ?? "—"}</dd></div>
                <div><dt>{t("detail.teaType")}</dt><dd>{t(`teaTypes.${product.tea_type}`)}</dd></div>
                <div><dt>{t("detail.productOrigin")}</dt><dd>{product.origin_region ?? t("detail.pending")}</dd></div>
                <div><dt>{t("detail.aroma")}</dt><dd>{product.aroma ?? "—"}</dd></div>
                <div><dt>{t("detail.finish")}</dt><dd>{product.finish ?? "—"}</dd></div>
                <div><dt>{t("detail.source")}</dt><dd>matcha.docx · p.{product.source_page ?? "—"}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-section detail-section--soft"><div className="section-shell"><TastingProfile product={product} /></div></section>

      <section className="detail-section">
        <div className="section-shell tasting-note-layout">
          <div>
            <p className="eyebrow">{t("detail.tastingNotes")}</p>
            <h2 className="display-title mt-3">{t("detail.wordsA")} <em>{t("detail.wordsB")}</em></h2>
          </div>
          <div>
            <div className="tasting-note-cloud">{product.tasting_notes.map((note) => <span className="tasting-note-pill" key={note}>{note}</span>)}</div>
            <div className="source-note"><span>{t("detail.viSource")}</span><p>{product.tasting_summary_vi ?? "—"}</p></div>
            <div className="source-note source-note--en"><span>{t("detail.enSource")}</span><p>{product.tasting_summary_en ?? t("detail.enMissing")}</p></div>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="section-shell">
          <div className="mb-8"><p className="eyebrow">{t("detail.journey")}</p><h2 className="editorial-title mt-2 text-5xl">{t("detail.journeyTitle")}</h2></div>
          <div className="flavor-journey">
            <div className="flavor-stage"><span>{t("detail.firstReference")}</span><h3>{t("detail.aroma")}</h3><p>{product.aroma ?? t("detail.aromaMissing")}</p></div>
            <div className="flavor-stage"><span>{t("detail.midPalate")}</span><h3>{t("detail.overall")}</h3><p>{localizedSummary}</p></div>
            <div className="flavor-stage"><span>{t("detail.finish")}</span><h3>{t("detail.aftertaste")}</h3><p>{product.finish ?? t("detail.finishMissing")}</p></div>
          </div>
        </div>
      </section>

      <section className="detail-section detail-section--soft"><div className="section-shell"><HowToEnjoy product={product} /></div></section>
      <section className="detail-section"><div className="section-shell"><OriginStory product={product} brand={brand} /></div></section>

      <section className="section-block border-t border-[color:var(--line)]">
        <div className="section-shell">
          <div className="flex items-end justify-between gap-6 border-b border-[color:var(--line)] pb-7">
            <div><p className="eyebrow">{t("detail.continue")}</p><h2 className="editorial-title mt-2 text-5xl">{t("detail.another")}</h2></div>
            <Link href={withLocalePath("/matcha", lng)} className="text-link hidden items-center gap-2 sm:inline-flex">{t("detail.fullLibrary")} <ArrowUpRight size={15} /></Link>
          </div>
          <div className="matcha-grid mt-8">{related.map((item, index) => <MatchaCard key={item.id} product={item} index={index} />)}</div>
        </div>
      </section>
    </>
  );
}
