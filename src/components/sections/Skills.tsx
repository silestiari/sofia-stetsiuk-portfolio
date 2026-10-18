import { useLocale, useTranslations } from "next-intl";
import { SectionShell } from "@/components/ui/SectionShell";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { SkillsMatrix } from "./SkillsMatrix";

export function Skills() {
  const t = useTranslations("sections.skills");
  const locale = useLocale();

  return (
    <SectionShell id="skills" title={t("title")}>
      <p className="mt-8 max-w-prose text-lead font-light text-text">{t("intro")}</p>
      <SkillsMatrix
        columns={projects.map((p) => ({ slug: p.slug, short: p.short, title: p.title[locale] }))}
        groups={skillGroups.map((g) => ({
          id: g.id,
          title: g.title[locale],
          skills: g.skills.map((s) => ({ id: s.id, label: s.label[locale], how: s.how[locale], projects: s.projects })),
        }))}
      />
    </SectionShell>
  );
}
