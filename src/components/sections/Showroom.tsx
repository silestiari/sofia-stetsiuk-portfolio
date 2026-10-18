"use client";

import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { IconButton, Segmented } from "@/components/showroom/ShowroomControls";
import type { Backdrop, StageCommand } from "@/components/showroom/ShowroomStage";
import type { Pass } from "@/components/three/passes";
import { Button } from "@/components/ui/Button";
import { Crosshair } from "@/components/ui/Crosshair";
import { SectionShell } from "@/components/ui/SectionShell";
import { models } from "@/content/models";
import { getProject } from "@/content/projects";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import type { Model3D } from "@/content/types";

const Poster = ({ src, alt }: { src: string; alt: string }) => (
  // eslint-disable-next-line @next/next/no-img-element -- pre-sized webp poster from public/posters
  <img src={src} alt={alt} width={1024} height={1024} decoding="async" className="absolute inset-0 size-full object-contain p-6" />
);

const ShowroomStage = dynamic(() => import("@/components/showroom/ShowroomStage"), { ssr: false });

const card = (poster: string) => poster.replace("/posters/", "/posters/thumbs/");
const fileName = (path: string) => path.split(/[\\/]/).pop()?.split("#")[0] ?? path;
const setScrollLock = (on: boolean) => {
  document.documentElement.style.overflow = on ? "hidden" : "";
};

/** Home section: the Build Your Own Pet models. */
export function Showroom() {
  const t = useTranslations("sections.showroom");
  return (
    <SectionShell id="showroom" title={t("title")}>
      <p className="mt-8 max-w-prose text-lead font-light text-text">{t("intro")}</p>
      <ModelShowcase models={models.filter((m) => m.projectSlug === "build-your-pet")} />
    </SectionShell>
  );
}

/**
 * 3D showcase: a grid of glowing model cards; any card opens the model in a <dialog showModal> where it can be
 * rotated, zoomed and switched between render passes. Without WebGL the dialog shows the large poster.
 * Also used on case pages (Woodcutter vs Zombies).
 */
export function ModelShowcase({ models }: { models: Model3D[] }) {
  const t = useTranslations("sections.showroom");
  const locale = useLocale();
  const groups = [...new Set(models.map((m) => m.group))];
  const [group, setGroup] = useState("all");
  const [open, setOpen] = useState<Model3D | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const shown = group === "all" ? models : models.filter((m) => m.group === group);
  const groupLabel = (g: string) => t(`groups.${g}` as Parameters<typeof t>[0]);

  const show = (m: Model3D, button: HTMLButtonElement) => {
    opener.current = button;
    setOpen(m);
    dialog.current?.showModal();
    setScrollLock(true);
  };
  const onClosed = () => {
    setOpen(null);
    setScrollLock(false);
    opener.current?.focus();
  };
  useEffect(() => () => setScrollLock(false), []);

  return (
    <>
      {groups.length > 1 && (
        <Segmented
          className="mt-8"
          label={t("groupLabel")}
          options={[{ value: "all", label: t("allGroups") }, ...groups.map((g) => ({ value: g, label: groupLabel(g) }))]}
          value={group}
          onChange={setGroup}
        />
      )}

      <p className="hud mt-6 text-mono-xs text-qa-accent">↗ {t("clickHint")}</p>

      <ul aria-label={t("listLabel")} className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {shown.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={(e) => show(m, e.currentTarget)}
              className="group relative block w-full cursor-pointer border border-line bg-[radial-gradient(ellipse_at_center,var(--color-surface-2)_0%,var(--color-bg)_80%)] text-left transition-colors duration-150 hover:border-text-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- 400px card render of the model */}
              <img
                src={card(m.poster)}
                alt=""
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-contain p-3 transition-transform duration-500 ease-(--ease-expo) motion-safe:group-hover:scale-[1.04]"
              />
              <span
                aria-hidden="true"
                className="hud absolute top-2 right-2 rounded-full border border-ui-border bg-bg/80 px-3 py-1 text-mono-xs text-text-2 transition-colors duration-150 group-hover:border-qa-accent group-hover:text-qa-accent group-focus-visible:border-qa-accent group-focus-visible:text-qa-accent"
              >
                3D ↗
              </span>
              {/* "+" corners appear on hover / focus */}
              <span aria-hidden="true" className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Crosshair />
              </span>
              <span className="block border-t border-line px-3 py-2">
                {/* name = visible title first (voice control), then the action for screen readers */}
                <span className="hud relative block truncate text-mono-xs text-text">
                  {m.title[locale]}
                  <span className="sr-only"> — {t("open3d")}</span>
                </span>
                <span aria-hidden="true" className="block truncate text-small text-text-2">
                  {groupLabel(m.group)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-labelledby="showroom-dialog-title"
        onClose={onClosed}
        className="fixed inset-0 z-(--z-menu) m-auto h-[min(92dvh,860px)] w-[min(100%-1rem,1200px)] max-w-none overflow-hidden border border-line bg-bg p-0 text-text backdrop:bg-bg/90"
      >
        {open && <Viewer model={open} onClose={() => dialog.current?.close()} />}
      </dialog>
    </>
  );
}

function Viewer({ model, onClose }: { model: Model3D; onClose: () => void }) {
  const t = useTranslations("sections.showroom");
  const tErr = useTranslations("errors");
  const locale = useLocale();
  const hintId = useId();
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();

  const [pass, setPass] = useState<Pass>("beauty");
  const [backdrop, setBackdrop] = useState<Backdrop>("studio");
  const [autoRotate, setAutoRotate] = useState(!reduced);
  const [command, setCommand] = useState<StageCommand | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [lost, setLost] = useState(false);
  const live = webgl === true && !lost;

  const title = model.title[locale];
  const project = getProject(model.projectSlug)?.title[locale] ?? model.projectSlug;
  const passes: { value: Pass; label: string }[] = [
    { value: "wire", label: t("passWire") },
    { value: "clay", label: t("passClay") },
    { value: "shaded", label: t("passShaded") },
    { value: "beauty", label: t("passFinal") },
  ];
  const send = (kind: StageCommand["kind"]) => setCommand({ kind, id: Date.now() });

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
    <div className="flex h-full flex-col" role="group" aria-describedby={hintId} onKeyDown={onKeyDown}>
      <p id={hintId} className="sr-only">
        {t("keyboardHint")}
      </p>
      <div className="flex items-start justify-between gap-4 border-b border-line p-4">
        <div className="min-w-0">
          <p className="hud text-mono-xs text-text-3">{t("fromProject", { project })}</p>
          <h3 id="showroom-dialog-title" className="mt-1 font-display text-h3 font-semibold uppercase">
            {title}
          </h3>
          <p className="hud mt-1 text-mono-xs text-text-2">
            {t("triangles", { count: model.triangles.toLocaleString(locale) })} ·{" "}
            {t("sizeKB", { size: Math.round(model.sizeKB) })} · {t("source")}: {fileName(model.source)}
          </p>
        </div>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label={t("close")}
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-ui-border text-text transition-colors duration-150 hover:border-text"
        >
          ✕
        </button>
      </div>

      <div
        className={`relative min-h-0 flex-1 ${
          backdrop === "studio"
            ? "bg-[radial-gradient(ellipse_at_center,var(--color-surface-2)_0%,var(--color-bg)_80%)]"
            : "bg-[radial-gradient(ellipse_at_center,var(--color-surface-1)_0%,var(--color-bg)_75%)]"
        }`}
      >
        {live && !failed ? (
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
        ) : (
          <Poster src={model.poster} alt={t("posterAlt", { title })} />
        )}

        {live && !failed && pass !== "beauty" && <Crosshair rows={2} cols={2} className="m-4" />}

        {live && !failed && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-end p-4">
            <Segmented className="pointer-events-auto bg-bg/70" label={t("passLabel")} options={passes} value={pass} onChange={setPass} />
          </div>
        )}

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

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line px-4 py-3">
        <p className="text-small text-text-2">
          {model.description[locale]} {!live && webgl !== null && <span className="hud text-mono-xs">{tErr("webglUnavailable")}</span>}
        </p>
        <span className="flex flex-wrap gap-2">
          {model.storeUrl && (
            <Button variant="secondary" size="sm" href={model.storeUrl}>
              {t("storeLink")}
            </Button>
          )}
          <Button variant="secondary" size="sm" href={`/projects/${model.projectSlug}`}>
            {t("caseLink", { project })} <span aria-hidden="true">→</span>
          </Button>
        </span>
      </div>
    </div>
  );
}
