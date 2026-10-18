"use client";

import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LazyMount } from "@/components/LazyMount";
import type { Placed } from "@/components/pet-builder/PetStage";
import { PartPicker, type PickerTab } from "@/components/pet-builder/PartPicker";
import { SectionShell } from "@/components/ui/SectionShell";
import { petParts } from "@/content/models";
import { MOBILE_QUERY, useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";

const PetStage = dynamic(() => import("@/components/pet-builder/PetStage"), { ssr: false });

const { slots, elements, parts, accessories } = petParts;
const POSTER = "/posters/pet-cotton-cloud.webp";
// Default = the all-AIR "Cotton Cloud" pet, the same one shown in the Showroom.
const DEFAULT_BUILD = Object.fromEntries(slots.map((s) => [s.id, "AIR"])) as Record<string, string>;
const add = (a: number[], b: number[]) => a.map((v, i) => v + (b[i] ?? 0));
const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** Game Design Playground (DESIGN_SYSTEM.md 4.12 / 5.8): assemble a pet from real Build Your Pet parts. */
export function GamePlayground() {
  const t = useTranslations("sections.game-playground");
  const locale = useLocale();
  const webgl = useWebGLSupport();
  const reduced = usePrefersReducedMotion();
  const coarse = useMediaQuery(MOBILE_QUERY, true);
  const [lost, setLost] = useState(false);
  const [build, setBuild] = useState(DEFAULT_BUILD);
  const [accessory, setAccessory] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");

  const partFor = (slot: string) => parts.find((p) => p.slot === slot && p.element === build[slot])!;
  // Element names come from the dictionary (Air / Fire / Water), the same terms as the case study and Showroom.
  const elementTitle = (id: string) => t(`elements.${id as "AIR" | "FIRE" | "WATER"}`);
  // Pending Randomize steps: cancelled by Reset, a manual choice, another Randomize and unmount (QA D-04).
  const timers = useRef<number[]>([]);
  const cancelPending = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => cancelPending, []);
  const acc = accessories.find((a) => a.id === accessory) ?? null;
  const rarity = (r: string) => t(`rarity${r as "RARE" | "EPIC" | "LEGENDARY"}`);

  const placed = useMemo<Placed[]>(() => {
    const list = slots.map((s) => {
      const p = parts.find((x) => x.slot === s.id && x.element === build[s.id])!;
      return { key: p.id, file: p.file, at: p.socket };
    });
    if (acc) {
      // Accessory goes to the socket of the part in its slot + that part's first anchor (pet-parts.json "assembly").
      const host = parts.find((x) => x.slot === acc.slot && x.element === build[acc.slot])!;
      list.push({ key: `${acc.id}@${host.id}`, file: acc.file, at: add(host.socket, host.accessoryAnchors[0]) });
    }
    return list;
  }, [build, acc]);

  // Set bonus (SetBonuses.luau): 2 / 4 / 6 parts of one element across the 6 slots; the accessory doesn't count.
  // Only the highest tier of the dominant element is shown: one element ability is active at a time.
  const top = elements
    .map((e) => ({ id: e.id, n: slots.filter((s) => build[s.id] === e.id).length }))
    .reduce((a, b) => (b.n > a.n ? b : a));
  const tier = top.n >= 6 ? 6 : top.n >= 4 ? 4 : top.n >= 2 ? 2 : 0;
  const bonus = tier
    ? t(`setBonus.tier${tier as 2 | 4 | 6}`, { count: top.n, element: elementTitle(top.id) })
    : t("setBonus.none");

  const counts = elements
    .map((e) => ({ id: e.id, n: slots.filter((s) => build[s.id] === e.id).length }))
    .filter((c) => c.n > 0)
    .map((c) => t("elementCount", { element: elementTitle(c.id), count: c.n }))
    .join(" · ");

  const tabs: PickerTab[] = [
    ...slots.map((s) => ({
      id: s.id,
      label: s.title[locale],
      value: build[s.id],
      options: parts
        .filter((p) => p.slot === s.id)
        .map((p) => ({ value: p.element, label: elementTitle(p.element), swatch: p.element })),
    })),
    {
      id: "ACCESSORY",
      label: t("accessory"),
      value: accessory ?? "",
      options: [
        { value: "", label: t("accessoryNone"), swatch: "NONE" },
        ...accessories.map((a) => ({ value: a.id, label: rarity(a.rarity), swatch: a.rarity })),
      ],
    },
  ];

  const choose = (tab: PickerTab, value: string) => {
    cancelPending();
    if (tab.id === "ACCESSORY") setAccessory(value || null);
    else setBuild((b) => ({ ...b, [tab.id]: value }));
    setAnnounce(t("selected", { slot: tab.label, option: tab.options.find((o) => o.value === value)!.label }));
  };

  const randomize = () => {
    const next = Object.fromEntries(slots.map((s) => [s.id, pick(parts.filter((p) => p.slot === s.id)).element]));
    const nextAcc = pick([null, ...accessories.map((a) => a.id)]);
    // DESIGN_SYSTEM.md 8.2: parts land one after another, stagger 60ms (≤ 6 steps).
    cancelPending();
    timers.current = [
      ...slots.map((s, i) => window.setTimeout(() => setBuild((b) => ({ ...b, [s.id]: next[s.id] })), reduced ? 0 : i * 60)),
      window.setTimeout(() => setAccessory(nextAcc), reduced ? 0 : slots.length * 60),
    ];
    setAnnounce(
      elements
        .map((e) => ({ e, n: slots.filter((s) => next[s.id] === e.id).length }))
        .filter((c) => c.n > 0)
        .map((c) => t("elementCount", { element: elementTitle(c.e.id), count: c.n }))
        .join(" · "),
    );
  };

  const reset = () => {
    cancelPending();
    setBuild(DEFAULT_BUILD);
    setAccessory(null);
    setAnnounce(t("elementCount", { element: elementTitle("AIR"), count: slots.length }));
  };

  const show3D = webgl === true && !lost;

  return (
    <SectionShell
      id="game-playground"
      title={t("title")}
      headingClassName="font-display text-h1 font-medium"
      className="mx-[clamp(8px,2vw,32px)] rounded-pet-lg bg-pet-bg text-pet-ink"
    >
      <p className="mt-6 max-w-prose text-lead text-pet-ink-2">{t("intro")}</p>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="relative aspect-square overflow-hidden rounded-pet-lg bg-pet-surface shadow-pet">
            {show3D ? (
              <LazyMount
                className="absolute inset-0"
                // eslint-disable-next-line @next/next/no-img-element -- poster until three.js arrives
                fallback={<img src={POSTER} alt="" loading="lazy" decoding="async" className="size-full object-contain p-8" />}
              >
                <PetStage
                  parts={placed}
                  reduced={reduced}
                  draggable={!coarse}
                  label={`${t("stageLabel")}: ${counts}`}
                  onContextLost={() => setLost(true)}
                />
              </LazyMount>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- static sample pet
              <img src={POSTER} alt={elementTitle("AIR")} loading="lazy" decoding="async" className="size-full object-contain p-8" />
            )}
          </div>
          {!show3D && webgl !== null && <p className="mt-3 text-small text-pet-ink-2">{t("posterNote")}</p>}
          {show3D && !coarse && <p className="mt-3 text-small text-pet-ink-2">{t("dragHint")}</p>}
        </div>

        <div className="flex flex-col gap-8 lg:col-span-6">
          <PartPicker tabs={tabs} label={t("categoriesLabel")} optionsLabel={(slot) => t("optionsLabel", { slot })} onChoose={choose} />

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={randomize}
              className="h-12 rounded-full border-2 border-pet-ink bg-pet-butter px-6 font-semibold text-pet-ink transition-transform duration-(--dur-micro) ease-(--ease-soft) hover:scale-103 focus-visible:[outline:var(--ring-pet)]"
            >
              {t("randomize")}
            </button>
            <button
              type="button"
              onClick={reset}
              className="h-11 font-semibold text-pet-ink underline underline-offset-4 focus-visible:[outline:var(--ring-pet)]"
            >
              {t("reset")}
            </button>
          </div>

          {/* 2D summary: also the whole result when 3D is unavailable */}
          <section aria-labelledby="pet-composition" className="rounded-pet bg-pet-surface p-6">
            <h3 id="pet-composition" className="font-display text-h3 font-medium">
              {t("composition")}
            </h3>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-small">
              {slots.map((s) => (
                <div key={s.id} className="contents">
                  <dt className="text-pet-ink-2">{s.title[locale]}</dt>
                  <dd className="font-semibold">{elementTitle(partFor(s.id).element)}</dd>
                </div>
              ))}
              <dt className="text-pet-ink-2">{t("accessory")}</dt>
              <dd className="font-semibold">{acc ? acc.title[locale] : t("accessoryNone")}</dd>
              {acc && (
                <>
                  <dt className="text-pet-ink-2">{t("rarity")}</dt>
                  <dd className="font-semibold">{rarity(acc.rarity)}</dd>
                </>
              )}
            </dl>
            <p className="mt-4 text-small">
              <span className="text-pet-ink-2">{t("element")}: </span>
              <span className="font-semibold">{counts}</span>
            </p>
            <div className="mt-4 rounded-pet bg-pet-bg p-4">
              <p className="text-small text-pet-ink-2">{t("setBonus.label")}</p>
              {/* stable live region; the keyed child animates in (spring pet «плюх», DESIGN_SYSTEM.md 8.1) */}
              <div aria-live="polite" className="mt-1 min-h-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`${tier}-${top.id}-${top.n}`}
                    className="font-semibold"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.12 } }}
                    transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 320, damping: 14, mass: 0.8 }}
                  >
                    {bonus}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </section>

          <div>
            <h3 className="font-semibold">{t("designNoteTitle")}</h3>
            <p className="mt-1 max-w-prose text-pet-ink-2">{t("designNote")}</p>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </SectionShell>
  );
}
