"use client";

import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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
    <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2">
      <span className="hud text-mono-xs text-text-3">{t("proof")}</span>
      {stage.evidence && <span className="text-small text-text-2">{stage.evidence}</span>}
      {stage.projects.map((p) => (
        <Link
          key={p.slug}
          href={`/projects/${p.slug}`}
          className="inline-flex min-h-11 items-center text-small text-qa-accent underline underline-offset-4 hover:decoration-2"
        >
          {p.title}
        </Link>
      ))}
    </div>
  );
}

/**
 * About path (DESIGN_SYSTEM.md 5.4). Desktop: node buttons on a track, a dot travels to the selected stage,
 * details below with prev/next. Mobile: vertical line, every stage expanded (nothing hidden).
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
          <span aria-hidden="true" className="absolute inset-x-[calc(100%/16)] top-[22px] h-px bg-grid-strong" />
          {/* travelling dot: the inner box spans the track, translateX(%) is relative to it */}
          <span aria-hidden="true" className="absolute inset-x-[calc(100%/16)] top-[22px]">
            <span
              className="block w-full transition-transform duration-480 ease-out"
              style={{ transform: `translateX(${(index / last) * 100}%)` } as CSSProperties}
            >
              <span className="block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-qa-accent" />
            </span>
          </span>
          <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
            {stages.map((s, i) => (
              <li key={s.id} className="flex justify-center">
                <button
                  type="button"
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                  className="group flex cursor-pointer flex-col items-center gap-3 px-1 pt-3.5 text-center"
                >
                  <span
                    aria-hidden="true"
                    className={`size-4 rounded-full border transition-colors duration-150 ${
                      i === index ? "border-qa-accent bg-bg" : "border-text-3 bg-bg group-hover:border-qa-accent"
                    }`}
                  />
                  <span className={`hud text-mono-xs ${i === index ? "text-qa-accent" : "text-text-3 group-hover:text-text-2"}`}>
                    {s.label}
                  </span>
                  <span className="sr-only">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 grid grid-cols-12 gap-(--gutter)">
          <div aria-live="polite" className="col-span-7 border-l border-qa-accent pl-6">
            <p className="hud text-mono-xs text-text-3">{t("stageCounter", { current: index + 1, total: stages.length })}</p>
            <h3 className="mt-2 text-h3 font-bold">{stage.title}</h3>
            <p className="mt-3 max-w-prose text-text-2">{stage.text}</p>
            <Proof stage={stage} />
          </div>
          <div className="col-span-5 flex items-start justify-end gap-3">
            <button type="button" className="btn btn-secondary h-12 px-6" disabled={index === 0} onClick={() => setIndex(index - 1)}>
              <span aria-hidden="true">←</span> {t("prev")}
            </button>
            <button type="button" className="btn btn-secondary h-12 px-6" disabled={index === last} onClick={() => setIndex(index + 1)}>
              {t("next")} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <ol className="mt-12 border-l border-grid-strong lg:hidden">
        {stages.map((s) => (
          <li key={s.id} className="relative pb-10 pl-6 last:pb-0">
            <span aria-hidden="true" className="absolute top-1.5 -left-[7px] size-3.5 rounded-full border border-qa-accent bg-bg" />
            <p className="hud text-mono-xs text-text-3">{s.label}</p>
            <h3 className="mt-1 text-h3 font-bold">{s.title}</h3>
            <p className="mt-2 text-text-2">{s.text}</p>
            <Proof stage={s} />
          </li>
        ))}
      </ol>
    </>
  );
}
