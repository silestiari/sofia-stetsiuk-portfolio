import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { HudLabel } from "@/components/ui/HudLabel";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tMeta = await getTranslations("meta");
  const title = t("title");

  return (
    <section className="page-container py-(--section-y)">
      {/* Nested not-found.tsx can't export metadata; React 19 hoists <title> into <head>. */}
      <title>{`${title} — ${tMeta("siteName")}`}</title>
      <HudLabel>
        <span className="text-qa-accent">404</span> / {t("hud")}
      </HudLabel>
      {/* "broken page": RGB-split slices, one burst on load; the copies are aria-hidden, off under reduced motion */}
      <h1 className="mt-6 font-display text-display font-bold uppercase">
        <span className="glitch">
          {title}
          <span aria-hidden="true" className="glitch-a">
            {title}
          </span>
          <span aria-hidden="true" className="glitch-b">
            {title}
          </span>
        </span>
      </h1>
      <p className="mt-6 max-w-prose text-lead font-light text-text">{t("description")}</p>
      <div className="mt-8">
        <Button href="/" variant="secondary">
          <span aria-hidden="true">←</span> {t("backHome")}
        </Button>
      </div>
    </section>
  );
}
