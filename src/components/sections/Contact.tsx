import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { SectionShell } from "@/components/ui/SectionShell";
import { profile } from "@/content/profile";
import { CopyEmailButton } from "./CopyEmailButton";

const EMAIL_ID = "contact-email";

/** Beauty pass (DESIGN_SYSTEM.md 5.9): no HUD clutter, one line, contacts one click away. */
export function Contact() {
  const t = useTranslations("sections.contact");
  const locale = useLocale();
  const { email, phone, github } = profile.contacts;
  const wide = "w-full min-[30rem]:w-auto";

  const facts = [
    { key: t("openTo"), values: profile.openTo[locale] },
    { key: t("formats"), values: profile.workFormats.map((f) => f.label[locale]) },
    { key: t("location"), values: [profile.location[locale]] },
  ];

  return (
    <SectionShell
      id="contact"
      title={t("heading")}
      hudTitle={t("title")}
      headingClassName="mx-auto max-w-4xl font-display text-h1 font-semibold"
      className="text-center"
    >
      <p className="mx-auto mt-6 max-w-prose text-lead text-text-2">{t("intro")}</p>

      <p id={EMAIL_ID} className="mt-10 font-mono text-mono break-all text-text-2 select-all">
        {email}
      </p>

      <div className="mt-6 flex flex-col items-stretch justify-center gap-x-4 gap-y-3 min-[30rem]:flex-row min-[30rem]:flex-wrap min-[30rem]:items-center">
        <Button href={`mailto:${email}`} className={wide}>
          {t("email")}
        </Button>
        <CopyEmailButton email={email} targetId={EMAIL_ID} className={wide} />
        <Button href={phone.href} variant="ghost">
          {t("call")} <span className="whitespace-nowrap">{phone.display}</span>
        </Button>
        <Button href={github.href} variant="ghost">
          {t("github")}
        </Button>
      </div>

      <dl className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
        {facts.map((f) => (
          <div key={f.key}>
            <dt className="hud text-mono-xs text-text-3">{f.key}</dt>
            <dd className="mt-3 flex flex-wrap justify-center gap-2">
              {f.values.map((v) => (
                <span key={v} className="rounded-qa border border-line px-2 py-1 text-small text-text-2">
                  {v}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
