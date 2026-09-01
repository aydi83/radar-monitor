import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { RadarMark } from "@/components/radar/RadarMark";
import { LanguageSelector } from "@/components/radar/LanguageSelector";
import { SiteFooter } from "@/components/radar/SiteFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — RADAR" },
      {
        name: "description",
        content:
          "The simple rules for using RADAR's free public page monitoring: fair use, informational content, and account responsibilities.",
      },
      { property: "og:title", content: "Terms of Use — RADAR" },
      { property: "og:description", content: "The rules for using RADAR's free monitoring service." },
    ],
    links: [{ rel: "canonical", href: "https://radar.lovable.app/terms" }],
  }),
  component: () => (
    <I18nProvider>
      <TermsPage />
    </I18nProvider>
  ),
});

function TermsPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-10 pt-5 sm:max-w-2xl sm:px-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <RadarMark size={24} />
          <span className="truncate text-base font-semibold tracking-[0.2em]">RADAR</span>
        </Link>
        <div className="shrink-0">
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Terms of Use</h1>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-base font-semibold text-foreground">The service</h2>
          <p>
            RADAR monitors public web pages that you choose and reports when their content changes.
            The basic service is provided free of charge, as is, without warranty of availability,
            completeness or accuracy.
          </p>
          <h2 className="text-base font-semibold text-foreground">Fair use</h2>
          <p>
            You may only submit public pages that you are allowed to access without authentication.
            Do not use RADAR to overload a website, bypass access controls, or collect personal
            data about other people. Checks run at conservative intervals and manual checks are
            rate limited.
          </p>
          <h2 className="text-base font-semibold text-foreground">No financial advice</h2>
          <p>
            Prices, rates and market information surfaced by RADAR are informational only and may be
            delayed or incorrect. Nothing in RADAR is financial, investment or legal advice.
          </p>
          <h2 className="text-base font-semibold text-foreground">Your account</h2>
          <p>
            You are responsible for keeping your credentials safe and for the requests you create.
            You can delete your account and all associated data at any time from My Radar. We may
            suspend accounts that abuse the service.
          </p>
          <h2 className="text-base font-semibold text-foreground">Changes</h2>
          <p>These terms may be updated as RADAR evolves; the current version always applies.</p>
        </div>
        <SiteFooter />
      </main>
    </div>
  );
}
