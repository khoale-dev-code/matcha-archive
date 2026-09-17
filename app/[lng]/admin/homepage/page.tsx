import { AdminContentEditor } from "@/components/admin/AdminContentEditor";
import { HomepageMediaEditor } from "@/components/admin/HomepageMediaEditor";
import { getAdminSiteContent } from "@/lib/data/admin-repository";
import { resolveAdminContent } from "@/lib/data/site-content";
import { resolveHomepageMedia } from "@/lib/data/homepage-media.shared";
import { getT } from "@/i18n.server";

export default async function AdminHomepagePage() {
  const [{ t }, record] = await Promise.all([getT("common"), getAdminSiteContent("homepage")]);
  const initial = resolveAdminContent(record, {
    titleVi: "MATCHA, KHÔNG CHỈ LÀ MÀU XANH.",
    bodyVi: "Một kho lưu trữ yên tĩnh về matcha Nhật Bản, tasting profile và nghi thức pha trà.",
    titleEn: "MATCHA, NOT JUST GREEN.",
    bodyEn: "A quiet archive of Japanese matcha, tasting profiles and tea ritual.",
  });
  const media = resolveHomepageMedia(record?.payload);

  return (
    <div className="admin-page grid gap-[26px]">
      <AdminContentEditor
        contentKey="homepage"
        heading={t("admin.homepage")}
        helper={t("admin.homepageHelper")}
        initial={initial}
      />
      <HomepageMediaEditor initial={media} />
    </div>
  );
}
