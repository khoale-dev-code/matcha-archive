import { AdminContentEditor } from "@/components/admin/AdminContentEditor";
import { getAdminSiteContent } from "@/lib/data/admin-repository";
import { resolveAdminContent } from "@/lib/data/site-content";
import { getT } from "@/i18n.server";

export default async function AdminGuidePage() {
  const [{ t }, record] = await Promise.all([getT("common"), getAdminSiteContent("brewing-guide")]);
  const initial = resolveAdminContent(record, {
    titleVi: "Rây. Nước. Đánh. Cảm nhận.",
    bodyVi: "Chỉ dùng thông số pha có nguồn. Các giá trị theo từng profile có thể để trống khi chưa xác minh.",
    titleEn: "Sift. Water. Whisk. Notice.",
    bodyEn: "Use sourced brewing data where available; keep per-profile values empty when unverified.",
  });
  return <div className="admin-page"><AdminContentEditor contentKey="brewing-guide" heading={t("admin.guide")} helper={t("admin.guideHelper")} initial={initial} /></div>;
}
