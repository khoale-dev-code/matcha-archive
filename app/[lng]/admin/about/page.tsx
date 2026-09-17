import { AdminContentEditor } from "@/components/admin/AdminContentEditor";
import { getAdminSiteContent } from "@/lib/data/admin-repository";
import { resolveAdminContent } from "@/lib/data/site-content";
import { getT } from "@/i18n.server";

export default async function AdminAboutPage() {
  const [{ t }, record] = await Promise.all([getT("common"), getAdminSiteContent("about")]);
  const initial = resolveAdminContent(record, {
    titleVi: "Một cách chậm hơn để nhìn vào Matcha.",
    bodyVi: "Khám phá trước giao dịch. Tập trung vào nguồn gốc, tasting và nghi thức.",
    titleEn: "A slower way to look.",
    bodyEn: "Discovery before transaction. A tea archive focused on origin, tasting and ritual.",
  });
  return <div className="admin-page"><AdminContentEditor contentKey="about" heading={t("admin.about")} helper={t("admin.aboutHelper")} initial={initial} /></div>;
}
