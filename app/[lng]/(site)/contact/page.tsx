import type { Metadata } from "next";
import { getT } from "@/i18n.server";
import { localeAlternates } from "@/lib/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const { t, lng } = await getT("common");
  return { title: t("contact.metaTitle"), description: t("contact.metaDescription"), alternates: localeAlternates("/contact", lng) };
}

export default async function ContactPage() {
  const { t } = await getT("common");
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <>
      <section className="page-hero">
        <div className="section-shell page-hero__grid">
          <div><p className="eyebrow">{t("contact.eyebrow")}</p><h1 className="page-title mt-6">{t("contact.heroA")}<br /><em>{t("contact.heroB")}</em></h1></div>
          <p className="page-intro">{t("contact.lead")}</p>
        </div>
      </section>
      <section className="section-block">
        <div className="section-shell contact-grid">
          <div>
            <p className="eyebrow">{t("contact.channel")}</p>
            <h2 className="editorial-title mt-3 text-6xl">{t("contact.title")}</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[color:var(--tea-brown-muted)]">
              {email ? <>{t("common.email")}: <a className="text-link" href={`mailto:${email}`}>{email}</a></> : t("contact.emailMissing")}
            </p>
          </div>
          <div className="contact-panel">
            <form className="form-grid" action={email ? `mailto:${email}` : undefined}>
              <div className="form-field"><label>{t("contact.name")}</label><input name="name" placeholder={t("contact.namePlaceholder")} /></div>
              <div className="form-field"><label>{t("contact.email")}</label><input type="email" name="email" placeholder="you@example.com" /></div>
              <div className="form-field"><label>{t("contact.note")}</label><textarea name="message" rows={7} placeholder={t("contact.notePlaceholder")} /></div>
              <button className="button button--dark" type="submit" disabled={!email}>{email ? t("contact.prepare") : t("contact.notConfigured")}</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
