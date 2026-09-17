import { AdminTeaManager } from "@/components/admin/AdminTeaManager";
import { getAdminTeaBrands, getAdminTeaProducts } from "@/lib/data/admin-repository";
import { getT } from "@/i18n.server";

export default async function AdminMatchaPage() {
  const [{ t }, products, brands] = await Promise.all([getT("common"), getAdminTeaProducts(), getAdminTeaBrands()]);
  return (
    <div className="admin-page">
      <div className="admin-page-head"><div><h1>{t("admin.profilesTitle")}</h1><p>{t("admin.profilesLead")}</p></div></div>
      <AdminTeaManager initialProducts={products} brands={brands} />
    </div>
  );
}
