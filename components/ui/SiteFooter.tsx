"use client";

import Link from "next/link";
import { useT } from "next-i18next/client";
import { withLocalePath } from "@/lib/i18n/routing";

export function SiteFooter() {
  const { t, i18n } = useT("common");
  const lng = i18n.resolvedLanguage ?? i18n.language ?? "vi";
  const path = (href: string) => withLocalePath(href, lng);
  return (
    <footer className="site-footer">
      <div className="section-shell site-footer__grid">
        <div>
          <div className="brand-mark brand-mark--footer">
            <span className="brand-mark__jp">抹</span>
            <span className="brand-mark__text">MIE MATCHA</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-[color:var(--tea-brown-muted)]">{t("footer.copy")}</p>
        </div>
        <div className="footer-links">
          <Link href={path("/matcha")}>{t("footer.matcha")}</Link>
          <Link href={path("/brands")}>{t("footer.brands")}</Link>
          <Link href={path("/guide")}>{t("footer.guide")}</Link>
          <Link href={path("/about")}>{t("footer.story")}</Link>
          <Link href={path("/contact")}>{t("footer.contact")}</Link>
        </div>
        <div className="footer-note">
          <span>{t("footer.index")}</span>
          <strong>{t("footer.japan")}</strong>
          <p>{t("footer.priceNote")}</p>
        </div>
      </div>
    </footer>
  );
}
