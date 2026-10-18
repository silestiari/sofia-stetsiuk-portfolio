import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="border-t border-line">
      <div className="page-container flex flex-wrap items-center justify-between gap-4 py-8 text-small text-text-2">
        <span className="font-mono text-mono font-medium text-text">SS_</span>
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
