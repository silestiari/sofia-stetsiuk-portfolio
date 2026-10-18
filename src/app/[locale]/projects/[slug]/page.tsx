import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
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
  const path = `/projects/${slug}`;

  return {
    title: project.title[locale],
    description: project.summary[locale],
    alternates: localeAlternates(locale, path),
    openGraph: {
      type: "article",
      title: project.title[locale],
      description: project.summary[locale],
      url: `/${locale}${path}`,
      images: project.media.filter((m) => m.type === "image").map((m) => ({ url: m.src, alt: m.alt[locale] })),
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const locale = await getLocale();
  const t = await getTranslations("project");

  return (
    <article className="p-4">
      <Link href="/#projects">{t("backToProjects")}</Link>
      <h1>{project.title[locale]}</h1>
      <p>
        {t(`category.${project.category}`)} · {t(`status.${project.status}`)}
      </p>
      <p>{project.summary[locale]}</p>

      <h2>{t("role")}</h2>
      <p>{project.role[locale]}</p>

      <h2>{t("tech")}</h2>
      <ul>
        {project.tech.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t("features")}</h2>
      <ul>
        {project.features[locale].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t("challenges")}</h2>
      <ul>
        {project.challenges[locale].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t("caseStudy")}</h2>
      {project.caseStudy[locale].map((s) => (
        <section key={s.heading}>
          <h3>{s.heading}</h3>
          <p>{s.body}</p>
        </section>
      ))}

      {project.links.length > 0 && (
        <>
          <h2>{t("links")}</h2>
          <ul>
            {project.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label[locale]}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
