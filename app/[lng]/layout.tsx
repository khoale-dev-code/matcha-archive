import type { Metadata, Viewport } from "next";
import { I18nProvider } from "next-i18next/client";
import { generateI18nStaticParams } from "next-i18next/server";
import { getResources, getT } from "@/i18n.server";
import { normalizeLocale } from "@/lib/i18n/routing";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateStaticParams() {
  return generateI18nStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng: rawLng } = await params;
  const lng = normalizeLocale(rawLng);
  const { t } = await getT("common", { lng });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("meta.title"), template: "%s | MIE MATCHA" },
    description: t("meta.description"),
    openGraph: {
      type: "website",
      locale: lng === "vi" ? "vi_VN" : "en_US",
      title: "MIE MATCHA",
      description: t("meta.description"),
      siteName: "MIE MATCHA",
    },
  };
}

export const viewport: Viewport = { themeColor: "#EDEAE5", colorScheme: "light" };

export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ lng: string }> }>) {
  const { lng: rawLng } = await params;
  const lng = normalizeLocale(rawLng);
  const { i18n } = await getT("common", { lng });
  const resources = getResources(i18n, ["common"], [lng, "vi"]);

  return (
    <html lang={lng}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Noto+Serif+JP:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <I18nProvider language={lng} resources={resources}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
