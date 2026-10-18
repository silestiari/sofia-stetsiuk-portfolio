import { useLocale, useTranslations } from "next-intl";
import { SectionShell } from "@/components/ui/SectionShell";
import { journey } from "@/content/journey";
import { profile } from "@/content/profile";
import { getProject } from "@/content/projects";
import { JourneyPath, type Stage } from "./JourneyPath";

export function About() {
  const t = useTranslations("sections.about");
  const locale = useLocale();

  // Localized on the server so the client bundle doesn't carry the project data.
  const stages: Stage[] = journey.map((s) => ({
    id: s.id,
    label: s.label[locale],
    title: s.title[locale],
    text: s.text[locale],
    evidence: s.evidence?.[locale],
    projects: s.projects.flatMap((slug) => {
      const p = getProject(slug);
      return p ? [{ slug, title: p.title[locale] }] : [];
    }),
  }));

  return (
    <SectionShell id="about" title={t("title")}>
      <p className="mt-6 max-w-prose text-lead text-text-2">{profile.bio[locale]}</p>
      <p className="mt-4 max-w-prose text-text-2">{t("intro")}</p>

      <JourneyPath stages={stages} />

      <div className="mt-20 grid gap-10 md:grid-cols-2 md:gap-(--gutter)">
        <div>
          <h3 className="hud text-mono text-text-3">{t("educationTitle")}</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {profile.education.map((e) => (
              <li key={e.title.en} className="border-l border-line pl-4">
                <p className="font-bold">{e.title[locale]}</p>
                <p className="text-small text-text-2">{e.provider[locale]}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="hud text-mono text-text-3">{t("experienceTitle")}</h3>
          {profile.experience.map((x) => (
            <div key={x.title.en} className="mt-4 border-l border-line pl-4">
              <p className="font-bold">{x.title[locale]}</p>
              <p className="text-small text-text-2">{x.context[locale]}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-small text-text-2 marker:text-text-3">
                {x.points[locale].map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
