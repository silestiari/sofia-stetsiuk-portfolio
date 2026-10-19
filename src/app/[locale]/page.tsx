import { Suspense } from "react";
import { About } from "@/components/sections/About";
import { AiLab } from "@/components/sections/AiLab";
import { Contact } from "@/components/sections/Contact";
import { GamePlayground } from "@/components/sections/GamePlayground";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Showroom } from "@/components/sections/Showroom";
import { Skills } from "@/components/sections/Skills";
import { MarqueeBand } from "@/components/ui/MarqueeBand";

// One line per section, in the order of src/content/sections.ts (+ the decorative marquee band).
// Nothing here suspends: each <Suspense> only gives React a boundary to hydrate on its own, so hydration runs as
// several short tasks (hero first) instead of one long one that blocks the main thread.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense>
        <Projects />
      </Suspense>
      <Suspense>
        <Showroom />
      </Suspense>
      {/* the one giant-type band: the seam between the work and the person (not a section, not in the nav) */}
      <MarqueeBand />
      <Suspense>
        <About />
      </Suspense>
      <Suspense>
        <Skills />
      </Suspense>
      <Suspense>
        <AiLab />
      </Suspense>
      <Suspense>
        <GamePlayground />
      </Suspense>
      <Suspense>
        <Contact />
      </Suspense>
    </>
  );
}
