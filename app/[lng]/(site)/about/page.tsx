import type { Metadata } from "next";
import { getT } from "@/i18n.server";
import { localeAlternates } from "@/lib/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const { t, lng } = await getT("common");
  return { title: t("about.metaTitle"), description: t("about.metaDescription"), alternates: localeAlternates("/about", lng) };
}

export default async function AboutPage() {
  const { t } = await getT("common");
  return (
    <>
      <section className="page-hero">
        <div className="section-shell page-hero__grid">
          <div><p className="eyebrow">{t("about.eyebrow")}</p><h1 className="page-title mt-6">{t("about.heroA")}<br /><em>{t("about.heroB")}</em></h1></div>
          <p className="page-intro">{t("about.lead")}</p>
        </div>
      </section>
      <section className="section-block">
        <div className="section-shell tasting-note-layout">
          <div><p className="eyebrow">{t("about.principle")}</p><h2 className="display-title mt-4">{t("about.titleA")} <em>{t("about.titleB")}</em></h2></div>
          <div className="intro-copy"><p>{t("about.p1")}</p><p>{t("about.p2")}</p><p>{t("about.p3")}</p></div>
        </div>
      </section>
    </>
  );
}
