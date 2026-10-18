import { defineRouting } from "next-intl/routing";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: "en",
  localePrefix: "always",
  localeCookie: { name: LOCALE_COOKIE, maxAge: 60 * 60 * 24 * 365 },
});

export type Locale = (typeof routing.locales)[number];
