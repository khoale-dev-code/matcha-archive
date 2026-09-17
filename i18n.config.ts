import type { I18nConfig } from "next-i18next/proxy";

const i18nConfig: I18nConfig & { showSupportNotice?: boolean } = {
  supportedLngs: ["vi", "en"],
  fallbackLng: "vi",
  showSupportNotice: false,
  defaultNS: "common",
  ns: ["common"],
  hideDefaultLocale: true,
  cookieName: "matcha_locale",
  cookieMaxAge: 60 * 60 * 24 * 365,
  resourceLoader: (language, namespace) =>
    import(`./app/i18n/locales/${language}/${namespace}.json`),
};

export default i18nConfig;
