"use client";

import Link from "next/link";
import { ExternalLink, Wifi, WifiOff } from "lucide-react";
import { useT } from "next-i18next/client";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { withLocalePath } from "@/lib/i18n/routing";

export function AdminTopbar({ connected }: { connected: boolean }) {
  const { t, i18n } = useT("common");
  const lng = i18n.resolvedLanguage ?? i18n.language ?? "vi";
  return (
    <div className="admin-topbar">
      <div className="admin-topbar__title">
        <strong>{t("admin.workspace")}</strong>
        <span className={`admin-connection ${connected ? "is-connected" : ""}`}>
          {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
          {connected ? t("admin.connected") : t("admin.seed")}
        </span>
      </div>
      <div className="admin-topbar__actions">
        <Link href={withLocalePath("/", lng)} className="admin-view-site" target="_blank">
          {t("admin.viewSite")} <ExternalLink size={13} />
        </Link>
        <LanguageSwitcher admin />
      </div>
    </div>
  );
}
