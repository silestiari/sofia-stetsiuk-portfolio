"use client";

import { BugHunt, type BugHuntLabels } from "./BugHunt";

const SCENE = "absolute inset-0 size-full";

/** Hero slot: the decorative grid with the "catch the bug" mini-game on top, on every screen size. */
export function HeroSceneSlot({ labels }: { labels: BugHuntLabels }) {
  return (
    <div data-hero-scene aria-hidden="true" className="relative size-full">
      <div className={`hero-slot-grid ${SCENE} opacity-(--grid-opacity)`} />
      <BugHunt labels={labels} className={SCENE} />
    </div>
  );
}
