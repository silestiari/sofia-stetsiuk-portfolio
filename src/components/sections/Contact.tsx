import { useLocale, useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PhoneReveal } from "@/components/ui/PhoneReveal";
import { SectionShell } from "@/components/ui/SectionShell";
import { profile } from "@/content/profile";
import { CopyEmailButton } from "./CopyEmailButton";

const EMAIL_ID = "contact-email";

/**
 * Contact: the thin "statement" voice for the heading, the address large, every action a pill (one pink fill).
 * The portrait sits where the chrome orb used to be: a face next to "write to me".
 */
export function Contact() {
  const t = useTranslations("sections.contact");
  const locale = useLocale();
  const { email, telegram, github } = profile.contacts;
  const wide = "w-full min-[30rem]:w-auto";

  const facts = [
    { key: t("openTo"), values: profile.openTo[locale], signal: true },
    { key: t("formats"), values: profile.workFormats.map((f) => f.label[locale]) },
    { key: t("location"), values: [profile.location[locale]] },
  ];

  return (
    <SectionShell
      id="contact"
      title={t("heading")}
      hudTitle={t("title")}
      tail={false}
      headingClassName="max-w-[16ch] text-statement font-light lg:text-[clamp(3rem,1.5rem+3vw,4.5rem)]"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-(--gutter)">
        <div className="lg:col-span-8">
          <p className="mt-8 max-w-prose text-lead font-light text-text">{t("intro")}</p>
          <p id={EMAIL_ID} className="mt-12 font-mono text-h3 break-all text-text select-all">
            {email}
          </p>
          <div className="mt-6 flex flex-col gap-2 min-[30rem]:flex-row min-[30rem]:flex-wrap min-[30rem]:items-center">
            <Button href={`mailto:${email}`} className={wide}>
              {t("email")} <span aria-hidden="true">↗</span>
            </Button>
            <CopyEmailButton email={email} targetId={EMAIL_ID} className={wide} />
            <PhoneReveal className={`btn btn-secondary min-h-12 px-6 py-2 ${wide}`}>{t("call")}</PhoneReveal>
            <Button href={telegram.href} variant="secondary" className={wide}>
              {t("telegram")} <span className="normal-case">{telegram.handle}</span>
            </Button>
            <Button href={github.href} variant="secondary" className={wide}>
              {t("github")}
            </Button>
          </div>
        </div>
        <div className="order-first grid place-items-center lg:order-none lg:col-span-3 lg:col-start-10">
          <Avatar alt={profile.name} className="w-44 lg:w-full lg:max-w-72" />
        </div>
      </div>

      <dl className="mt-20 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
        {facts.map((f) => (
          <div key={f.key}>
            <dt className="hud flex items-center gap-2 text-mono-xs text-text-3">
              {f.signal && <span aria-hidden="true" className="size-2 rounded-full bg-signal" />}
              {f.key}
            </dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {f.values.map((v) => (
                <span key={v} className="hud inline-flex h-7 items-center rounded-full border border-line-strong px-3 text-mono-xs text-text-2">
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
