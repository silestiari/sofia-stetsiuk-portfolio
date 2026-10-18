import { existsSync } from "node:fs";
import { join } from "node:path";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { DrawFrame } from "@/components/ui/DrawFrame";
import { HudLabel } from "@/components/ui/HudLabel";
import { SectionShell } from "@/components/ui/SectionShell";
import { HeroSceneSlot } from "./HeroSceneSlot";

// Same path as HERO_POSTER in components/three/HeroScene.tsx (a "use client" export can't be read here).
// Checked at build time so a missing poster never turns into a 404.
const POSTER = "/posters/hero-scene.webp";
const poster = existsSync(join(process.cwd(), "public", POSTER)) ? POSTER : null;

const handle = "hero-handle absolute size-1.5 bg-qa-accent opacity-(--hud-opacity)";

export function Hero() {
  const t = useTranslations("sections.hero");
  const tNav = useTranslations("nav");

  const name = (
    <>
      <span className="hero-name-line block whitespace-nowrap">{t("firstName")}</span>
      {" "}
      <span className="hero-name-line block whitespace-nowrap [--i:1]">{t("lastName")}</span>
      <DrawFrame className="hero-frame text-grid-strong" />
      {/* bounding box handles around the name (wireframe pass) */}
      <span aria-hidden="true" className={`${handle} -top-0.75 -left-0.75`} />
      <span aria-hidden="true" className={`${handle} -top-0.75 -right-0.75`} />
      <span aria-hidden="true" className={`${handle} -bottom-0.75 -left-0.75`} />
      <span aria-hidden="true" className={`${handle} -right-0.75 -bottom-0.75`} />
    </>
  );

  return (
    <SectionShell
      id="hero"
      as="h1"
      title={name}
      hudTitle={tNav("hero")}
      headingClassName="relative w-fit border border-transparent px-3 py-2 font-display text-hero font-semibold uppercase"
      className="flex min-h-[calc(100svh-var(--header-h))] items-center"
    >
      <p className="intro-rise mt-8 text-h3 font-semibold">{t("subtitle")}</p>
      <p className="intro-rise mt-3 max-w-prose text-lead text-text-2 [--i:1]">{t("tagline")}</p>

      <div className="intro-rise mt-10 flex flex-col items-start [--i:2] gap-x-4 gap-y-3 min-[30rem]:flex-row min-[30rem]:flex-wrap min-[30rem]:items-center">
        <Button href="#projects">{t("ctaWork")}</Button>
        <Button href="#showroom" variant="secondary">
          {t("ctaGallery")}
        </Button>
        <Button href="#contact" variant="ghost">
          {t("ctaContact")}
        </Button>
      </div>

      <p className="intro-rise mt-10 flex flex-wrap gap-x-4 gap-y-1 text-small text-text-2 [--i:3]">
        <span>{t("location")}</span>
        <span>{t("formats")}</span>
      </p>
      <HudLabel className="mt-6 hidden lg:block">{t("scrollHint")} ↓</HudLabel>

      <div className="relative -z-1 mt-10 h-[40svh] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-1/2">
        <HeroSceneSlot poster={poster} />
      </div>
    </SectionShell>
  );
}
