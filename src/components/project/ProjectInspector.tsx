import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { DrawFrame } from "@/components/ui/DrawFrame";
import { HudLabel } from "@/components/ui/HudLabel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechChip } from "@/components/ui/TechChip";
import type { Project } from "@/content/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { MediaItem, previewOf } from "./MediaItem";

export type InspectorVariant = "web" | "roblox" | "pet";

export const variantOf = (p: Project): InspectorVariant =>
  p.slug === "build-your-pet" ? "pet" : p.category === "web" ? "web" : "roblox";

const VISIBLE_TECH = 6;

interface Props {
  project: Project;
  locale: Locale;
  /** Alternates media left/right in the home list */
  flip?: boolean;
  /** "case": h1 title, all chips, external links; "home": h3 title linked to the case */
  mode?: "home" | "case";
  /** Roblox accent, alternated by the list */
  accent?: "pink" | "sky";
}

/** DESIGN_SYSTEM.md 4.6: web (QA properties panel), roblox (tilted game preview), pet (pastel island). */
export function ProjectInspector({ project, locale, flip = false, mode = "home", accent = "pink" }: Props) {
  const t = useTranslations("sections.projects");
  const tp = useTranslations("project");
  const variant = variantOf(project);
  const pet = variant === "pet";
  const isCase = mode === "case";
  const media = previewOf(project.media);
  const title = project.title[locale];
  const caseHref = `/projects/${project.slug}`;

  const heading = isCase ? (
    <h1 id="case-title" className={`${pet ? "font-display font-medium" : variant === "roblox" ? "font-display" : ""} text-h1 font-semibold`}>
      {title}
    </h1>
  ) : (
    <h3 className={`${variant === "web" ? "" : "font-display"} text-h2 font-semibold`}>
      <Link href={caseHref} className="hover:underline hover:underline-offset-4">
        {title}
      </Link>
    </h3>
  );

  const shown = isCase ? project.tech : project.tech.slice(0, VISIBLE_TECH);
  const hidden = isCase ? [] : project.tech.slice(VISIBLE_TECH);
  const chips = (
    <div className="flex flex-wrap items-start gap-2">
      {shown.map((tech) => (
        <TechChip key={tech} pet={pet}>
          {tech}
        </TechChip>
      ))}
      {hidden.length > 0 && (
        // Native disclosure: works without JS; summary is the "+N" button.
        <details className="max-w-full [&[open]>summary]:hidden">
          <summary
            className={`hud text-mono-xs inline-flex h-6 cursor-pointer list-none items-center rounded-qa border px-2 ${
              pet ? "border-pet-ink/40 text-pet-ink" : "border-text-3 text-text-2 hover:border-qa-accent"
            }`}
          >
            {t("moreTech", { count: hidden.length })}
            <span className="sr-only"> — {t("showAllTech")}</span>
          </summary>
          <div className="flex flex-wrap gap-2">
            {hidden.map((tech) => (
              <TechChip key={tech} pet={pet}>
                {tech}
              </TechChip>
            ))}
          </div>
        </details>
      )}
    </div>
  );

  const links = project.links.map((l) => (
    <Button key={l.href} variant="secondary" href={l.href} className={pet ? "btn-pet rounded-full border-pet-ink text-pet-ink" : ""}>
      {l.label[locale]}
    </Button>
  ));
  const actions = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {!isCase && (
        <Button
          href={caseHref}
          className={pet ? "btn-pet rounded-full bg-pet-ink text-pet-bg after:hidden" : ""}
          aria-label={`${t("openCase")}: ${title}`}
        >
          {t("openCase")} <span aria-hidden="true">→</span>
        </Button>
      )}
      {links}
      {isCase && links.length === 0 && (
        <span className={`text-mono-xs font-mono ${pet ? "text-pet-ink-2" : "text-text-3"}`}>— {tp("noLink")}</span>
      )}
    </div>
  );

  const note = project.note && (
    <p className={`text-small ${pet ? "text-pet-ink-2" : "text-text-3"}`}>{project.note[locale]}</p>
  );
  const subtitle = project.subtitle && (
    <p className={`text-small ${pet ? "text-pet-ink-2" : "text-text-2"}`}>{project.subtitle[locale]}</p>
  );
  const summary = <p className={`max-w-prose ${pet ? "text-pet-ink" : "text-text-2"}`}>{project.summary[locale]}</p>;
  const sizes = "(min-width: 1024px) 60vw, 100vw";
  const mediaEl = media ? (
    <MediaItem item={media} locale={locale} sizes={sizes} preload={isCase} className="mx-auto max-h-[80svh] w-auto" />
  ) : (
    <div className="grid aspect-video place-items-center bg-surface-1">
      <HudLabel>{t("previewUnavailable")}</HudLabel>
    </div>
  );

  if (variant === "web") {
    const kv = "grid gap-x-6 gap-y-3 md:grid-cols-[max-content_1fr]";
    const key = "hud text-mono-xs pt-1 text-text-3";
    return (
      <article className="group grid gap-6 lg:grid-cols-12 lg:gap-(--gutter)">
        <figure
          className={`relative row-start-1 self-start border border-transparent bg-surface-1 p-2 text-line transition-colors duration-300 group-focus-within:text-qa-accent group-hover:text-qa-accent lg:col-span-7 ${
            flip ? "lg:col-start-6" : "lg:col-start-1"
          }`}
        >
          {mediaEl}
          <DrawFrame />
          {media?.width && (
            <figcaption className="absolute -top-6 right-0 flex items-center gap-2" aria-hidden="true">
              {/* callout: anchor dot + line drawn towards the label (DESIGN_SYSTEM.md 4.5) */}
              <span className="size-[3px] bg-grid-strong opacity-(--hud-opacity)" />
              <span className="callout-line -ml-2 h-px w-10 origin-left bg-grid-strong opacity-(--hud-opacity)" />
              <HudLabel className="callout-label">
                [ W {media.width} × H {media.height} ]
              </HudLabel>
            </figcaption>
          )}
        </figure>
        <div
          className={`flex flex-col gap-4 border-line lg:row-start-1 lg:col-span-5 lg:border-l lg:pl-6 ${
            flip ? "lg:col-start-1 lg:border-r lg:border-l-0 lg:pr-6 lg:pl-0" : "lg:col-start-8"
          }`}
        >
          <HudLabel>{t("inspect", { slug: project.slug })}</HudLabel>
          {heading}
          {subtitle}
          <dl className={kv}>
            <dt className={key}>{t("keyStatus")}</dt>
            <dd>
              <StatusBadge status={project.status} />
            </dd>
            <dt className={key}>{t("keyPlatform")}</dt>
            <dd>{tp(`category.${project.category}`)}</dd>
            <dt className={key}>{t("keyStack")}</dt>
            <dd>{chips}</dd>
          </dl>
          {summary}
          {note}
          {actions}
        </div>
      </article>
    );
  }

  if (variant === "roblox") {
    const accentCls = accent === "pink" ? "border-t-game-pink" : "border-t-game-sky";
    return (
      <article className="group grid gap-6 lg:grid-cols-12 lg:gap-(--gutter)">
        <div
          className={`row-start-1 overflow-hidden rounded-game bg-surface-1 shadow-game transition-transform duration-240 ease-soft rotate-[-1deg] group-hover:-translate-y-1 group-hover:-rotate-2 lg:col-span-8 lg:rotate-0 ${
            flip ? "lg:col-start-5" : "lg:col-start-1"
          }`}
        >
          {mediaEl}
        </div>
        <div
          className={`relative z-(--z-raised) flex flex-col gap-4 rounded-game border border-line border-t-2 bg-surface-1 p-6 lg:row-start-1 lg:col-span-5 lg:self-end lg:-mb-12 ${accentCls} ${
            flip ? "lg:col-start-1" : "lg:col-start-8"
          }`}
        >
          {heading}
          {subtitle}
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="text-small text-text-2">{tp(`category.${project.category}`)}</span>
          </div>
          {summary}
          {note}
          {chips}
          {actions}
        </div>
      </article>
    );
  }

  return (
    <article className="grid gap-8 rounded-pet-lg bg-pet-bg p-6 text-pet-ink shadow-pet transition-shadow duration-300 [--ring:var(--ring-pet)] hover:shadow-pet-lift md:p-10 lg:grid-cols-12">
      <div className="overflow-hidden rounded-pet bg-pet-surface lg:col-span-7">{mediaEl}</div>
      <div className="flex flex-col gap-4 lg:col-span-5">
        {heading}
        {subtitle}
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} pet />
          <span className="text-small text-pet-ink-2">{tp(`category.${project.category}`)}</span>
        </div>
        {summary}
        {note}
        {chips}
        {actions}
      </div>
    </article>
  );
}
