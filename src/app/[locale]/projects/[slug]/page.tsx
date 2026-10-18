import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { MediaItem, mediaIn } from "@/components/project/MediaItem";
import { ProjectInspector, variantOf } from "@/components/project/ProjectInspector";
import { HudLabel } from "@/components/ui/HudLabel";
import { getProject, projects } from "@/content/projects";
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

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const locale = await getLocale();
  const media = mediaIn(project.media, locale);
  const t = await getTranslations("project");
  const muted = "text-text-2";
  const link = "text-qa-accent";

  const index = projects.indexOf(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const [overview, process, qa, ai] = project.caseStudy[locale];

  const block = (id: string, heading: string, body: ReactNode) => (
    <section aria-labelledby={`case-${id}`} className="mt-16 lg:mt-24">
      <h2 id={`case-${id}`} className="text-h3 font-bold">
        {heading}
      </h2>
      <div className="mt-4">{body}</div>
    </section>
  );
  const prose = (text: string) => <p className={`max-w-prose ${muted}`}>{text}</p>;
  const list = (items: string[]) => (
    <ul className={`max-w-prose list-disc space-y-2 pl-5 ${muted} ${"marker:text-text-3"}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );

  return (
    <article aria-labelledby="case-title">
      <div className="page-container pt-8 pb-(--section-y)">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/#projects" className={`inline-flex min-h-11 items-center gap-2 text-small font-bold ${link} hover:underline`}>
            <span aria-hidden="true">←</span> {t("allProjects")}
          </Link>
          <HudLabel>{t("caseCounter", { current: index + 1, total: projects.length })}</HudLabel>
        </div>

        <ProjectInspector project={project} locale={locale} mode="case" />

        {overview && block("overview", overview.heading, prose(overview.body))}
        {block("role", t("role"), prose(project.role[locale]))}
        {process && block("process", process.heading, prose(process.body))}
        {project.features[locale].length > 0 && block("features", t("features"), list(project.features[locale]))}
        {qa && block("qa", qa.heading, prose(qa.body))}
        {ai && block("ai", ai.heading, prose(ai.body))}

        {project.metrics.length > 0 &&
          block(
            "metrics",
            t("metrics"),
            <dl className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label.en} className={`flex flex-col gap-2 p-5 ${"rounded-qa-panel border border-line bg-surface-1"}`}>
                  <dt className={`order-2 text-small ${muted}`}>{m.label[locale]}</dt>
                  <dd className="order-1 font-display text-h2 font-semibold">{m.value}</dd>
                  {m.note && (
                    <dd className={`order-3 font-mono text-mono-xs ${"text-text-3"}`}>* {m.note[locale]}</dd>
                  )}
                </div>
              ))}
            </dl>,
          )}

        {project.challenges[locale].length > 0 && block("challenges", t("challenges"), list(project.challenges[locale]))}

        {media.length > 0 &&
          block(
            "media",
            t("media"),
            <ul className="grid items-start gap-6 md:grid-cols-2">
              {media.map((m, i) => (
                <li
                  key={m.src}
                  className={`overflow-hidden ${i === 0 ? "md:col-span-2" : ""} ${
                    variantOf(project) === "roblox" ? "rounded-game bg-surface-1" : "border border-line bg-surface-1 p-2"
                  }`}
                >
                  <MediaItem
                    item={m}
                    locale={locale}
                    sizes={i === 0 ? "(min-width: 1440px) 1312px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                    className="mx-auto max-h-[80svh] w-auto"
                  />
                </li>
              ))}
            </ul>,
          )}

        <nav
          aria-label={t("caseStudy")}
          className={`mt-24 flex flex-col justify-between gap-4 border-t pt-8 md:flex-row ${"border-line"}`}
        >
          <Link href={`/projects/${prev.slug}`} rel="prev" className={`inline-flex min-h-11 items-center gap-2 font-bold ${link} hover:underline`}>
            <span aria-hidden="true">←</span> {t("prev", { title: prev.title[locale] })}
          </Link>
          <Link href={`/projects/${next.slug}`} rel="next" className={`inline-flex min-h-11 items-center gap-2 font-bold ${link} hover:underline md:text-right`}>
            {t("next", { title: next.title[locale] })} <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
