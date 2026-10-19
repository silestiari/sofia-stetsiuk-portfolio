"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RollText } from "@/components/ui/Button";

export interface Stage {
  id: string;
  label: string;
  title: string;
  text: string;
  evidence?: string;
  projects: { slug: string; title: string }[];
}

function Proof({ stage }: { stage: Stage }) {
  const t = useTranslations("sections.about");
  if (stage.projects.length === 0 && !stage.evidence) return null;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <span className="hud mr-2 text-mono-xs text-text-3">{t("proof")}</span>
      {stage.evidence && <span className="mr-2 text-small text-text-2">{stage.evidence}</span>}
      {stage.projects.map((p) => (
        <Link key={p.slug} href={`/projects/${p.slug}`} className="btn btn-secondary min-h-11 px-5 py-2">
          <RollText text={p.title} /> <span aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  );
}

/**
 * About path as a row of numbered circles (docs/REDESIGN_UX_SPEC.md 3.14 — stages, not people).
 * Desktop: circle buttons on a hairline, details below with prev/next. Mobile: vertical line, every stage expanded.
 */
export function JourneyPath({ stages }: { stages: Stage[] }) {
  const t = useTranslations("sections.about");
  const [index, setIndex] = useState(0);
  const stage = stages[index];
  const last = stages.length - 1;

  return (
    <>
      {/* Desktop */}
      <div className="mt-16 hidden lg:block">
        <div className="relative">
          <span aria-hidden="true" className="absolute inset-x-[calc(100%/16)] top-7 h-px bg-grid-strong" />
          <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
            {stages.map((s, i) => (
              <li key={s.id} className="flex justify-center">
                <button
                  type="button"
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                  className="group flex cursor-pointer flex-col items-center gap-3 px-1 text-center"
                >
                  <span
                    aria-hidden="true"
                    className={`hud grid size-14 place-items-center rounded-full border text-mono-xs transition-colors duration-150 ${
                      i === index ? "border-text bg-text text-bg" : "border-ui-border bg-bg text-text-2 group-hover:border-text"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`hud text-mono-xs ${i === index ? "text-text" : "text-text-3 group-hover:text-text-2"}`}>
                    {s.label}
                  </span>
                  <span className="sr-only">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 grid grid-cols-12 gap-(--gutter)">
          <div aria-live="polite" className="col-span-7 border-t-2 border-qa-accent pt-6">
            <p className="hud text-mono-xs text-text-3">{t("stageCounter", { current: index + 1, total: stages.length })}</p>
            <h3 className="mt-2 font-display text-h3 font-semibold uppercase">{stage.title}</h3>
            <p className="mt-3 max-w-prose text-text-2">{stage.text}</p>
            <Proof stage={stage} />
          </div>
          <div className="col-span-5 flex items-start justify-end gap-2">
            <button type="button" className="btn btn-secondary min-h-12 px-6 py-2" disabled={index === 0} onClick={() => setIndex(index - 1)}>
              <span aria-hidden="true">←</span> <RollText text={t("prev")} />
            </button>
            <button type="button" className="btn btn-secondary min-h-12 px-6 py-2" disabled={index === last} onClick={() => setIndex(index + 1)}>
              <RollText text={t("next")} /> <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <ol className="mt-12 ml-[18px] border-l border-grid-strong lg:hidden">
        {stages.map((s, i) => (
          <li key={s.id} className="relative pb-10 pl-10 last:pb-0">
            <span
              aria-hidden="true"
              className="hud absolute top-0 -left-[18px] grid size-9 place-items-center rounded-full border border-ui-border bg-bg text-mono-xs text-text-2"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="hud pt-2 text-mono-xs text-text-3">{s.label}</p>
            <h3 className="mt-1 font-display text-h3 font-semibold uppercase">{s.title}</h3>
            <p className="mt-2 text-text-2">{s.text}</p>
            <Proof stage={s} />
          </li>
        ))}
      </ol>
    </>
  );
}
