import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { RadarMark } from "@/components/radar/RadarMark";
import { LanguageSelector } from "@/components/radar/LanguageSelector";
import { SiteFooter } from "@/components/radar/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RADAR — monitoring that tells you when something changes" },
      {
        name: "description",
        content:
          "RADAR watches a public web page you choose and tells you when it really changes. Free, minimal, available in English, French and Arabic.",
      },
      { property: "og:title", content: "About RADAR" },
      {
        property: "og:description",
        content: "Why RADAR exists, how it monitors public pages, and what it will never do.",
      },
    ],
    links: [{ rel: "canonical", href: "https://radar.lovable.app/about" }],
  }),
  component: () => (
    <I18nProvider>
      <AboutPage />
    </I18nProvider>
  ),
});

function AboutPage() {
  const { t } = useI18n();
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
        <h1 className="text-2xl font-semibold tracking-tight">About RADAR</h1>
        <p className="mt-1 text-sm font-medium text-primary-glow">{t("slogan")}</p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            RADAR exists for one simple reason: important things change quietly. A price drops, a
            page is updated, an offer appears — and most people find out too late.
          </p>
          <h2 className="text-base font-semibold text-foreground">How it works</h2>
          <p>
            You describe what you want to monitor in plain language and give one public web page as
            the source. RADAR stores a snapshot of that page, then re-checks it automatically every
            few hours. When the meaningful content of the page changes, RADAR shows you what it
            looked like before, what it looks like now, the source and the time.
          </p>
          <h2 className="text-base font-semibold text-foreground">What RADAR is not</h2>
          <p>
            RADAR is not a crawler of the whole internet, not an advertising product and not a
            financial adviser. Price and market information shown by RADAR is informational only.
            The basic experience is free — no card, no subscription.
          </p>
          <h2 className="text-base font-semibold text-foreground">Languages</h2>
          <p>
            RADAR always opens in English, and can be switched to Français or العربية at any time.
            Arabic is fully right-to-left.
          </p>
        </div>

        <p className="mt-10 border-t border-border pt-5 text-sm text-foreground">
          RADAR was founded and created by AYDI ADEL in 2026.
        </p>

        <SiteFooter />
      </main>
    </div>
  );
}
