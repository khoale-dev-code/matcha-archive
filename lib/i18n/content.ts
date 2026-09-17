export type AppLocale = "vi" | "en";

export function normalizeLocale(value?: string | null): AppLocale {
  return value === "en" ? "en" : "vi";
}

export function localizedText(
  locale: string | undefined,
  vietnamese: string | null | undefined,
  english: string | null | undefined,
  fallback = "",
) {
  const lng = normalizeLocale(locale);
  if (lng === "en") return english || vietnamese || fallback;
  return vietnamese || english || fallback;
}
