import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

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
