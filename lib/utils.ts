export function formatReferencePrice(price: number | null, unit: string | null) {
  if (price == null) return "Chưa cập nhật";
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ${unit ? ` / ${unit}` : ""}`;
}

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
