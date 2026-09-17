"use client";

import Link from "next/link";
import { BookOpen, Building2, Home, Image, LayoutDashboard, Leaf, Settings, Text, WandSparkles } from "lucide-react";
import { useT } from "next-i18next/client";
import { usePathname } from "next/navigation";
import { stripLocalePrefix, withLocalePath } from "@/lib/i18n/routing";

export function AdminSidebar() {
  const { t, i18n } = useT("common");
  const lng = i18n.resolvedLanguage ?? i18n.language ?? "vi";
  const pathname = stripLocalePrefix(usePathname());
  const links = [
    [t("admin.dashboard"), "/admin", LayoutDashboard],
    [t("admin.matcha"), "/admin/matcha", Leaf],
    [t("admin.brands"), "/admin/brands", Building2],
    [t("admin.guide"), "/admin/guide", BookOpen],
    [t("admin.homepage"), "/admin/homepage", Home],
    [t("admin.about"), "/admin/about", Text],
    [t("admin.media"), "/admin/media", Image],
    [t("admin.settings"), "/admin/settings", Settings],
  ] as const;

  return (
    <aside className="admin-sidebar">
      <Link href={withLocalePath("/admin", lng)} className="admin-brand">
        <span className="admin-brand__mark">抹</span>
        <span><strong>{t("admin.brand")}</strong><small>{t("admin.tagline")}</small></span>
      </Link>
      <nav className="admin-nav" aria-label={t("admin.adminNavigation")}>
        {links.map(([label, href, Icon]) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={withLocalePath(href, lng)} data-active={active || undefined}>
              <Icon size={16} strokeWidth={1.7} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar__footer">
        <div className="flex items-center gap-2"><WandSparkles size={13} /> {t("admin.sourceAware")}</div>
        <p className="mt-2">{t("admin.cacheNote")}</p>
      </div>
    </aside>
  );
}
