"use client";

import { useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { qaScenarios, type QaScenario } from "@/content/qa-scenarios";
import { Button } from "@/components/ui/Button";
import { BugReportCard, sevLook } from "./BugReportCard";
import {
  CartWidget,
  CheckoutWidget,
  InventoryWidget,
  ItemCardWidget,
  RegistrationWidget,
  type WidgetProps,
} from "./widgets";

const widgets = {
  checkout: CheckoutWidget,
  cart: CartWidget,
  "inventory-list": InventoryWidget,
  "registration-form": RegistrationWidget,
  "item-card": ItemCardWidget,
} as Record<QaScenario["setup"]["widget"], ComponentType<WidgetProps>>;

/** QA Playground state: found set, active widget, expanded reports. Spec: docs/QA_PLAYGROUND_SPEC.md */
export function Playground() {
  const t = useTranslations("sections.qa-playground");
  const locale = useLocale();
  const total = qaScenarios.length;
  const [active, setActive] = useState(0);
  const [found, setFound] = useState<ReadonlySet<string>>(new Set());
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const [notYet, setNotYet] = useState<string | null>(null);
  const [inspect, setInspect] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const foundRef = useRef(found); // widgets call onFound from timers: read the latest set, not a stale closure
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const toggles = useRef<Record<string, HTMLButtonElement | null>>({});

  const commitFound = (next: ReadonlySet<string>) => {
    foundRef.current = next;
    setFound(next);
  };
  const markFound = (s: QaScenario) => {
    if (foundRef.current.has(s.id)) return;
    const next = new Set(foundRef.current).add(s.id);
    commitFound(next);
    setNotYet(null);
    setAnnounce(
      next.size === total
        ? `${t("bugFound", { severity: t(`severity${s.severity}`) })}. ${t("allFound")}`
        : t("bugFound", { severity: t(`severity${s.severity}`) }),
    );
  };

  const report = (s: QaScenario) => {
    if (!foundRef.current.has(s.id)) return setNotYet(s.id);
    setNotYet(null);
    setExpanded((e) => new Set(e).add(s.id));
    toggles.current[s.id]?.focus();
  };

  const revealAll = () => {
    commitFound(new Set(qaScenarios.map((s) => s.id)));
    setNotYet(null);
    setAnnounce(t("allFound"));
  };
  const reset = () => {
    commitFound(new Set());
    setExpanded(new Set());
    setNotYet(null);
    setInspect(false);
    setAnnounce("");
    setResetKey((k) => k + 1);
  };

  const onTabKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: total - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (keys[e.key] + total) % total;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mt-10 grid gap-x-6 gap-y-10 lg:grid-cols-12">
      {/* ---- demo UI (sandbox) ---- */}
      <div className="min-w-0 rounded-qa-panel border border-line bg-bg lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <span className="hud text-mono-xs text-text-3">{t("sandboxLabel")}</span>
          <button
            type="button"
            aria-pressed={inspect}
            onClick={() => setInspect((v) => !v)}
            className="hud text-mono-xs inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-qa border border-text-3 px-3 text-text-2 aria-pressed:border-qa-accent aria-pressed:text-qa-accent"
          >
            <span aria-hidden="true">{inspect ? "⌜◉⌟" : "⌜○⌟"}</span>
            {t("inspectMode")}
          </button>
        </div>
        {inspect && <p className="border-b border-line px-4 py-2 text-small text-text-2">{t("inspectHint")}</p>}

        <div role="tablist" aria-label={t("widgetsLabel")} onKeyDown={onTabKey} className="flex flex-wrap gap-1 border-b border-line px-2 pt-2">
          {qaScenarios.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`qa-tab-${s.id}`}
              aria-selected={i === active}
              aria-controls={`qa-panel-${s.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className="hud text-mono-xs inline-flex min-h-11 cursor-pointer items-center gap-2 border-b-2 border-transparent px-3 text-text-2 hover:text-text aria-selected:border-qa-accent aria-selected:text-text"
            >
              {t(`widgets.${s.setup.widget}`)}
              {found.has(s.id) && (
                <span className={sevLook[s.severity].text}>
                  <span aria-hidden="true">✓</span>
                  <span className="sr-only">, {t("foundMark")}</span>
                </span>
              )}
            </button>
          ))}
        </div>

        {qaScenarios.map((s, i) => {
          const Widget = widgets[s.setup.widget];
          return (
            <div
              key={s.id}
              role="tabpanel"
              id={`qa-panel-${s.id}`}
              aria-labelledby={`qa-tab-${s.id}`}
              hidden={i !== active}
              className="grid gap-6 p-4 md:p-6"
            >
              <p className="text-small text-text-2">
                <span className="hud text-mono-xs mr-2 text-qa-accent">{t("hint")}</span>
                {s.hint[locale]}
              </p>
              <Widget key={`${s.id}-${resetKey}`} scenario={s} found={found.has(s.id)} onFound={() => markFound(s)} inspect={inspect} />
              <div className="grid gap-2 border-t border-dashed border-line pt-4">
                <div>
                  <Button variant="secondary" onClick={() => report(s)}>
                    <span aria-hidden="true">⚑</span>
                    {t("reportTitle")}
                  </Button>
                </div>
                <p role="status" className="text-small text-sev-major">
                  {notYet === s.id && (
                    <>
                      <span aria-hidden="true">! </span>
                      {t("notYet")} {s.hint[locale]}
                    </>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- bug reports ---- */}
      <div className="min-w-0 lg:col-span-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-h3 font-semibold">{t("reportsLabel")}</h3>
          <span className="hud text-mono text-text-2" data-testid="qa-found-counter">
            {t("found", { found: found.size, total })}
          </span>
        </div>
        {found.size === total && <p className="mt-2 text-small text-status-pass">✓ {t("allFound")}</p>}
        <ul className="mt-4 grid gap-3">
          {qaScenarios.map((s) => (
            <li key={s.id}>
              {found.has(s.id) ? (
                <BugReportCard
                  scenario={s}
                  expanded={expanded.has(s.id)}
                  toggleRef={(el) => {
                    toggles.current[s.id] = el;
                  }}
                  onToggle={() =>
                    setExpanded((e) => {
                      const next = new Set(e);
                      if (!next.delete(s.id)) next.add(s.id);
                      return next;
                    })
                  }
                />
              ) : (
                <div className="flex flex-wrap gap-x-4 rounded-qa-panel border border-dashed border-line px-4 py-3 font-mono text-mono text-text-3">
                  <span>{s.id}</span>
                  <span>{t("notFoundYet")}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 lg:col-span-12">
        <Button variant="ghost" onClick={revealAll}>
          {t("revealAll")}
        </Button>
        <Button variant="secondary" onClick={reset}>
          {t("reset")}
        </Button>
      </div>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
