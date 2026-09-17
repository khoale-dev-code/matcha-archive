import { AdminBrandManager } from "@/components/admin/AdminBrandManager";
import { getAdminTeaBrands } from "@/lib/data/admin-repository";
import { getT } from "@/i18n.server";

export default async function AdminBrandsPage() {
  const [{ t }, brands] = await Promise.all([getT("common"), getAdminTeaBrands()]);
  return <div className="admin-page"><div className="admin-page-head"><div><h1>{t("admin.brandsTitle")}</h1><p>{t("admin.brandsLead")}</p></div></div><AdminBrandManager initialBrands={brands} /></div>;
}
