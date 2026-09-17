import type { SiteContentRecord } from "@/lib/types/tea";

type LocalizedBlock = { title?: string; body?: string };
type I18nPayload = { i18n?: { vi?: LocalizedBlock; en?: LocalizedBlock } };

export function resolveAdminContent(
  record: SiteContentRecord | null,
  defaults: { titleVi: string; bodyVi: string; titleEn: string; bodyEn: string },
) {
  const payload = (record?.payload ?? {}) as I18nPayload;
  return {
    titleVi: payload.i18n?.vi?.title ?? record?.title ?? defaults.titleVi,
    bodyVi: payload.i18n?.vi?.body ?? record?.body ?? defaults.bodyVi,
    titleEn: payload.i18n?.en?.title ?? defaults.titleEn,
    bodyEn: payload.i18n?.en?.body ?? defaults.bodyEn,
  };
}
