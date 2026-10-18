import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Crosshair } from "@/components/ui/Crosshair";
import { HudLabel } from "@/components/ui/HudLabel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechChip } from "@/components/ui/TechChip";
import type { Project } from "@/content/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { MediaItem, previewOf } from "./MediaItem";

export type InspectorVariant = "web" | "roblox";

export const variantOf = (p: Project): InspectorVariant => (p.category === "roblox" ? "roblox" : "web");

const VISIBLE_TECH = 6;

interface Props {
  project: Project;
  locale: Locale;
  /** Alternates media left/right in the home list */
  flip?: boolean;
  /** "case": the case-page header (h1, all chips, external links, full-width media); "home": card linked to the case */
  mode?: "home" | "case";
}

/**
 * Project card (docs/REDESIGN_UX_SPEC.md 3.7): web = editorial row with a crosshair media frame,
 * roblox = straight bento card with a pink top edge. Case mode = the case-page header, one layout for both.
 */
export function ProjectInspector({ project, locale, flip = false, mode = "home" }: Props) {
  const t = useTranslations("sections.projects");
  const tp = useTranslations("project");
  const variant = variantOf(project);
  const isCase = mode === "case";
  const media = previewOf(project.media, locale);
  const title = project.title[locale];
  const caseHref = `/projects/${project.slug}`;

  const shown = isCase ? project.tech : project.tech.slice(0, VISIBLE_TECH);
  const hidden = isCase ? [] : project.tech.slice(VISIBLE_TECH);
  const chips = (
    <div className="flex flex-wrap items-start gap-2">
      {shown.map((tech) => (
        <TechChip key={tech}>{tech}</TechChip>
      ))}
      {hidden.length > 0 && (
        // Native disclosure: works without JS; summary is the "+N" pill (it is clickable → ui-border).
        <details className="max-w-full [&[open]>summary]:hidden">
          <summary className="hud text-mono-xs relative inline-flex h-7 cursor-pointer list-none items-center rounded-full border border-ui-border px-3 text-text-2 before:absolute before:-inset-y-2 before:inset-x-0 hover:border-text hover:text-text">
            {t("moreTech", { count: hidden.length })}
            <span className="sr-only"> — {t("showAllTech")}</span>
          </summary>
          <div className="flex flex-wrap gap-2">
            {hidden.map((tech) => (
              <TechChip key={tech}>{tech}</TechChip>
            ))}
          </div>
        </details>
      )}
    </div>
  );

  const links = project.links.map((l) => (
    <Button key={l.href} variant="secondary" href={l.href} className="w-full min-[30rem]:w-auto">
      {l.label[locale]}
    </Button>
  ));
  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      {!isCase && (
        <Button href={caseHref} variant="secondary" aria-label={`${t("openCase")}: ${title}`} className="w-full min-[30rem]:w-auto">
          {t("openCase")} <span aria-hidden="true">→</span>
        </Button>
      )}
      {links}
      {isCase && links.length === 0 && <span className="font-mono text-mono-xs text-text-3">— {tp("noLink")}</span>}
    </div>
  );

  const note = project.note && <p className="text-small text-text-3">{project.note[locale]}</p>;
  const subtitle = project.subtitle && (
    <p className={`${isCase ? "text-lead" : "text-small"} font-light text-text`}>{project.subtitle[locale]}</p>
  );
  const summary = <p className="max-w-prose text-text-2">{project.summary[locale]}</p>;
  const sizes = isCase ? "(min-width: 1440px) 1312px, 100vw" : "(min-width: 1024px) 60vw, 100vw";
  // Home card: a live interactive (Sakhli's koi pond) goes under the screenshot; the case page has it in its gallery.
  const live = !isCase && media?.type !== "interactive" ? project.media.find((m) => m.type === "interactive") : undefined;
  const mediaEl = media ? (
    <>
      <MediaItem item={media} locale={locale} sizes={sizes} preload={isCase} className="mx-auto max-h-[80svh] w-auto" />
      {live && <MediaItem item={live} locale={locale} sizes={sizes} className="mt-2" />}
    </>
  ) : (
    <div className="grid aspect-video place-items-center bg-surface-1">
      <HudLabel>{t("previewUnavailable")}</HudLabel>
    </div>
  );
  const callout = media?.width && (
    <figcaption className="absolute -top-6 right-0 flex items-center gap-2" aria-hidden="true">
      <span className="size-[3px] bg-grid-strong opacity-(--hud-opacity)" />
      <span className="callout-line -ml-2 h-px w-10 origin-left bg-grid-strong opacity-(--hud-opacity)" />
      <HudLabel className="callout-label">
        [ W {media.width} × H {media.height} ]
      </HudLabel>
    </figcaption>
  );
  const status = <StatusBadge status={project.status} />;
  const platform = tp(`category.${project.category}`);

  if (isCase) {
    return (
      <header className="group">
        <HudLabel>{t("inspect", { slug: project.slug })}</HudLabel>
        <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:gap-(--gutter)">
          <div className="lg:col-span-7">
            <h1 id="case-title" className="font-display text-h1 font-extrabold uppercase">
              {title}
            </h1>
            {subtitle && <div className="mt-6">{subtitle}</div>}
            <div className="mt-6">{summary}</div>
            {note && <div className="mt-4">{note}</div>}
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end lg:text-right">
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {status}
              <TechChip>{platform}</TechChip>
            </div>
            <div className="lg:[&>div]:justify-end">{chips}</div>
            <div className="lg:[&>div]:justify-end">{actions}</div>
          </div>
        </div>
        <figure className="relative mt-12 border border-line bg-surface-1 p-2">
          {mediaEl}
          {variant === "web" && <Crosshair cols={1} rows={1} className="group-focus-within:text-qa-accent group-hover:text-qa-accent" />}
          {callout}
        </figure>
      </header>
    );
  }

  const heading = (
    <h3 className="font-display text-h2 font-semibold uppercase">
      <Link href={caseHref} className="decoration-1 underline-offset-8 hover:underline">
        {title}
      </Link>
    </h3>
  );

  if (variant === "web") {
    const kv = "grid gap-x-6 gap-y-3 md:grid-cols-[max-content_1fr]";
    const key = "hud text-mono-xs pt-1 text-text-3";
    return (
      <article className="group grid gap-6 lg:grid-cols-12 lg:gap-(--gutter)">
        <figure
          className={`relative row-start-1 self-start border border-line bg-surface-1 p-2 lg:col-span-7 ${
            flip ? "lg:col-start-6" : "lg:col-start-1"
          }`}
        >
          {mediaEl}
          <Crosshair cols={1} rows={1} className="group-focus-within:text-qa-accent group-hover:text-qa-accent" />
          {callout}
        </figure>
        <div
          className={`flex flex-col gap-4 border-line lg:col-span-5 lg:row-start-1 lg:border-l lg:pl-6 ${
            flip ? "lg:col-start-1 lg:border-r lg:border-l-0 lg:pr-6 lg:pl-0" : "lg:col-start-8"
          }`}
        >
          <HudLabel>{t("inspect", { slug: project.slug })}</HudLabel>
          {heading}
          {subtitle}
          <dl className={kv}>
            <dt className={key}>{t("keyStatus")}</dt>
            <dd>{status}</dd>
            <dt className={key}>{t("keyPlatform")}</dt>
            <dd>{platform}</dd>
            {project.tech.length > 0 && (
              <>
                <dt className={key}>{t("keyStack")}</dt>
                <dd>{chips}</dd>
              </>
            )}
          </dl>
          {summary}
          {note}
          {actions}
        </div>
      </article>
    );
  }

  return (
    <article className="group grid gap-6 lg:grid-cols-12 lg:gap-(--gutter)">
      <div
        className={`row-start-1 overflow-hidden bg-surface-1 lg:col-span-8 [&>*]:transition-transform [&>*]:duration-300 [&>*]:ease-out motion-safe:group-hover:[&>*]:scale-[1.02] ${
          flip ? "lg:col-start-5" : "lg:col-start-1"
        }`}
      >
        {mediaEl}
      </div>
      <div
        className={`relative z-(--z-raised) flex flex-col gap-4 border border-t-2 border-line border-t-qa-accent bg-surface-1 p-6 lg:col-span-5 lg:row-start-1 lg:-mb-12 lg:self-end ${
          flip ? "lg:col-start-1" : "lg:col-start-8"
        }`}
      >
        {heading}
        {subtitle}
        <div className="flex flex-wrap items-center gap-2">
          {status}
          <TechChip>{platform}</TechChip>
        </div>
        {summary}
        {note}
        {chips}
        {actions}
      </div>
    </article>
  );
}
