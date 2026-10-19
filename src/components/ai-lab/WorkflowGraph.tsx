"use client";

import { Fragment, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { aiLabNodes } from "@/content/ai-lab";
import { Crosshair } from "@/components/ui/Crosshair";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Link } from "@/i18n/navigation";

// Desktop (lg+): snake graph, row 1 = steps 1–4 left→right, row 2 = steps 5–7 right→left; details on the right (xl) or below (lg).
// Mobile: vertical list with a trunk line, details right under the selected step.
const place = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-4 lg:row-start-1",
  "lg:col-start-4 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-start-2 lg:row-start-2",
];
const roles = ["human", "agents"] as const;

type Edge = { d: string };

export function WorkflowGraph({ projectTitles }: { projectTitles: Record<string, string> }) {
  const t = useTranslations("sections.ai-lab");
  const locale = useLocale();
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState(0);
  const [role, setRole] = useState<(typeof roles)[number]>("human");
  const [edges, setEdges] = useState<Edge[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const roleTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = aiLabNodes.length;

  // SVG links are measured from the real node boxes, so they follow any text length (RU/EN) and width.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const o = el.getBoundingClientRect();
      const r = nodes.current.map((n) => n!.getBoundingClientRect());
      setEdges(
        r.slice(0, -1).map((a, i) => {
          const b = r[i + 1];
          if (Math.abs(a.top - b.top) < 2) {
            const y = a.top + a.height / 2 - o.top;
            const [x1, x2] = b.left > a.left ? [a.right, b.left] : [a.left, b.right];
            return { d: `M${x1 - o.left} ${y}H${x2 - o.left}` };
          }
          const x = a.left + a.width / 2 - o.left;
          return { d: `M${x} ${a.bottom - o.top}V${b.top - o.top}` };
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [selected]);

  const select = (i: number) => {
    setSelected(i);
    nodes.current[i]?.focus();
  };
  const onNodeKey = (e: KeyboardEvent, i: number) => {
    const keys: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: total - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select(Math.min(total - 1, Math.max(0, keys[e.key])));
  };
  const onRoleKey = (e: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? 1 : roles.indexOf(role) ^ 1;
    setRole(roles[next]);
    roleTabs.current[next]?.focus();
  };

  const node = aiLabNodes[selected];

  return (
    <div className="mt-10">
      <p className="hud text-mono-xs hidden text-text-3 lg:block">{t("keyboardHint")}</p>
      <div
        ref={box}
        role="group"
        aria-label={t("graphLabel")}
        className="relative mt-4 flex flex-col gap-3 pl-6 before:absolute before:inset-y-0 before:left-2 before:w-px before:bg-grid-strong lg:grid lg:grid-cols-4 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:gap-y-12 lg:pl-0 lg:before:hidden xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.5fr)]"
      >
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block">
          <defs>
            {(["ai-arrow", "ai-arrow-hot"] as const).map((id) => (
              <marker key={id} id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
                <path d="M0 0L8 4L0 8" fill="none" className={id === "ai-arrow" ? "stroke-grid-strong" : "stroke-qa-accent"} />
              </marker>
            ))}
          </defs>
          {edges.map((e, i) => {
            const hot = i === selected || i === selected - 1;
            return (
              <path
                key={i}
                d={e.d}
                fill="none"
                markerEnd={hot ? "url(#ai-arrow-hot)" : "url(#ai-arrow)"}
                strokeWidth={1}
                className={hot ? "stroke-qa-accent" : "stroke-grid-strong"}
                strokeDasharray={hot ? "4 4" : undefined}
              >
                {hot && !reduced && (
                  <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.2s" repeatCount="indefinite" />
                )}
              </path>
            );
          })}
        </svg>

        {aiLabNodes.map((n, i) => (
          <Fragment key={n.id}>
            <button
              ref={(el) => {
                nodes.current[i] = el;
              }}
              type="button"
              aria-pressed={i === selected}
              aria-controls={i === selected ? "ai-lab-details" : undefined}
              data-testid={`ai-node-${n.id}`}
              onClick={() => setSelected(i)}
              onKeyDown={(e) => onNodeKey(e, i)}
              className={`group relative grid cursor-pointer content-start gap-1 border bg-surface-1 p-4 text-left transition-colors duration-150 ease-precise hover:border-text-3 ${place[i]} ${
                i === selected ? "border-text-3" : "border-line"
              }`}
            >
              <Crosshair active={i === selected} />
              {/* trunk port (mobile) */}
              <span
                aria-hidden="true"
                className={`absolute top-6 -left-[21px] size-2 rounded-full border lg:hidden ${
                  i === selected ? "border-qa-accent bg-qa-accent" : "border-grid-strong bg-bg"
                }`}
              />
              <span className={`hud text-mono-xs ${i === selected ? "text-qa-accent" : "text-text-3"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="hud text-mono font-medium text-text">{n.title[locale]}</span>
              <span className="text-small text-text-2">{n.summary[locale]}</span>
            </button>

            {i === selected && (
              <section
                id="ai-lab-details"
                aria-labelledby="ai-lab-details-title"
                data-testid="ai-lab-details"
                className="min-w-0 border border-line border-t-2 border-t-qa-accent bg-surface-1 p-5 lg:col-span-4 lg:row-start-3 xl:col-span-1 xl:col-start-5 xl:row-span-3 xl:row-start-1 xl:self-start"
              >
                <p className="hud text-mono-xs text-text-3">{t("step", { current: i + 1, total })}</p>
                <h3 id="ai-lab-details-title" className="mt-2 font-display text-h3 font-semibold uppercase">
                  {node.title[locale]}
                </h3>
                <p className="mt-1 text-small text-text-2">{node.summary[locale]}</p>

                <h4 className="hud text-mono-xs mt-5 text-text-3">{t("tasks")}</h4>
                <ul className="mt-2 grid gap-1 text-small">
                  {node.tasks[locale].map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden="true" className="font-mono text-text-3">›</span>
                      {x}
                    </li>
                  ))}
                </ul>

                <div role="tablist" aria-label={t("rolesLabel")} onKeyDown={onRoleKey} className="mt-5 inline-flex gap-1 rounded-full border border-ui-border p-1">
                  {roles.map((r, ri) => (
                    <button
                      key={r}
                      ref={(el) => {
                        roleTabs.current[ri] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`ai-role-${r}`}
                      aria-selected={role === r}
                      aria-controls="ai-role-panel"
                      tabIndex={role === r ? 0 : -1}
                      onClick={() => setRole(r)}
                      className="hud relative h-9 cursor-pointer rounded-full px-4 text-mono-xs text-text-2 before:absolute before:-inset-y-1 before:inset-x-0 hover:text-text aria-selected:bg-text aria-selected:text-bg"
                    >
                      {t(r)}
                    </button>
                  ))}
                </div>
                <div id="ai-role-panel" role="tabpanel" aria-labelledby={`ai-role-${role}`} className="mt-3">
                  <ul className="grid gap-1 text-small">
                    {node[role][locale].map((x) => (
                      <li key={x} className="flex gap-2">
                        <span aria-hidden="true" className="font-mono text-qa-accent">{role === "human" ? "◇" : "⟶"}</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>

                <h4 className="hud text-mono-xs mt-5 text-text-3">{t("examples")}</h4>
                <ul className="mt-2 grid gap-3">
                  {node.examples.map((ex) => (
                    <li key={ex.projectSlug + ex.text.en} className="border-l border-line pl-3 text-small">
                      <Link
                        href={`/projects/${ex.projectSlug}`}
                        className="font-bold text-qa-accent underline decoration-1 underline-offset-4 hover:decoration-2"
                      >
                        {projectTitles[ex.projectSlug] ?? ex.projectSlug}
                      </Link>
                      <p className="mt-1 text-text-2">{ex.text[locale]}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {i > 0 && (
                    <button type="button" onClick={() => select(i - 1)} className="btn btn-secondary min-h-11 px-5 py-2">
                      <span aria-hidden="true">← </span>
                      {t("prev")}
                    </button>
                  )}
                  {i < total - 1 && (
                    <button type="button" onClick={() => select(i + 1)} className="btn btn-secondary min-h-11 px-5 py-2">
                      {t("next")}
                      <span aria-hidden="true"> →</span>
                    </button>
                  )}
                </div>
              </section>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
