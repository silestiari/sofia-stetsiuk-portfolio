"use client";

import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState, type KeyboardEvent } from "react";
import { LazyMount } from "@/components/LazyMount";
import { IconButton, Segmented } from "@/components/showroom/ShowroomControls";
import type { Backdrop, StageCommand } from "@/components/showroom/ShowroomStage";
import type { Pass } from "@/components/three/passes";
import { Button } from "@/components/ui/Button";
import { SectionShell } from "@/components/ui/SectionShell";
import { models } from "@/content/models";
import { getProject } from "@/content/projects";
import { useMediaQuery, MOBILE_QUERY } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useRovingRadio } from "@/hooks/useRovingRadio";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";

const Poster = ({ src, alt }: { src: string; alt: string }) => (
  // eslint-disable-next-line @next/next/no-img-element -- pre-sized webp poster from public/posters
  <img
    src={src}
    alt={alt}
    width={1024}
    height={1024}
    loading="lazy"
    decoding="async"
    className="absolute inset-0 size-full object-contain p-6"
  />
);

const ShowroomStage = dynamic(() => import("@/components/showroom/ShowroomStage"), { ssr: false });

const projectSlugs = [...new Set(models.map((m) => m.projectSlug))];
const thumb = (poster: string) => poster.replace("/posters/", "/posters/thumbs/");
const fileName = (path: string) => path.split(/[\\/]/).pop()?.split("#")[0] ?? path;

/** DESIGN_SYSTEM.md 4.9 / 5.3. Posters on mobile, without WebGL and with reduced motion — same pickers. */
export function Showroom() {
  const t = useTranslations("sections.showroom");
  const tErr = useTranslations("errors");
  const locale = useLocale();
  const hintId = useId();

  const [modelId, setModelId] = useState(models[0].id);
  const [pass, setPass] = useState<Pass>("beauty");
  const [backdrop, setBackdrop] = useState<Backdrop>("grid");
  const [autoRotate, setAutoRotate] = useState(true);
  const [command, setCommand] = useState<StageCommand | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [lost, setLost] = useState(false);
  const [announce, setAnnounce] = useState("");

  const webgl = useWebGLSupport();
  const reduced = usePrefersReducedMotion();
  const mobile = useMediaQuery(MOBILE_QUERY, true);
  const live = webgl === true && !reduced && !mobile && !lost;

  const model = models.find((m) => m.id === modelId) ?? models[0];
  const projectTitle = (slug: string) => getProject(slug)?.title[locale] ?? slug;
  const projectModels = models.filter((m) => m.projectSlug === model.projectSlug);
  const title = model.title[locale];

  const passes: { value: Pass; label: string }[] = [
    { value: "wire", label: t("passWire") },
    { value: "clay", label: t("passClay") },
    { value: "shaded", label: t("passShaded") },
    { value: "beauty", label: t("passFinal") },
  ];

  const selectModel = (id: string) => {
    const m = models.find((x) => x.id === id)!;
    setModelId(id);
    setFailed(false);
    setAnnounce(t("announce", { title: m.title[locale], project: projectTitle(m.projectSlug) }));
  };
  const selectPass = (p: Pass) => {
    setPass(p);
    setAnnounce(t("announcePass", { pass: passes.find((x) => x.value === p)!.label }));
  };
  const send = (kind: StageCommand["kind"]) => setCommand({ kind, id: Date.now() });

  const list = useRovingRadio(
    projectModels.length,
    projectModels.findIndex((m) => m.id === model.id),
    (i) => selectModel(projectModels[i].id),
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!live || e.altKey || e.ctrlKey || e.metaKey) return;
    const onControl = (e.target as HTMLElement).closest("button, a, input");
    const map: Record<string, () => void> = {
      ArrowLeft: () => send("left"),
      ArrowRight: () => send("right"),
      "+": () => send("in"),
      "=": () => send("in"),
      "-": () => send("out"),
      r: () => send("reset"),
      R: () => send("reset"),
      " ": () => setAutoRotate((a) => !a),
    };
    if (!map[e.key] || (onControl && (e.key === " " || e.key === "Enter"))) return;
    e.preventDefault();
    map[e.key]();
  };

  return (
    <SectionShell id="showroom" title={t("title")}>
      <p className="mt-6 max-w-prose text-lead text-text-2">{t("intro")}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-12" role="group" aria-describedby={hintId} onKeyDown={onKeyDown}>
        <p id={hintId} className="sr-only">
          {t("keyboardHint")}
        </p>

        {/* stage */}
        <div className="relative lg:col-span-9">
          <div
            className={`relative aspect-[4/5] overflow-hidden rounded-game border border-line md:aspect-auto md:h-[min(72vh,640px)] ${
              backdrop === "studio" && live
                ? "bg-[radial-gradient(ellipse_at_center,var(--color-surface-2)_0%,var(--color-bg)_80%)]"
                : "bg-[radial-gradient(ellipse_at_center,var(--color-surface-1)_0%,var(--color-bg)_75%)]"
            }`}
          >
            {live && !failed ? (
              <LazyMount className="absolute inset-0" fallback={<Poster src={model.poster} alt="" />}>
                <ShowroomStage
                  model={model}
                  pass={pass}
                  backdrop={backdrop}
                  autoRotate={autoRotate}
                  command={command}
                  retry={retry}
                  label={t("stageLabel", { title })}
                  onError={() => setFailed(true)}
                  onContextLost={() => setLost(true)}
                />
              </LazyMount>
            ) : (
              <Poster src={model.poster} alt={t("posterAlt", { title })} />
            )}

            <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-end gap-3 p-4">
              {live && !failed && (
                <Segmented
                  className="pointer-events-auto bg-bg/70"
                  label={t("passLabel")}
                  options={passes}
                  value={pass}
                  onChange={selectPass}
                />
              )}
            </div>

            {failed && (
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-4 bg-bg/80 p-4" role="alert">
                <span className="hud text-mono-xs text-sev-critical">✕ {tErr("modelFailed")}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setRetry((r) => r + 1);
                    setFailed(false);
                  }}
                >
                  {t("retry")}
                </Button>
              </div>
            )}

            {live && !failed && (
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4">
                <div className="flex flex-wrap gap-2">
                  <IconButton label={t("rotateLeft")} shortcut="←" onClick={() => send("left")}>⟲</IconButton>
                  <IconButton label={t("rotateRight")} shortcut="→" onClick={() => send("right")}>⟳</IconButton>
                  <IconButton label={t("zoomOut")} shortcut="−" onClick={() => send("out")}>−</IconButton>
                  <IconButton label={t("zoomIn")} shortcut="+" onClick={() => send("in")}>+</IconButton>
                  <IconButton label={t("reset")} shortcut="R" onClick={() => send("reset")}>⌂</IconButton>
                  <IconButton
                    label={autoRotate ? t("autoRotateOff") : t("autoRotateOn")}
                    shortcut="Space"
                    pressed={autoRotate}
                    onClick={() => setAutoRotate((a) => !a)}
                  >
                    {autoRotate ? "❚❚" : "▶"}
                  </IconButton>
                </div>
                <Segmented
                  className="bg-bg/70"
                  label={t("bgLabel")}
                  options={[
                    { value: "grid", label: t("bgGrid") },
                    { value: "studio", label: t("bgStudio") },
                  ]}
                  value={backdrop}
                  onChange={setBackdrop}
                />
              </div>
            )}
          </div>
          {!live && webgl !== null && (
            <p className="hud mt-3 text-mono-xs text-text-2">{webgl && !lost ? t("staticNotice") : tErr("webglUnavailable")}</p>
          )}
          {/* caption: below the stage on mobile, over its top-left corner from md (section fits a 900px screen) */}
          <div className="mt-6 max-w-3xl md:pointer-events-none md:absolute md:top-4 md:left-4 md:mt-0 md:max-w-[22rem]">
            <h3 className="text-h3 font-semibold">{title}</h3>
            <p className="hud mt-1 text-mono-xs text-text-2">
              {t("fromProject", { project: projectTitle(model.projectSlug) })} · {t("triangles", { count: model.triangles.toLocaleString(locale) })} ·{" "}
              {t("sizeKB", { size: Math.round(model.sizeKB) })} · {t("source")}: {fileName(model.source)}
            </p>
            <p className="mt-2 text-small text-text-2">{model.description[locale]}</p>
            <Button variant="ghost" href={`/projects/${model.projectSlug}`} className="md:pointer-events-auto">
              {t("caseLink", { project: projectTitle(model.projectSlug) })}
            </Button>
          </div>
        </div>

        {/* pickers */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-3">
          <Segmented
            label={t("projectLabel")}
            options={projectSlugs.map((s) => ({ value: s, label: projectTitle(s) }))}
            value={model.projectSlug}
            onChange={(s) => selectModel(models.find((m) => m.projectSlug === s)!.id)}
          />
          <div
            {...list.group}
            aria-label={t("listLabel")}
            className="-mx-(--page-margin) flex snap-x snap-mandatory gap-2 overflow-x-auto px-(--page-margin) pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {projectModels.map((m, i) => (
              <button
                key={m.id}
                type="button"
                {...list.item(i)}
                className={`flex min-w-56 shrink-0 snap-start items-center gap-3 rounded-qa-panel border p-2 text-left lg:min-w-0 ${
                  m.id === model.id ? "border-qa-accent bg-surface-1" : "border-line hover:border-text-3"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- 48px thumbnail of the poster */}
                <img src={thumb(m.poster)} alt="" width={48} height={48} loading="lazy" decoding="async" className="size-12 shrink-0 rounded-qa bg-surface-2 object-contain" />
                <span className="min-w-0">
                  <span className="block truncate text-small font-semibold text-text">
                    <span aria-hidden="true" className="mr-1 text-qa-accent">{m.id === model.id ? "●" : "○"}</span>
                    {m.title[locale]}
                  </span>
                  <span className="hud block truncate text-mono-xs text-text-3">{projectTitle(m.projectSlug)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </SectionShell>
  );
}
