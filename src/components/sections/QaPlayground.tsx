import { useLocale, useTranslations } from "next-intl";
import { SectionShell } from "@/components/ui/SectionShell";
import { HudLabel } from "@/components/ui/HudLabel";
import { Playground } from "@/components/qa-playground/Playground";
import { qaDisclaimer } from "@/content/qa-scenarios";

/** #qa-playground section. */
export function QaPlayground() {
  const t = useTranslations("sections.qa-playground");
  const locale = useLocale();
  return (
    <SectionShell id="qa-playground" title={t("title")}>
      <HudLabel className="mt-3 inline-flex items-center gap-2 text-qa-accent!">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-qa-accent" />
        {t("debugMode")}
      </HudLabel>
      <p className="mt-6 max-w-prose text-lead text-text-2">{t("intro")}</p>
      <p className="mt-6 flex max-w-prose gap-3 rounded-qa-panel border border-dashed border-sev-major px-4 py-3 text-small text-text">
        <span aria-hidden="true" className="hud text-mono-xs pt-0.5 text-sev-major">
          !
        </span>
        <span>{qaDisclaimer[locale]}</span>
      </p>
      <Playground />
    </SectionShell>
  );
}
