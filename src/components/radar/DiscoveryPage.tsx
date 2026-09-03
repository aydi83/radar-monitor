import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RadarMark } from "./RadarMark";
import { SiteFooter } from "./SiteFooter";

export interface DiscoveryContent {
  h1: string;
  intro: string;
  what: string[];
  how: string;
  example: { request: string; url: string };
}

/**
 * Concise public page explaining one thing RADAR can genuinely monitor, and
 * sending the visitor straight into the real flow.
 */
export function DiscoveryPage({ content }: { content: DiscoveryContent }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-10 pt-5 sm:max-w-2xl sm:px-6">
      <header>
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <RadarMark size={24} />
          <span className="truncate text-base font-semibold tracking-[0.2em]">RADAR</span>
        </Link>
      </header>

      <main className="flex-1 py-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{content.h1}</h1>
        <p className="mt-1 text-sm font-medium text-primary-glow">See the Change. Spot the Chance.</p>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{content.intro}</p>

        <h2 className="mt-8 text-lg font-semibold tracking-tight">What RADAR watches here</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {content.what.map((w) => (
            <li key={w} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-glow" />
              <span>{w}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-lg font-semibold tracking-tight">How it works</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{content.how}</p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Try it
          </p>
          <p className="mt-2 break-words text-sm">{content.example.request}</p>
          <p dir="ltr" className="mt-1 break-all text-xs text-muted-foreground">
            {content.example.url}
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lift transition-colors hover:bg-primary/92"
          >
            Start monitoring with RADAR
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Informational monitoring only — not financial advice.
        </p>

        <SiteFooter />
      </main>
    </div>
  );
}

export function discoveryHead(opts: {
  title: string;
  description: string;
  path: string;
}) {
  return () => ({
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
    ],
    links: [{ rel: "canonical", href: `https://radar.lovable.app${opts.path}` }],
  });
}
