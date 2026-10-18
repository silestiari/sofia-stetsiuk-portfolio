import { getLocale, getTranslations } from "next-intl/server";
import { SectionShell } from "@/components/ui/SectionShell";
import { projects } from "@/content/projects";
import { sectionIds } from "@/content/sections";
import { Link } from "@/i18n/navigation";

// Section bodies are placeholders until the sections stage.
export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("sections");
  const tNav = await getTranslations("nav");

  return (
    <>
      <SectionShell
        id="hero"
        as="h1"
        title={t("hero.title")}
        hudTitle={tNav("hero")}
        headingClassName="font-display text-hero font-semibold uppercase"
        className="min-h-[calc(100svh-var(--header-h))]"
      >
        <p className="mt-6 max-w-prose text-lead text-text-2">{t("hero.subtitle")}</p>
      </SectionShell>

      {sectionIds
        .filter((id) => id !== "hero")
        .map((id) => (
          <SectionShell key={id} id={id} title={t(`${id}.title`)}>
            {id === "projects" && projects.length > 0 ? (
              <ul className="mt-8">
                {projects.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`}>{p.title[locale]}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 max-w-prose text-text-2">{t(`${id}.placeholder`)}</p>
            )}
          </SectionShell>
        ))}
    </>
  );
}
