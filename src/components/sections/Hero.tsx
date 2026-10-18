import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Crosshair } from "@/components/ui/Crosshair";
import { HudLabel } from "@/components/ui/HudLabel";
import { passStyle } from "@/components/ui/SectionShell";
import { HeroSceneSlot } from "./HeroSceneSlot";

const role = "hud text-mono-xs inline-flex h-7 items-center rounded-full border border-line-strong bg-bg px-3 text-text-2";

/**
 * Hero (docs/REDESIGN_UX_SPEC.md 4.1): the BugHunt game is the "frame" inside a charcoal panel, the name lies over it
 * (pointer-events-none, so bugs stay clickable). One pink CTA. Desktop: roles/tagline, the 3D gallery circle and the
 * CTA sit inside the frame; mobile: roles/tagline above it, buttons full-width below. One DOM order for all sizes:
 * h1 → Explore → 3D gallery → Contact.
 */
export function Hero() {
  const t = useTranslations("sections.hero");
  const tNav = useTranslations("nav");
  const { pass, style } = passStyle("hero");
  const hint = `${t("gameHint")} →`;

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      data-pass={pass}
      style={style}
      className="pass-section pt-4 pb-16 lg:pt-6 lg:pb-24"
    >
      <div className="page-container">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <HudLabel>
            <span className="text-qa-accent">00</span> / {tNav("hero")}
          </HudLabel>
          <HudLabel>{t("location")}</HudLabel>
          <HudLabel className="hidden md:inline-block">{t("formats")}</HudLabel>
        </div>

        <div className="relative mt-4 lg:mb-16">
          {/* roles + tagline: above the frame on mobile, top-left inside it on lg */}
          <div className="intro-rise pointer-events-none mb-4 lg:absolute lg:top-12 lg:left-12 lg:z-(--z-raised) lg:mb-0">
            <p className="flex flex-wrap gap-2">
              <span className={role}>{t("roleA")}</span>
              <span className={role}>{t("roleB")}</span>
            </p>
            <p className="mt-4 max-w-[24ch] text-lead font-light text-text">{t("tagline")}</p>
          </div>

          <div className="bg-panel p-2 md:p-4 lg:p-6">
            <div className="relative aspect-[4/5] max-h-[62svh] w-full bg-bg md:aspect-video lg:aspect-auto lg:h-[min(76svh,820px)] lg:max-h-none">
              <HeroSceneSlot labels={{ counter: t("gameCounter"), fixed: t("gameFixed"), allFixed: t("gameAllFixed") }} />
              <Crosshair rows={1} cols={2} />
              <span aria-hidden="true" className="absolute top-3 left-4 max-w-[55%] lg:hidden">
                <HudLabel>{hint}</HudLabel>
              </span>
              <h1
                id="hero-title"
                tabIndex={-1}
                className="pointer-events-none absolute bottom-4 left-4 font-display text-hero font-extrabold uppercase md:bottom-6 md:left-6 lg:bottom-8 lg:left-8 lg:text-[clamp(5.5rem,15.4vw-4.35rem,10rem)]"
              >
                <span className="mask-line">
                  <span>{t("firstName")}</span>
                </span>{" "}
                <span className="mask-line [--i:1]">
                  <span>{t("lastName")}</span>
                </span>
              </h1>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 min-[30rem]:flex-row min-[30rem]:flex-wrap lg:contents">
            <Button
              href="#projects"
              className="intro-rise [--i:1] lg:absolute lg:right-12 lg:bottom-12 lg:z-(--z-raised)"
            >
              {t("ctaWork")} <span aria-hidden="true">→</span>
            </Button>
            <a
              href="#showroom"
              className="intro-rise btn btn-secondary group min-h-12 bg-bg/60 px-6 py-2 [--i:2] lg:absolute lg:top-1/2 lg:right-12 lg:z-(--z-raised) lg:size-36 lg:-translate-y-1/2 lg:flex-col lg:gap-1 lg:p-4 lg:hud lg:text-mono-xs"
            >
              {t("ctaGallery")} <span aria-hidden="true">↘</span>
            </a>
            <Button
              href="#contact"
              variant="secondary"
              className="intro-rise [--i:3] lg:absolute lg:top-[calc(100%+16px)] lg:right-0"
            >
              {t("ctaContact")} <span aria-hidden="true">→</span>
            </Button>
          </div>
          <p aria-hidden="true" className="absolute top-[calc(100%+30px)] left-0 hidden lg:block">
            <HudLabel>{hint}</HudLabel>
          </p>
        </div>
        <HudLabel className="mt-4 md:hidden">{t("formats")}</HudLabel>
      </div>
    </section>
  );
}
