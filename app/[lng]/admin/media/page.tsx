import { MediaUploader } from "@/components/admin/MediaUploader";
import { getT } from "@/i18n.server";
export default async function AdminMediaPage() { const { t } = await getT("common"); return <div className="admin-page"><div className="admin-page-head"><div><h1>{t("admin.mediaTitle")}</h1><p>{t("admin.mediaLead")}</p></div></div><MediaUploader /></div>; }
