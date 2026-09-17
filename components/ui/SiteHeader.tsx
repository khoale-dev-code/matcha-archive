"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useT } from "next-i18next/client";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { withLocalePath } from "@/lib/i18n/routing";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const { t, i18n } = useT("common");
  const lng = i18n.resolvedLanguage ?? i18n.language ?? "vi";
  const vi = lng === "vi" || lng.startsWith("vi-");
  const [open, setOpen] = useState(false);
  const path = (href: string) => withLocalePath(href, lng);

  const nav = [
    [t("nav.explore"), "/matcha"],
    [t("nav.brands"), "/brands"],
    [t("nav.guide"), "/guide"],
    [t("nav.story"), "/about"],
    [t("nav.contact"), "/contact"],
  ] as const;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={path("/")} className={styles.brand} aria-label="MIE MATCHA home">
          MIE MATCHA
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          {nav.map(([label, href]) => (
            <Link key={href} href={path(href)}>
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href={path("/matcha#library-search")} className={styles.search} aria-label={t("nav.search")}>
            <Search size={20} strokeWidth={1.45} />
          </Link>
          <span className={styles.divider} aria-hidden="true" />
          <LanguageSwitcher compact />
          <Link href={path("/guide")} className={styles.cta}>
            {vi ? "Tĩnh tại từ một chén trà" : "Stillness in a bowl"}
          </Link>
          <button
            className={styles.menu}
            type="button"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className={styles.mobile}>
          {nav.map(([label, href]) => (
            <Link key={href} href={path(href)} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <div className={styles.mobileLanguage}><LanguageSwitcher /></div>
          <Link href={path("/guide")} className={styles.mobileCta} onClick={() => setOpen(false)}>
            {vi ? "Tĩnh tại từ một chén trà" : "Stillness in a bowl"}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
