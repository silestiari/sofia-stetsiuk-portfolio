import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionObserver } from "@/components/layout/MotionObserver";
import { RenderPassFallback } from "@/components/layout/RenderPassFallback";
import { ToastProvider } from "@/components/ui/Toast";
import { routing } from "@/i18n/routing";
import { localeAlternates, siteUrl } from "@/lib/seo";
import "../globals.css";

const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], display: "swap", variable: "--font-unbounded" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], display: "swap", variable: "--font-manrope" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  const alternateLocale = await Promise.all(
    routing.locales
      .filter((l) => l !== locale)
      .map(async (l) => (await getTranslations({ locale: l, namespace: "meta" }))("ogLocale")),
  );

  return {
    metadataBase: siteUrl,
    title: { default: t("title"), template: `%s — ${t("siteName")}` },
    description: t("description"),
    alternates: localeAlternates(locale),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
      locale: t("ogLocale"),
      alternateLocale,
      url: `/${locale}`,
    },
    // og:image comes from ./opengraph-image.tsx
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${unbounded.variable} ${manrope.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {/* ponytail: provider passes all messages to the client; pick() namespaces when the dictionary grows */}
        <NextIntlClientProvider>
          <ToastProvider>
            <Header />
            <main id="content" tabIndex={-1} className="flex-1">
              {children}
            </main>
            <Footer />
            <RenderPassFallback />
            <MotionObserver />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
