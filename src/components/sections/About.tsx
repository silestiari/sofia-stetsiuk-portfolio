import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { PhoneReveal } from "@/components/ui/PhoneReveal";
import { SectionShell } from "@/components/ui/SectionShell";
import { journey } from "@/content/journey";
import { profile } from "@/content/profile";
import { getProject } from "@/content/projects";
import { JourneyPath, type Stage } from "./JourneyPath";

const CIRCLE =
  "hud grid place-items-center rounded-full border border-ui-border text-mono-xs text-text transition-colors duration-150 hover:border-text";

/** Round contact icon link (circle = icon action); only contacts that exist in profile. */
function ContactCircle({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${CIRCLE} size-11`}
    >
      <span aria-hidden="true">{children}</span>
    </a>
  );
}

export function About() {
  const t = useTranslations("sections.about");
  const tHero = useTranslations("sections.hero");
  const tContact = useTranslations("sections.contact");
  const tA11y = useTranslations("a11y");
  const locale = useLocale();
  const { email, telegram, github } = profile.contacts;
  const name = profile.localizedName[locale];

  // Localized on the server so the client bundle doesn't carry the project data.
  const stages: Stage[] = journey.map((s) => ({
    id: s.id,
    label: s.label[locale],
    title: s.title[locale],
    text: s.text[locale],
    evidence: s.evidence?.[locale],
    projects: s.projects.flatMap((slug) => {
      const p = getProject(slug);
      return p ? [{ slug, title: p.title[locale] }] : [];
    }),
  }));

  return (
    <SectionShell id="about" title={t("title")}>
      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-(--gutter)">
        {/* ID card: circle + caps name + meta lines + contact circles */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 lg:gap-6">
            <Avatar alt={name} className="size-28 lg:size-36" />
            <div className="min-w-0">
              <p className="hud text-mono font-medium tracking-[0.12em] text-text">{name}</p>
              <p className="hud mt-2 text-mono-xs text-text-2">{tHero("subtitle")}</p>
              <p className="hud mt-1 text-mono-xs text-text-2">{profile.location[locale]}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <ContactCircle href={github.href} label={`${tContact("github")} ${tA11y("opensInNewTab")}`}>
              {"</>"}
            </ContactCircle>
            <ContactCircle href={`mailto:${email}`} label={`${tContact("email")}: ${email}`}>
              @
            </ContactCircle>
            <ContactCircle href={telegram.href} label={`${tContact("telegram")} ${telegram.handle} ${tA11y("opensInNewTab")}`}>
              {"✈︎"}
            </ContactCircle>
            <PhoneReveal
              label={tContact("call")}
              className={`${CIRCLE} size-11`}
              revealedClassName={`${CIRCLE} h-11 px-4`}
            >
              <span aria-hidden="true">☎</span>
            </PhoneReveal>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="max-w-prose text-lead font-light text-text">{profile.bio[locale]}</p>
          <p className="mt-4 max-w-prose text-text-2">{t("intro")}</p>
        </div>
      </div>

      <JourneyPath stages={stages} />

      <div className="mt-20 grid gap-12 md:grid-cols-2 md:gap-(--gutter)">
        <div>
          <h3 className="hud text-mono-xs text-text-3">
            <span className="text-qa-accent">(A)</span> {t("educationTitle")}
          </h3>
          <ul className="mt-4">
            {profile.education.map((e) => (
              <li key={e.title.en} className="border-t border-line py-4">
                <p className="font-bold">{e.title[locale]}</p>
                <p className="text-small text-text-2">{e.provider[locale]}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="hud text-mono-xs text-text-3">
            <span className="text-qa-accent">(B)</span> {t("experienceTitle")}
          </h3>
          {profile.experience.map((x) => (
            <div key={x.title.en} className="mt-4 border-t border-line py-4">
              <p className="font-bold">{x.title[locale]}</p>
              <p className="text-small text-text-2">{x.context[locale]}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-small text-text-2 marker:text-text-3">
                {x.points[locale].map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
