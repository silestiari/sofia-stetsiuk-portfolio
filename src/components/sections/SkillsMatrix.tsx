"use client";

import { Fragment, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface MatrixColumn {
  slug: string;
  short: string;
  title: string;
}
export interface MatrixGroup {
  id: string;
  title: string;
  skills: { id: string; label: string; how: string; projects: string[] }[];
}

/**
 * Skill × project matrix (DESIGN_SYSTEM.md 5.5). Desktop: a real <table>; a skill button toggles the row,
 * highlights its project columns and shows where/how below. Mobile: list of cards, everything expanded.
 */
export function SkillsMatrix({ columns, groups }: { columns: MatrixColumn[]; groups: MatrixGroup[] }) {
  const t = useTranslations("sections.skills");
  const [selected, setSelected] = useState<string | null>(null);
  const skill = groups.flatMap((g) => g.skills).find((s) => s.id === selected);
  const titleOf = (slug: string) => columns.find((c) => c.slug === slug)?.title ?? slug;

  const usedIn = (projects: string[]) =>
    projects.length === 0 ? (
      <span className="text-small text-text-3">— {t("fromTraining")}</span>
    ) : (
      <span className="mt-2 flex flex-wrap gap-2">
        {projects.map((slug) => (
          <Link key={slug} href={`/projects/${slug}`} className="btn btn-secondary min-h-11 px-5 py-2">
            {titleOf(slug)}
          </Link>
        ))}
      </span>
    );

  return (
    <>
      {/* Desktop */}
      <div className="mt-12 hidden lg:block">
        <table className="w-full table-fixed border-collapse text-small">
          <caption className="sr-only">{t("tableCaption")}</caption>
          <colgroup>
            <col className="w-[30%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="hud py-3 pr-4 text-left text-mono-xs font-normal text-text-3">
                {t("skillColumn")}
              </th>
              {columns.map((c) => {
                const hit = skill?.projects.includes(c.slug);
                return (
                  <th
                    key={c.slug}
                    scope="col"
                    className={`hud px-1 py-3 text-center text-mono-xs font-normal ${hit ? "text-qa-accent" : "text-text-3"}`}
                  >
                    <abbr title={c.title} className="no-underline">
                      {c.short}
                    </abbr>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <Fragment key={g.id}>
                <tr>
                  <th scope="colgroup" colSpan={columns.length + 1} className="pt-10 pb-2 text-left font-display text-h3 font-semibold uppercase">
                    {g.title}
                  </th>
                </tr>
                {g.skills.map((s) => {
                  const on = s.id === selected;
                  return (
                    <tr key={s.id} className={`border-b border-line ${on ? "bg-surface-1" : ""}`}>
                      <th scope="row" className="py-1 pr-4 text-left font-normal">
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => setSelected(on ? null : s.id)}
                          className={`flex min-h-10 w-full cursor-pointer items-center gap-2 text-left transition-colors duration-150 hover:text-text ${
                            on ? "text-text" : "text-text-2"
                          }`}
                        >
                          <span aria-hidden="true" className={on ? "text-qa-accent" : "text-text-3"}>
                            {on ? "▾" : "▸"}
                          </span>
                          {s.label}
                        </button>
                      </th>
                      {columns.map((c) => {
                        const used = s.projects.includes(c.slug);
                        return (
                          <td key={c.slug} className="min-w-0 text-center">
                            {used && (
                              <span aria-hidden="true" className={`font-mono text-lead ${on ? "text-qa-accent" : "text-text"}`}>
                                +
                              </span>
                            )}
                            <span className="sr-only">{used ? t("used") : t("notUsed")}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>

        <div aria-live="polite" className="mt-8 min-h-24">
          {skill && (
            <div className="grid grid-cols-12 gap-(--gutter) border-t-2 border-qa-accent pt-6">
              <div className="col-span-7">
                <p className="font-bold">{skill.label}</p>
                <p className="mt-2 text-text-2">
                  <span className="hud mr-2 text-mono-xs text-text-3">{t("how")}</span>
                  {skill.how}
                </p>
              </div>
              <div className="col-span-5">
                <p className="hud text-mono-xs text-text-3">{t("usedIn")}</p>
                <div className="mt-1">{usedIn(skill.projects)}</div>
              </div>
            </div>
          )}
        </div>
        {skill && (
          <button type="button" onClick={() => setSelected(null)} className="btn btn-ghost min-h-11 px-0">
            {t("clearFilter")}
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="mt-10 flex flex-col gap-10 lg:hidden">
        {groups.map((g) => (
          <div key={g.id}>
            <h3 className="font-display text-h3 font-semibold uppercase">{g.title}</h3>
            <ul className="mt-4 flex flex-col">
              {g.skills.map((s) => (
                <li key={s.id} className="border-t border-line py-4">
                  <p className="font-bold">{s.label}</p>
                  <p className="hud mt-3 text-mono-xs text-text-3">{t("usedIn")}</p>
                  {usedIn(s.projects)}
                  <p className="mt-2 text-small text-text-2">{s.how}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
