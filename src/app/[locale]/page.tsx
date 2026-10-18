import { About } from "@/components/sections/About";
import { AiLab } from "@/components/sections/AiLab";
import { Contact } from "@/components/sections/Contact";
import { GamePlayground } from "@/components/sections/GamePlayground";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Showroom } from "@/components/sections/Showroom";
import { Skills } from "@/components/sections/Skills";

// One line per section, in the order of src/content/sections.ts.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <Showroom />
      <About />
      <Skills />
      <AiLab />
      <GamePlayground />
      <Contact />
    </>
  );
}
