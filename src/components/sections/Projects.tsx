import { useLocale, useTranslations } from "next-intl";
import { ProjectFilter } from "@/components/project/ProjectFilter";
import { ProjectInspector } from "@/components/project/ProjectInspector";
import { HudLabel } from "@/components/ui/HudLabel";
import { SectionShell } from "@/components/ui/SectionShell";
import { projects, projectsDisclaimer } from "@/content/projects";
import type { ProjectCategory } from "@/content/types";

const groups: { id: ProjectCategory; key: "groupWeb" | "groupRoblox" | "groupAi" }[] = [
  { id: "web", key: "groupWeb" },
  { id: "roblox", key: "groupRoblox" },
  { id: "ai", key: "groupAi" },
];

export function Projects() {
  const t = useTranslations("sections.projects");
  const locale = useLocale();

  return (
    <SectionShell id="projects" title={t("title")}>
      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-prose text-lead font-light text-text">{t("intro")}</p>
        <ProjectFilter
          label={t("filterLabel")}
          options={[
            { id: "all", label: t("filterAll") },
            { id: "web", label: t("filterWeb") },
            { id: "roblox", label: t("filterRoblox") },
          ]}
        />
      </div>
      <p className="mt-6 inline-flex items-center gap-2 rounded-3xl border border-line-strong px-4 py-2 text-small text-text-2">
        <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-mono-xs">
          i
        </span>
        {projectsDisclaimer[locale]}
      </p>

      {groups.map((g) => {
        const list = projects.filter((p) => p.category === g.id);
        if (list.length === 0) return null;
        return (
          <div key={g.id} data-group={g.id} className={`mt-20 lg:mt-32 ${g.id === "roblox" ? "roblox-pass" : ""}`}>
            <div className="mb-12 flex items-center gap-4">
              <HudLabel size="md">
                {t(g.key)} / {String(list.length).padStart(2, "0")}
              </HudLabel>
              <span aria-hidden="true" className="hud-line h-px flex-1 origin-left bg-grid-strong opacity-(--hud-opacity)" />
            </div>
            <ul className="flex flex-col gap-20 lg:gap-32">
              {list.map((p, i) => (
                <li key={p.slug} data-reveal={g.id === "web" ? "draw" : "rise"}>
                  <ProjectInspector project={p} locale={locale} flip={i % 2 === 1} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </SectionShell>
  );
}
