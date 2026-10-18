import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...projects.map((p) => `/projects/${p.slug}`)];
  const abs = (locale: string, path: string) => new URL(`/${locale}${path}`, siteUrl).href;

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: abs(locale, path),
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((l) => [l, abs(l, path)])),
          "x-default": abs(routing.defaultLocale, path),
        },
      },
    })),
  );
}
