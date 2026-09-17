import Link from "next/link";
import { getT } from "@/i18n.server";
import { withLocalePath } from "@/lib/i18n/routing";

export default async function NotFound() {
  const { t, lng } = await getT("common");
  return <main className="min-h-screen bg-[color:var(--paper)] px-6 py-24 text-[color:var(--tea-brown)]"><div className="mx-auto max-w-4xl border border-[color:var(--line)] p-10 md:p-16"><p className="eyebrow">{t("notFound.eyebrow")}</p><div className="jp-name mt-8 text-8xl">余白</div><h1 className="editorial-title mt-4 text-7xl">{t("detail.dataMissing")}</h1><p className="mt-6 max-w-lg text-sm leading-7 text-[color:var(--tea-brown-muted)]">{t("library.noResultCopy")}</p><Link href={withLocalePath("/matcha", lng)} className="button button--dark mt-8">{t("detail.fullLibrary")}</Link></div></main>;
}
