import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Playground } from "@/components/sections/Playground";
import { Beyond } from "@/components/sections/Beyond";
import { Contact } from "@/components/sections/Contact";
import { Marquee } from "@/components/sections/Marquee";

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Work />
        <Playground />
        <Beyond />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
