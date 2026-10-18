# Architecture

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS v4 · next-intl 4.

## Structure

```
src/
  proxy.ts                     # "/" and unprefixed paths -> /<cookie NEXT_LOCALE | en>/...
  i18n/
    routing.ts                 # locales en|ru, default en, cookie name
    request.ts                 # next-intl config: locale from next/root-params, loads messages
    navigation.ts              # locale-aware Link/usePathname/useRouter
    global.d.ts                # typed message keys (from en.json)
  messages/en.json, ru.json    # UI dictionaries (nav, sections, project, notFound, footer, meta)
  content/
    types.ts                   # Project, Model3D, Localized<T>
    projects.ts                # project data (verified facts only)
    sections.ts                # home section ids/order (anchors + message keys)
  lib/seo.ts                   # siteUrl (NEXT_PUBLIC_SITE_URL), canonical + hreflang helper
  components/LanguageSwitcher.tsx  # client; same path in other locale
  app/
    [locale]/layout.tsx        # root layout: <html lang>, generateMetadata, generateStaticParams
    [locale]/page.tsx          # one-page home, sections with ids
    [locale]/projects/[slug]/page.tsx  # case study, static params from content/projects.ts
    [locale]/not-found.tsx     # localized 404
    [locale]/[...rest]/page.tsx  # unknown paths -> localized 404
    sitemap.ts, robots.ts
e2e/                           # Playwright tests (npm run test:e2e, builds must exist: npm run build)
```

## i18n

- URLs are always prefixed: `/en`, `/ru`. `/` redirects to the locale from the `NEXT_LOCALE` cookie, otherwise `en` (Accept-Language is ignored on purpose).
- `LanguageSwitcher` uses next-intl `Link` with `locale`, which keeps the current path and writes `NEXT_LOCALE`.
- Locale is the root param `[locale]`; server code reads it via `getLocale()` / `getTranslations()` (next/root-params), no `setRequestLocale` needed. Pages are statically generated for both locales.
- Message keys are type-checked against `en.json`; `ru.json` must have the same shape.

## Data

- UI strings: `src/messages/*.json`. Content (projects, 3D models): `src/content/*`, localized fields are `{ en, ru }`.
- No hardcoded copy in components. Only verified facts in content; unknown status = `"unconfirmed"`.

## SEO

`generateMetadata` per locale: title, description, Open Graph (locale + alternateLocale), canonical and `alternates.languages` (en, ru, x-default). `metadataBase` = `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`, see `.env.example`). `sitemap.xml` lists every page in both locales with hreflang alternates.

## 3D

`three`, `@react-three/fiber`, `@react-three/drei` are installed but must only be loaded via `next/dynamic` (`ssr: false`) when the showroom section enters the viewport.

## Notes

- `cacheComponents` (create-next-app default) is off: the site is fully static SSG, it isn't needed.
- 404 HTML for `notFound()` is streamed by Next as an error shell and rendered on the client (status is 404, localized text appears after hydration).

## Scripts

`dev`, `build`, `start`, `lint`, `typecheck` (tsc --noEmit), `test:e2e` (Playwright; starts `next start` on :3100).
