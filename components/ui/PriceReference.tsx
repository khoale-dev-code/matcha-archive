"use client";

import { useT } from "next-i18next/client";

export function PriceReference({
  price,
  unit,
  note,
  compact = false,
}: {
  price: number | null;
  unit: string | null;
  note: string | null;
  compact?: boolean;
}) {
  const { t, i18n } = useT("common");
  const lng = i18n.resolvedLanguage ?? i18n.language ?? "vi";
  const formatted = price == null
    ? t("price.unknown")
    : lng === "en"
      ? `${new Intl.NumberFormat("en-US").format(price)} VND${unit ? ` / ${unit}` : ""}`
      : `${new Intl.NumberFormat("vi-VN").format(price)}đ${unit ? ` / ${unit}` : ""}`;

  return (
    <div className={compact ? "price-reference price-reference--compact" : "price-reference"}>
      <span>{t("price.label")}</span>
      <strong>{formatted}</strong>
      {note ? <small>{note}</small> : price == null ? <small>{t("price.pending")}</small> : null}
    </div>
  );
}
