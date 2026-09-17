import { AdminContentEditor } from "@/components/admin/AdminContentEditor";
import { getAdminSiteContent } from "@/lib/data/admin-repository";
import { resolveAdminContent } from "@/lib/data/site-content";
import { getT } from "@/i18n.server";

export default async function AdminSettingsPage() {
  const [{ t }, record] = await Promise.all([getT("common"), getAdminSiteContent("site-settings")]);
  const initial = resolveAdminContent(record, {
    titleVi: "MIE MATCHA",
    bodyVi: "MIE MATCHA / Tasting Journal / Tea Library",
    titleEn: "MIE MATCHA",
    bodyEn: "MIE MATCHA / Tasting Journal / Tea Library",
  });
  return <div className="admin-page"><AdminContentEditor contentKey="site-settings" heading={t("admin.settings")} helper={t("admin.settingsHelper")} initial={initial} /></div>;
}
