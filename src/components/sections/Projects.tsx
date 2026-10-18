import { useLocale, useTranslations } from "next-intl";
import { ProjectFilter } from "@/components/project/ProjectFilter";
import { ProjectInspector, variantOf, type InspectorVariant } from "@/components/project/ProjectInspector";
import { HudLabel } from "@/components/ui/HudLabel";
import { SectionShell } from "@/components/ui/SectionShell";
import { projects, projectsDisclaimer } from "@/content/projects";

const groups: { id: InspectorVariant; key: "groupWeb" | "groupRoblox" | "groupPet" }[] = [
  { id: "web", key: "groupWeb" },
  { id: "roblox", key: "groupRoblox" },
  { id: "pet", key: "groupPet" },
];

export function Projects() {
  const t = useTranslations("sections.projects");
  const locale = useLocale();

  return (
    <SectionShell id="projects" title={t("title")}>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-prose text-lead text-text-2">{t("intro")}</p>
        <ProjectFilter
          label={t("filterLabel")}
          options={[
            { id: "all", label: t("filterAll") },
            { id: "web", label: t("filterWeb") },
            { id: "roblox", label: t("filterRoblox") },
          ]}
        />
      </div>
      <p className="mt-6 inline-flex gap-2 rounded-qa border border-dashed border-text-3 px-3 py-2 text-small text-text-2">
        <span aria-hidden="true" className="font-mono text-text-3">
          i
        </span>
        {projectsDisclaimer[locale]}
      </p>

      {groups.map((g) => {
        const list = projects.filter((p) => variantOf(p) === g.id);
        if (list.length === 0) return null;
        return (
          <div key={g.id} data-group={g.id} className={`mt-20 lg:mt-28 ${g.id === "roblox" ? "roblox-pass" : ""}`}>
            <div className="mb-10 flex items-center gap-4">
              <HudLabel size="md">{t(g.key)}</HudLabel>
              <span aria-hidden="true" className="hud-line h-px flex-1 origin-left bg-grid-strong opacity-(--hud-opacity)" />
            </div>
            <ul className="flex flex-col gap-20 lg:gap-32">
              {list.map((p, i) => (
                <li key={p.slug} data-reveal={g.id === "web" ? "draw" : "rise"}>
                  <ProjectInspector project={p} locale={locale} flip={i % 2 === 1} accent={i % 2 ? "sky" : "pink"} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </SectionShell>
  );
}
