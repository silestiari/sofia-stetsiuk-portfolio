import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { color } from "@/lib/tokens";

// Home OG card, 1200×630, per locale. Static TTFs (OFL, Google Fonts) live in src/app/fonts so the build needs no network.
const size = { width: 1200, height: 630 };
const localeOf = (l: string) => (hasLocale(routing.locales, l) ? l : routing.defaultLocale);

export async function generateImageMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale: localeOf(locale), namespace: "meta" });
  return [{ id: "home", alt: t("ogImageAlt"), size, contentType: "image/png" }];
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const locale = localeOf((await params).locale);
  const t = await getTranslations({ locale, namespace: "sections.hero" });
  const fonts = join(process.cwd(), "src/app/fonts");
  const [display, sans] = await Promise.all([
    readFile(join(fonts, "Unbounded-SemiBold.ttf")),
    readFile(join(fonts, "Manrope-Medium.ttf")),
  ]);
  const grid = `${color.text}12`; // --color-grid (text at 7%)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: color.bg,
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
          color: color.text,
          fontFamily: "Manrope",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, color: color.text3 }}>
          {"00 / PORTFOLIO · SS_"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "flex-start",
              padding: "8px 16px",
              border: `2px solid ${color.text}24`,
              fontFamily: "Unbounded",
              fontSize: 128,
              lineHeight: 0.95,
              letterSpacing: -4,
            }}
          >
            <span>{t("firstName")}</span>
            <span>{t("lastName")}</span>
          </div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 44, color: color.accent }}>{t("subtitle")}</div>
          <div style={{ display: "flex", marginTop: 12, fontSize: 30, color: color.text2 }}>{t("tagline")}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Unbounded", data: display, weight: 600, style: "normal" },
        { name: "Manrope", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
