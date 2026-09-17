import type { Metadata } from "next";
import { getT } from "@/i18n.server";
import { localeAlternates } from "@/lib/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const { t, lng } = await getT("common");
  return { title: t("guide.metaTitle"), description: t("guide.metaDescription"), alternates: localeAlternates("/guide", lng) };
}

export default async function GuidePage() {
  const { t } = await getT("common");
  return (
    <>
      <section className="page-hero">
        <div className="section-shell page-hero__grid">
          <div><p className="eyebrow">{t("guide.eyebrow")}</p><h1 className="page-title mt-6">{t("guide.heroA")}<br /><em>{t("guide.heroB")}</em></h1></div>
          <p className="page-intro">{t("guide.lead")}</p>
        </div>
      </section>
      <section className="section-block">
        <div className="section-shell guide-grid">
          <article className="guide-card"><span className="guide-card__jp">薄茶</span><h2>Usucha</h2><p>{t("guide.usucha")}</p></article>
          <article className="guide-card"><span className="guide-card__jp">濃茶</span><h2>Koicha</h2><p>{t("guide.koicha")}</p></article>
          <article className="guide-card"><span className="guide-card__jp">茶乳</span><h2>Latte</h2><p>{t("guide.latte")}</p></article>
        </div>
      </section>
      <section className="section-block pt-0">
        <div className="section-shell guide-note">
          <div><p className="eyebrow">{t("guide.method")}</p><h2 className="editorial-title mt-3 text-6xl">{t("guide.methodTitle")}</h2></div>
          <div><p>{t("guide.methodCopy")}</p><p className="mt-5">{t("guide.sourceNote")}</p></div>
        </div>
      </section>
    </>
  );
}
