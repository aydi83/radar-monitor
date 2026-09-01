import { createFileRoute, Link } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { RadarMark } from "@/components/radar/RadarMark";
import { LanguageSelector } from "@/components/radar/LanguageSelector";
import { SiteFooter } from "@/components/radar/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — RADAR" },
      {
        name: "description",
        content:
          "What RADAR stores, why, and how to delete your account and all of your monitoring data at any time.",
      },
      { property: "og:title", content: "Privacy Policy — RADAR" },
      { property: "og:description", content: "How RADAR handles your account and monitoring data." },
    ],
    links: [{ rel: "canonical", href: "https://radar.lovable.app/privacy" }],
  }),
  component: () => (
    <I18nProvider>
      <PrivacyPage />
    </I18nProvider>
  ),
});

function PrivacyPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-base font-semibold text-foreground">What we store</h2>
          <p>
            Your email address and an encrypted password (used only to secure your account), the
            monitoring requests you create, the public URL you asked RADAR to watch, snapshots of
            that public page, check results and detected changes.
          </p>
          <h2 className="text-base font-semibold text-foreground">What we do not do</h2>
          <p>
            We do not sell your data, we do not show advertising, we do not ask for payment details
            and we do not monitor pages that require your personal login.
          </p>
          <h2 className="text-base font-semibold text-foreground">Who can see your data</h2>
          <p>
            Only you. Every monitoring record is protected at the database level by row-level
            security rules bound to your account, so another signed-in user cannot read or modify
            your monitors.
          </p>
          <h2 className="text-base font-semibold text-foreground">Emails</h2>
          <p>
            Today RADAR only sends account-related emails (such as email confirmation). Change
            alerts are shown inside the app. If email alerts are added later, they will be optional.
          </p>
          <h2 className="text-base font-semibold text-foreground">Deleting your account</h2>
          <p>
            You can delete your account at any time from the My Radar page. Deletion removes your
            account and all of your monitors, snapshots, checks and detected changes permanently.
          </p>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p>For any privacy question, use the contact channel published on the About page.</p>
        </div>
        <SiteFooter />
      </main>
    </div>
  );
}
