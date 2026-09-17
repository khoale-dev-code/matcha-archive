export const supportedLocales = ["vi", "en"] as const;
export type AppLocale = (typeof supportedLocales)[number];
export const defaultLocale: AppLocale = "vi";

export function normalizeLocale(value?: string | null): AppLocale {
  return value === "en" ? "en" : "vi";
}

export function stripLocalePrefix(path: string) {
  const value = path || "/";
  return value.replace(/^\/(vi|en)(?=\/|$)/, "") || "/";
}

export function withLocalePath(path: string, locale?: string | null) {
  if (!path) return normalizeLocale(locale) === "en" ? "/en" : "/";
  if (/^(https?:|mailto:|tel:)/i.test(path) || path.startsWith("#")) return path;

  const normalized = normalizeLocale(locale);
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const queryIndex = withoutHash.indexOf("?");
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const clean = stripLocalePrefix(pathname.startsWith("/") ? pathname : `/${pathname}`);
  const localized = normalized === "en" ? `/en${clean === "/" ? "" : clean}` : clean;
  return `${localized || "/"}${query}${hash}`;
}

export function localeAlternates(path: string, locale?: string | null) {
  return {
    canonical: withLocalePath(path, locale),
    languages: {
      vi: withLocalePath(path, "vi"),
      en: withLocalePath(path, "en"),
    },
  };
}
