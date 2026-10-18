import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { MediaItem, mediaIn } from "@/components/project/MediaItem";
import { ModelShowcase } from "@/components/sections/Showroom";
import { models } from "@/content/models";
import { ProjectInspector } from "@/components/project/ProjectInspector";
import { Button } from "@/components/ui/Button";
import { HudLabel } from "@/components/ui/HudLabel";
import { getProject, projects } from "@/content/projects";
import type { ProjectMedia } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const locale = await getLocale();
  const t = await getTranslations("meta");
  const path = `/projects/${slug}`;
  const title = t("projectTitle", { title: project.title[locale] });
  const description = t("projectDescription", { summary: project.summary[locale] });
  // OG: first screenshot, else a video poster, else the site card from ../../opengraph-image.tsx.
  const media = mediaIn(project.media, locale);
  const image = media.find((m) => m.type === "image") ?? media.find((m) => m.poster);
  const url = image?.type === "image" ? image.src : image?.poster;
  const og = image && url
    ? { url, width: image.width, height: image.height, alt: image.alt[locale] }
    : { url: `/${locale}/opengraph-image/home`, width: 1200, height: 630, alt: t("ogImageAlt") };

  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      type: "article",
      title,
      description,
      locale: t("ogLocale"),
      url: `/${locale}${path}`,
      images: [og],
    },
  };
}

/** Bento span by aspect ratio (docs/REDESIGN_UX_SPEC.md 3.8). Images are never cropped: natural height, object-contain. */
function span(m: ProjectMedia, first: boolean) {
  if (first || m.type !== "image") return "md:col-span-2 lg:col-span-12";
  const ratio = m.width && m.height ? m.width / m.height : 0;
  if (ratio >= 1.6) return "md:col-span-2 lg:col-span-8";
  if (ratio >= 1 || !ratio) return "lg:col-span-6";
  return "lg:col-span-4";
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const locale = await getLocale();
  const media = mediaIn(project.media, locale);
  const shown3d = models.filter((m) => m.projectSlug === project.slug);
  const t = await getTranslations("project");
  const muted = "text-text-2";

  const index = projects.indexOf(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const [overview, process, qa, ai] = project.caseStudy[locale];

  // Editorial block: "(01) HEADING" on the left, text on the right; numbers follow the blocks actually shown.
  type Block = { id: string; heading: string; body: ReactNode; wide?: boolean };
  const block = ({ id, heading, body, wide }: Block, i: number) => (
    <section key={id} aria-labelledby={`case-${id}`} className="mt-16 grid gap-4 border-t border-line pt-6 lg:mt-24 lg:grid-cols-12 lg:gap-(--gutter)">
      <h2 id={`case-${id}`} className="hud text-mono-xs text-text-2 lg:col-span-3">
        <span className="text-qa-accent">({String(i + 1).padStart(2, "0")})</span> {heading}
      </h2>
      <div className={wide ? "lg:col-span-12" : "lg:col-span-7 lg:col-start-4"}>{body}</div>
    </section>
  );
  const prose = (text: string) => <p className={`max-w-prose ${muted}`}>{text}</p>;
  const list = (items: string[]) => (
    <ul className={`max-w-prose space-y-2 ${muted}`}>
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[1rem_1fr] gap-2">
          <span aria-hidden="true" className="font-mono text-qa-accent">
            +
          </span>
          {item}
        </li>
      ))}
    </ul>
  );

  const blocks: (Block | false | undefined)[] = [
    overview && { id: "overview", heading: overview.heading, body: prose(overview.body) },
    { id: "role", heading: t("role"), body: prose(project.role[locale]) },
    process && { id: "process", heading: process.heading, body: prose(process.body) },
    project.features[locale].length > 0 && { id: "features", heading: t("features"), body: list(project.features[locale]) },
    qa && { id: "qa", heading: qa.heading, body: prose(qa.body) },
    ai && { id: "ai", heading: ai.heading, body: prose(ai.body) },
    project.metrics.length > 0 && {
      id: "metrics",
      heading: t("metrics"),
      body: (
        <dl className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {project.metrics.map((m) => (
            <div key={m.label.en} className="flex flex-col gap-2 border border-line bg-surface-1 p-5">
              <dt className={`order-2 text-small ${muted}`}>{m.label[locale]}</dt>
              <dd className="order-1 font-display text-h2 font-bold">{m.value}</dd>
              {m.note && <dd className="order-3 font-mono text-mono-xs text-text-3">* {m.note[locale]}</dd>}
            </div>
          ))}
        </dl>
      ),
    },
    project.challenges[locale].length > 0 && { id: "challenges", heading: t("challenges"), body: list(project.challenges[locale]) },
    media.length > 0 && {
      id: "media",
      heading: t("media"),
      wide: true,
      body: (
        <ul className="grid grid-flow-row-dense items-start gap-2 md:grid-cols-2 lg:grid-cols-12">
          {media.map((m, i) => (
            <li key={m.src} className={`border border-line bg-surface-1 p-2 ${span(m, i === 0)}`}>
              <MediaItem
                item={m}
                locale={locale}
                sizes={i === 0 ? "(min-width: 1440px) 1312px, 100vw" : "(min-width: 1024px) 66vw, (min-width: 768px) 50vw, 100vw"}
                className="mx-auto max-h-[80svh] w-auto"
              />
            </li>
          ))}
        </ul>
      ),
    },
    shown3d.length > 0 && { id: "models", heading: t("models"), wide: true, body: <ModelShowcase models={shown3d} /> },
  ];

  return (
    <article aria-labelledby="case-title">
      <div className="page-container pt-8 pb-(--section-y)">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Button href="/#projects" variant="secondary" size="sm">
            <span aria-hidden="true">←</span> {t("allProjects")}
          </Button>
          <HudLabel>{t("caseCounter", { current: index + 1, total: projects.length })}</HudLabel>
        </div>

        <ProjectInspector project={project} locale={locale} mode="case" />

        {blocks.filter((b): b is Block => !!b).map(block)}

        <nav aria-label={t("caseStudy")} className="mt-24 grid border-y border-line md:grid-cols-2">
          <Link
            href={`/projects/${prev.slug}`}
            rel="prev"
            className="group flex min-h-32 flex-col justify-center gap-2 p-6 transition-colors duration-150 hover:bg-surface-1 md:border-r md:border-line"
          >
            <span className="hud text-mono-xs text-text-3">
              <span aria-hidden="true">← </span>
              {t("prevLabel")}
            </span>
            <span className="font-display text-h3 font-semibold uppercase group-hover:text-qa-accent">{prev.title[locale]}</span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            rel="next"
            className="group flex min-h-32 flex-col justify-center gap-2 border-t border-line p-6 text-right transition-colors duration-150 hover:bg-surface-1 md:border-t-0"
          >
            <span className="hud text-mono-xs text-text-3">
              {t("nextLabel")}
              <span aria-hidden="true"> →</span>
            </span>
            <span className="font-display text-h3 font-semibold uppercase group-hover:text-qa-accent">{next.title[locale]}</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
