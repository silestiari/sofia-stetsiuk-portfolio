"use client";

import type { ReactNode, Ref } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { QaScenario, Severity } from "@/content/qa-scenarios";

// Severity = color + shape + text, never color alone (DESIGN_SYSTEM.md 1.2, 4.10). Literal classes for Tailwind.
export const sevLook: Record<Severity, { icon: string; text: string; bg: string; outline: string }> = {
  S1: { icon: "⬢", text: "text-sev-critical", bg: "bg-sev-critical", outline: "outline-sev-critical" },
  S2: { icon: "▲", text: "text-sev-major", bg: "bg-sev-major", outline: "outline-sev-major" },
  S3: { icon: "◆", text: "text-sev-minor", bg: "bg-sev-minor", outline: "outline-sev-minor" },
  S4: { icon: "●", text: "text-sev-trivial", bg: "bg-sev-trivial", outline: "outline-sev-trivial" },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const t = useTranslations("sections.qa-playground");
  const { icon, text } = sevLook[severity];
  return (
    <span className={`hud text-mono-xs inline-flex h-6 items-center gap-1.5 rounded-qa border border-current px-2 ${text}`}>
      <span aria-hidden="true">{icon}</span>
      {t(`severity${severity}`)}
    </span>
  );
}

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid gap-1 md:grid-cols-[minmax(0,10rem)_1fr] md:gap-4">
    <dt className="hud text-mono-xs pt-0.5 text-text-3">{label}</dt>
    <dd className="min-w-0 text-small text-text">{children}</dd>
  </div>
);

/** DESIGN_SYSTEM.md 4.10: collapsed (title + severity) → expanded (all report fields). */
export function BugReportCard({
  scenario: s,
  expanded,
  onToggle,
  toggleRef,
}: {
  scenario: QaScenario;
  expanded: boolean;
  onToggle: () => void;
  toggleRef?: Ref<HTMLButtonElement>;
}) {
  const t = useTranslations("sections.qa-playground");
  const locale = useLocale();
  const look = sevLook[s.severity];
  const bodyId = `${s.id}-report`;
  const env = s.report.environment;

  return (
    <article
      aria-labelledby={`${s.id}-title`}
      data-testid={`report-${s.id}`}
      className="relative overflow-hidden rounded-qa-panel border border-line bg-surface-1 pl-[3px]"
    >
      {/* severity stripe draws top→down when the card first appears ("new" state) */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-[3px] origin-top transition-transform duration-[240ms] ease-precise starting:scale-y-0 ${look.bg}`}
      />
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="hud text-mono font-medium text-text">{s.id}</span>
          <SeverityBadge severity={s.severity} />
          <span className="hud text-mono-xs inline-flex h-6 items-center rounded-qa border border-text-3 px-2 text-text-2">
            {s.priority}
          </span>
          <span className="hud text-mono-xs ml-auto text-text-3">{t("statusOpen")}</span>
        </div>
        <h4 id={`${s.id}-title`} className="mt-3 text-body font-bold text-text">
          {s.title[locale]}
        </h4>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={onToggle}
          className="hud text-mono-xs mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-qa border border-text-3 px-3 text-text-2 transition-colors hover:border-grid-strong hover:text-text"
        >
          <span aria-hidden="true">{expanded ? "−" : "+"}</span>
          {expanded ? t("collapse") : t("expand")}
        </button>
      </div>
      <div
        id={bodyId}
        inert={!expanded}
        className={`grid transition-[grid-template-rows] duration-300 ease-precise ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <dl className="grid gap-3 border-t border-line p-4">
            <Row label={t("fieldType")}>{t(`bugType.${s.type}`)}</Row>
            <Row label={t("fieldEnvironment")}>
              <span className="font-mono text-mono text-text-2">
                {[env.app, env.browser, env.os, env.viewport, env.locale].join(" · ")}
              </span>
            </Row>
            <Row label={t("fieldPreconditions")}>{s.report.preconditions[locale]}</Row>
            <Row label={t("fieldSteps")}>
              <ol className="list-decimal space-y-1 pl-5 font-mono text-mono marker:text-text-3">
                {s.report.steps[locale].map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </Row>
            <Row label={t("fieldExpected")}>{s.report.expected[locale]}</Row>
            <Row label={t("fieldActual")}>
              <span className={look.text}>{s.report.actual[locale]}</span>
            </Row>
            <Row label={t("fieldNotes")}>
              <span className="text-text-2">{s.report.notes[locale]}</span>
            </Row>
          </dl>
        </div>
      </div>
    </article>
  );
}
