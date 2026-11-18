import { site, nav } from "@/content/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="#top" className="display text-2xl text-ink">
              MAYANK GOEL<span className="text-accent">.</span>
            </a>
            <p className="mt-3 max-w-sm text-sm text-ink-2">
              Backend systems, AI agents and the glue between them. {site.location}.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-ink-2 sm:grid-cols-3">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="rounded-full border border-line p-3 text-ink-2 transition-colors hover:border-accent hover:text-ink"
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="rounded-full border border-line p-3 text-ink-2 transition-colors hover:border-accent hover:text-ink"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-widest text-ink-3 sm:flex-row sm:justify-between">
          <span>© {year} {site.name}. Built with Next.js, Motion & Three.js.</span>
          <span>
            Press <kbd className="rounded border border-line px-1.5 py-0.5 text-ink-2">`</kbd> for the terminal
          </span>
        </div>
      </div>
    </footer>
  );
}
