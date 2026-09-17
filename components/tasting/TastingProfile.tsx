import type { TeaProduct } from "@/lib/types/tea";
import { TastingMeter } from "@/components/tasting/TastingMeter";
import { getT } from "@/i18n.server";

export async function TastingProfile({ product }: { product: TeaProduct }) {
  const { t } = await getT("common");
  const scores = [
    [t("tastingProfile.umami"), product.umami_score],
    [t("tastingProfile.sweetness"), product.sweetness_score],
    [t("tastingProfile.bitterness"), product.bitterness_score],
    [t("tastingProfile.body"), product.body_score],
    [t("tastingProfile.creaminess"), product.creaminess_score],
  ] as const;
  const hasScore = scores.some(([, value]) => value != null);

  return (
    <div className="profile-panel">
      <div className="profile-panel__head">
        <div><p className="eyebrow">{t("tastingProfile.eyebrow")}</p><h2 className="editorial-title mt-2 text-5xl">{t("tastingProfile.title")}</h2></div>
        {!hasScore ? <span className="source-badge">{t("tastingProfile.awaiting")}</span> : null}
      </div>
      <div className="profile-score-grid mt-8">
        {scores.map(([label, value]) => <TastingMeter key={label} label={label} value={value} />)}
      </div>
      {!hasScore ? <p className="data-note mt-8">{t("tastingProfile.note")}</p> : null}
    </div>
  );
}
