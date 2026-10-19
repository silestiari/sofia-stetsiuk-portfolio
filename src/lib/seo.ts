import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

// On Vercel, VERCEL_PROJECT_PRODUCTION_URL is the production domain (a custom one once it is added).
const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? vercelProd ?? "http://localhost:3000");

/** canonical + hreflang (en/ru/x-default) for a path without locale prefix, e.g. "" or "/projects/foo". */
export function localeAlternates(locale: Locale, path = ""): Metadata["alternates"] {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
      "x-default": `/${routing.defaultLocale}${path}`,
    },
  };
}
