import type { Metadata } from "next";
import { MatchaLibrary } from "@/components/matcha/MatchaLibrary";
import { getTeaProducts } from "@/lib/data/repository";
import { getT } from "@/i18n.server";
import { localeAlternates } from "@/lib/i18n/routing";

export const revalidate = 180;

export async function generateMetadata(): Promise<Metadata> {
  const { t, lng } = await getT("common");
  return {
    title: t("library.titleB"),
    description: t("library.copy"),
    alternates: localeAlternates("/matcha", lng),
  };
}

export default async function MatchaPage() {
  const [{ t }, products] = await Promise.all([getT("common"), getTeaProducts({ teaType: "matcha" })]);
  return (
    <>
      <section className="page-hero">
        <div className="section-shell page-hero__grid">
          <div>
            <p className="eyebrow">{t("library.eyebrow", { count: products.length })}</p>
            <h1 className="page-title mt-6">{t("library.titleA")}<br /><em>{t("library.titleB")}</em></h1>
          </div>
          <div className="page-intro">
            <p>{t("library.lead")}</p>
            <p className="mt-4">{t("library.copy")}</p>
          </div>
        </div>
      </section>
      <MatchaLibrary products={products} />
    </>
  );
}
