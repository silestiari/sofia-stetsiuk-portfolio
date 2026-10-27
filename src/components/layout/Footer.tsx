import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { profile } from "@/content/profile";
import { desktopNavIds } from "@/content/sections";

const link = "inline-flex min-h-11 items-center text-text-2 transition-colors duration-150 hover:text-text";

/** Quiet editorial footer: logo, section links, contacts, back to top, ©. Section links point at the home page. */
export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tContact = useTranslations("sections.contact");
  const locale = useLocale();
  const { email, github } = profile.contacts;

  return (
    <footer className="border-t border-line">
      <div className="page-container hud grid gap-8 py-12 text-mono-xs md:grid-cols-3">
        <div>
          <span className="font-mono text-mono font-medium text-text">SS_</span>
          <p className="mt-4 max-w-[34ch] normal-case tracking-normal text-text-3">{t("disclaimer")}</p>
        </div>
        {/* plain list, not a second "Main navigation" landmark */}
        <ul className="flex flex-wrap gap-x-4 md:flex-col">
            {desktopNavIds.map((id) => (
              <li key={id}>
                <a href={`/${locale}#${id}`} className={link}>
                  {tNav(id)}
                </a>
              </li>
            ))}
        </ul>
        <div className="flex flex-col items-start">
          <a href={`mailto:${email}`} className={`${link} normal-case`}>
            {email}
          </a>
          <a href={github.href} target="_blank" rel="noopener noreferrer" className={link}>
            {tContact("github")} <span aria-hidden="true">&nbsp;↗</span>
          </a>
          <span className="mt-1 text-text-3">{profile.location[locale]}</span>
        </div>
      </div>
      <div className="page-container hud flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-mono-xs text-text-3">
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        <Button href="#content" variant="secondary" size="sm">
          {t("backToTop")} <span aria-hidden="true">↑</span>
        </Button>
      </div>
    </footer>
  );
}
