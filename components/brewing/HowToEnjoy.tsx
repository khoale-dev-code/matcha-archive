import type { TeaProduct } from "@/lib/types/tea";
import { getT } from "@/i18n.server";

export async function HowToEnjoy({ product }: { product: TeaProduct }) {
  const { t } = await getT("common");
  const hasBrewing =
    product.recommended_for.length > 0 ||
    product.brewing_matcha_grams != null ||
    product.brewing_water_ml != null ||
    product.brewing_temperature ||
    product.brewing_time;

  if (!hasBrewing) {
    return (
      <div className="enjoy-empty">
        <span className="jp-name">点前</span>
        <div>
          <p className="eyebrow">{t("enjoy.eyebrow")}</p>
          <h2 className="editorial-title mt-2 text-5xl">{t("enjoy.openTitle")}</h2>
          <p className="mt-5 max-w-2xl leading-7 text-[color:var(--tea-brown-muted)]">{t("enjoy.openCopy")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enjoy-panel">
      <div><p className="eyebrow">{t("enjoy.eyebrow")}</p><h2 className="editorial-title mt-2 text-5xl">{t("enjoy.suggested")}</h2></div>
      <div className="enjoy-grid mt-8">
        <Info label={t("enjoy.bestAs")} value={product.recommended_for.join(" · ") || null} />
        <Info label={t("enjoy.matcha")} value={product.brewing_matcha_grams != null ? `${product.brewing_matcha_grams}g` : null} />
        <Info label={t("enjoy.water")} value={product.brewing_water_ml != null ? `${product.brewing_water_ml}ml` : null} />
        <Info label={t("enjoy.temperature")} value={product.brewing_temperature} />
        <Info label={t("enjoy.whisk")} value={product.brewing_time} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return <div className="enjoy-info"><span>{label}</span><strong>{value ?? "—"}</strong></div>;
}
