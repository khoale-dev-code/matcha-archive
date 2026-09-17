import type { TeaBrand, TeaProduct } from "@/lib/types/tea";
import { getT } from "@/i18n.server";
import { localizedText } from "@/lib/i18n/content";

export async function OriginStory({ product, brand }: { product: TeaProduct; brand: TeaBrand | null | undefined }) {
  const { t, lng } = await getT("common");
  const brandDescription = localizedText(lng, brand?.description_vi, brand?.description_en, t("origin.brandMissing"));

  return (
    <div className="origin-story">
      <div className="origin-map" aria-hidden="true">
        <div className="origin-map__circle"><span>日本</span><i /></div>
        <span className="origin-map__label">{t("origin.map")}</span>
      </div>
      <div className="origin-copy">
        <p className="eyebrow">{t("origin.eyebrow")}</p>
        <h2 className="editorial-title mt-2 text-5xl">{brand?.origin_region ?? t("origin.regionPending")}</h2>
        <p className="mt-5 leading-8 text-[color:var(--tea-brown-muted)]">{brandDescription}</p>
        <dl className="origin-facts mt-8">
          <div><dt>{t("origin.productOrigin")}</dt><dd>{product.origin_region ?? t("origin.sourceMissing")}</dd></div>
          <div><dt>{t("origin.brandRegion")}</dt><dd>{brand?.origin_region ?? t("origin.pending")}</dd></div>
          <div><dt>{t("origin.country")}</dt><dd>{brand?.origin_country ?? product.origin_country ?? t("origin.pending")}</dd></div>
        </dl>
      </div>
    </div>
  );
}
