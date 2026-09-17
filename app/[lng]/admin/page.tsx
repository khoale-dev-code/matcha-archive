import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAdminTeaBrands, getAdminTeaProducts } from "@/lib/data/admin-repository";
import { getT } from "@/i18n.server";
import { withLocalePath } from "@/lib/i18n/routing";

export default async function AdminDashboard() {
  const [{ t, lng }, brands, products] = await Promise.all([getT("common"), getAdminTeaBrands(), getAdminTeaProducts()]);
  const matcha = products.filter((item) => item.tea_type === "matcha");
  const incomplete = products.filter((item) => item.price == null || item.body_score == null || !item.recommended_for.length);
  const missingEn = products.filter((item) => !item.tasting_summary_en && !item.description_en);
  return (
    <div className="admin-page">
      <div className="admin-page-head"><div><h1>{t("admin.dashboardTitle")}</h1><p>{t("admin.dashboardLead")}</p></div><Link href={withLocalePath("/admin/matcha", lng)} className="admin-button admin-button--ghost">{t("admin.matcha")} <ArrowUpRight size={14} /></Link></div>
      <div className="admin-grid-cards">
        <div className="admin-stat"><span>{t("admin.matchaProfiles")}</span><strong>{matcha.length}</strong><small>{t("admin.totalProfiles", { count: products.length })}</small></div>
        <div className="admin-stat"><span>{t("admin.teaBrands")}</span><strong>{brands.length}</strong><small>{t("admin.translationOverview")}</small></div>
        <div className="admin-stat"><span>{t("admin.needsEnrichment")}</span><strong>{incomplete.length}</strong><small>{t("admin.logicFields")}</small></div>
        <div className="admin-stat"><span>{t("admin.enPending")}</span><strong>{missingEn.length}</strong><small>{t("admin.contentMissingHint")}</small></div>
      </div>
      <div className="admin-panel mt-4">
        <div className="admin-panel__head"><strong>{t("admin.sourceStatus")}</strong><span>{t("admin.sourceSeed")}</span></div>
        <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>{t("admin.profile")}</th><th>{t("admin.brandCol")}</th><th>VI</th><th>EN</th><th>{t("admin.score")}</th><th>{t("admin.price")}</th><th>{t("admin.brewing")}</th></tr></thead>
          <tbody>{products.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.brand?.name ?? "—"}</td><td><Status ready={Boolean(item.tasting_summary_vi || item.description_vi)} t={t} /></td><td><Status ready={Boolean(item.tasting_summary_en || item.description_en)} t={t} /></td><td><Status ready={item.body_score != null} t={t} /></td><td><Status ready={item.price != null} t={t} /></td><td><Status ready={item.recommended_for.length > 0} t={t} /></td></tr>)}</tbody>
        </table></div>
      </div>
    </div>
  );
}

function Status({ ready, t }: { ready: boolean; t: (key: string) => string }) {
  return <span className={`admin-table-status ${ready ? "is-ready" : ""}`}>{ready ? t("admin.ready") : t("admin.pending")}</span>;
}
