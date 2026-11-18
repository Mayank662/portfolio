import { aboutIntro, education, principles, recognition, skills, timeline } from "@/content/about";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-16 py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Sticky heading column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                index="01"
                eyebrow="About"
                lines={["The person", "behind", "the code."]}
              />
              <Reveal delay={0.2} className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {principles.map((p) => (
                  <div key={p.k} className="bg-bg p-5">
                    <div className="font-display text-[15px] font-medium text-ink">{p.k}</div>
                    <div className="mt-1 text-sm text-ink-2">{p.v}</div>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>

          {/* Narrative column */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-7">
              {aboutIntro.map((p, i) => (
                <Reveal key={i} as="p" delay={i * 0.08} className="text-[clamp(1.15rem,1.6vw,1.45rem)] leading-[1.55] text-ink/90 first:text-ink">
                  {p}
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1} className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-3">
              <div>
                <div className="eyebrow">Experience</div>
                <div className="mt-2 text-sm text-ink">4+ years · AI & Backend</div>
              </div>
              <div>
                <div className="eyebrow">Base</div>
                <div className="mt-2 text-sm text-ink">{site.location}</div>
              </div>
              <div>
                <div className="eyebrow">Status</div>
                <div className="mt-2 flex items-center gap-2 text-sm text-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
                  Available
                </div>
              </div>
            </Reveal>

            {/* Timeline */}
            <div className="mt-20">
              <Reveal className="eyebrow mb-8">Journey</Reveal>
              <ol className="relative border-l border-line pl-8">
                {timeline.map((m, i) => (
                  <Reveal as="li" key={i} delay={i * 0.08} className="relative pb-10 last:pb-0">
                    <span
                      className={`absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full border ${
                        m.current ? "border-accent bg-accent shadow-[0_0_18px_rgba(168,85,247,0.7)]" : "border-line-2 bg-bg"
                      }`}
                    />
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">{m.period}</div>
                    <div className="mt-1.5 font-display text-xl text-ink">{m.title}</div>
                    <div className="text-sm text-accent-2/90">{m.org}</div>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-2">{m.note}</p>
                  </Reveal>
                ))}
                <Reveal as="li" delay={0.3} className="relative">
                  <span className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full border border-line-2 bg-bg" />
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">{education.period}</div>
                  <div className="mt-1.5 font-display text-xl text-ink">{education.degree}</div>
                  <div className="text-sm text-accent-2/90">{education.school}</div>
                </Reveal>
              </ol>
            </div>

            {/* Skills + recognition */}
            <div className="mt-20 grid gap-12 sm:grid-cols-5">
              <div className="sm:col-span-3">
                <Reveal className="eyebrow mb-6">Toolbox</Reveal>
                <div className="space-y-5">
                  {Object.entries(skills).map(([group, items], gi) => (
                    <Reveal key={group} delay={gi * 0.06}>
                      <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">{group}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-line bg-bg-2/50 px-2.5 py-1 text-[12.5px] text-ink/90"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <Reveal className="eyebrow mb-6">Recognition</Reveal>
                <ul className="space-y-4">
                  {recognition.map((r, i) => (
                    <Reveal as="li" key={i} delay={i * 0.08} className="flex gap-3 text-sm leading-relaxed text-ink-2">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {r}
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
