import type { Metadata } from "next";
import { BrandArchive } from "@/components/brands/BrandArchive";
import { getTeaBrands } from "@/lib/data/repository";
import { getT } from "@/i18n.server";
import { localeAlternates } from "@/lib/i18n/routing";

export const revalidate = 180;

export async function generateMetadata(): Promise<Metadata> {
  const { t, lng } = await getT("common");
  return { title: t("brandsPage.title"), description: t("brandsPage.description"), alternates: localeAlternates("/brands", lng) };
}

export default async function BrandsPage() {
  const [{ t }, brands] = await Promise.all([getT("common"), getTeaBrands()]);
  return (
    <>
      <section className="page-hero">
        <div className="section-shell page-hero__grid">
          <div>
            <p className="eyebrow">{t("brandsPage.eyebrow")}</p>
            <h1 className="page-title mt-6">{t("brandsPage.heroA")}<br /><em>{t("brandsPage.heroB")}</em></h1>
          </div>
          <p className="page-intro">{t("brandsPage.copy")}</p>
        </div>
      </section>
      <BrandArchive brands={brands} />
    </>
  );
}
