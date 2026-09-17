"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useT } from "next-i18next/client";
import type { TeaProduct } from "@/lib/types/tea";
import { PriceReference } from "@/components/ui/PriceReference";
import { teaProfileHref } from "@/lib/routes";
import { localizedText } from "@/lib/i18n/content";
import { withLocalePath } from "@/lib/i18n/routing";
import { resolveProductMedia } from "@/lib/data/product-media";

export function MatchaCard({ product, index = 0 }: { product: TeaProduct; index?: number }) {
  const { t, i18n } = useT("common");
  const lng = i18n.resolvedLanguage ?? i18n.language ?? "vi";
  const href = withLocalePath(teaProfileHref(product), lng);
  const tasting = localizedText(lng, product.tasting_summary_vi, product.tasting_summary_en);
  const media = resolveProductMedia(product);

  return (
    <article className="matcha-card group">
      <Link href={href} className="matcha-card__visual" aria-label={t("card.ariaExplore", { name: product.name })}>
        <span className="matcha-card__index">{String(index + 1).padStart(2, "0")}</span>
        {media ? (
          <Image
            src={media.src}
            alt={lng === "vi" ? media.altVi : media.altEn}
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 31vw"
            quality={90}
            className={media.source === "curated" ? "object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.015]" : "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"}
          />
        ) : null}
      </Link>
      <div className="matcha-card__body">
        <div className="matcha-card__meta">
          <span>{product.brand?.name ?? t("card.teaHouse")}</span>
          <span>{t(`teaTypes.${product.tea_type}`).toUpperCase()}</span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-5">
          <div>
            {product.japanese_name ? <p className="jp-name text-3xl">{product.japanese_name}</p> : null}
            <h3 className="editorial-title mt-1 text-4xl leading-none">{product.name}</h3>
          </div>
          <ArrowUpRight size={20} strokeWidth={1.4} className="mt-2 shrink-0" />
        </div>
        <p className="mt-5 line-clamp-3 min-h-[4.8rem] text-sm leading-6 text-[color:var(--tea-brown-muted)]">{tasting}</p>
        <div className="tag-row mt-5">
          {product.tasting_notes.slice(0, 3).map((note) => <span key={note} className="taste-tag">{note}</span>)}
        </div>
        <div className="mt-6 border-t border-[color:var(--line)] pt-5">
          <PriceReference price={product.price} unit={product.price_unit} note={product.price_note} compact />
        </div>
        <Link href={href} className="text-link mt-5 inline-flex items-center gap-2">
          {t("card.explore")} <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
