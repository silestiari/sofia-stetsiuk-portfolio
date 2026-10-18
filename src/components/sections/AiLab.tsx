import { useLocale, useTranslations } from "next-intl";
import { SectionShell } from "@/components/ui/SectionShell";
import { WorkflowGraph } from "@/components/ai-lab/WorkflowGraph";
import { aiLabSiteAgents, aiLabSiteNote, aiLabWhyHuman } from "@/content/ai-lab";
import { projects } from "@/content/projects";

/** #ai-lab section. */
export function AiLab() {
  const t = useTranslations("sections.ai-lab");
  const locale = useLocale();
  // Only titles go to the client, not the whole projects dataset.
  const projectTitles = Object.fromEntries(projects.map((p) => [p.slug, p.title[locale]]));

  return (
    <SectionShell id="ai-lab" title={t("title")}>
      <p className="mt-6 max-w-prose text-lead text-text-2">{t("intro")}</p>
      <WorkflowGraph projectTitles={projectTitles} />

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 className="text-h3 font-semibold">{aiLabWhyHuman.title[locale]}</h3>
          <ol className="mt-6 grid gap-4">
            {aiLabWhyHuman.points[locale].map((point, i) => (
              <li key={point} className="grid grid-cols-[max-content_1fr] gap-4">
                <span aria-hidden="true" className="hud text-mono-xs pt-1 text-qa-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="max-w-prose text-text-2">{point}</p>
              </li>
            ))}
          </ol>
        </div>
        <aside aria-labelledby="ai-lab-site-title" className="rounded-qa-panel border border-line bg-surface-1 p-5 lg:col-span-5">
          <h3 id="ai-lab-site-title" className="hud text-mono-xs text-text-3">
            {t("siteTitle")}
          </h3>
          <p className="mt-3 text-small text-text">{aiLabSiteNote[locale]}</p>
          <p className="hud text-mono-xs mt-5 text-text-3">{t("siteAgents")}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {aiLabSiteAgents.map((name) => (
              <li key={name} className="rounded-qa border border-line px-2 py-1 font-mono text-mono-xs text-text-2">
                {name}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </SectionShell>
  );
}
