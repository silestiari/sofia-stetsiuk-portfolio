import createMiddleware from "next-intl/middleware";
import { hasLocale } from "next-intl";
import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  // No locale prefix: redirect to the saved locale (cookie) or the default.
  // Accept-Language is intentionally ignored.
  if (!hasLocale(routing.locales, firstSegment)) {
    const saved = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale = hasLocale(routing.locales, saved) ? saved : routing.defaultLocale;
    const url = new URL(`/${locale}${pathname === "/" ? "" : pathname}${search}`, request.url);
    return NextResponse.redirect(url);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Skip Next internals, API and files with an extension (sitemap.xml, robots.txt, assets).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
