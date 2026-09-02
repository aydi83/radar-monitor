import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Handshake, Info, Mail } from "lucide-react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { RadarMark } from "@/components/radar/RadarMark";
import { LanguageSelector } from "@/components/radar/LanguageSelector";
import { SiteFooter } from "@/components/radar/SiteFooter";

const CONTACT_EMAIL = "radar.business.contact@gmail.com";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RADAR — information, business and contact" },
      {
        name: "description",
        content:
          "What RADAR is, how it detects meaningful changes in prices, markets, companies and topics, business & partnership opportunities, and how to contact the RADAR team.",
      },
      { property: "og:title", content: "About RADAR — information, business and contact" },
      {
        property: "og:description",
        content:
          "RADAR monitors what you choose and reports only meaningful change. Business partnerships and contact information.",
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

      <nav className="mt-6 flex flex-wrap gap-2 text-xs">
        <a href="#about" className="min-h-9 rounded-full border border-border px-3 py-2">
          {t("navAbout")} RADAR
        </a>
        <a href="#business" className="min-h-9 rounded-full border border-border px-3 py-2">
          {t("navBusiness")}
        </a>
        <a href="#contact" className="min-h-9 rounded-full border border-border px-3 py-2">
          {t("navContact")}
        </a>
      </nav>

      <main className="flex-1 py-8">
        <section id="about" className="scroll-mt-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary-glow">
            <Info className="h-3.5 w-3.5" />
            About RADAR
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">About RADAR</h1>
          <p className="mt-1 text-sm font-medium text-primary-glow">See the Change. Spot the Chance.</p>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              RADAR is a simple monitoring service. You choose what matters to you — a product, a
              market, a topic, a company, a price or any other public information — and RADAR keeps
              watching it for you.
            </p>
            <p>
              RADAR monitors selected products, markets, topics, companies, prices and other
              public information sources. It stores a snapshot of the page you選 choose, re-checks it
              automatically, and compares the meaningful content over time.
            </p>
            <p>
              The core idea is deliberately narrow: detect meaningful change instead of overwhelming
              you with thousands of links. RADAR does not try to be a search engine or a news feed.
              It stays quiet while nothing important happens, and speaks only when something really
              changed — showing what it was before, what it is now, the source and the time.
            </p>
            <p>
              The basic experience is free. Price and market information shown by RADAR is
              informational only and is not financial advice.
            </p>
            <p className="text-foreground">RADAR was founded and created by AYDI ADEL 2026</p>
          </div>
        </section>

        <section id="business" className="mt-12 scroll-mt-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary-glow">
            <Building2 className="h-3.5 w-3.5" />
            Business
          </div>
          <h2 className="text-xl font-semibold tracking-tight">RADAR for businesses and partners</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              RADAR is free for users and will stay free: there are no subscriptions, no payment
              systems and no paid user plans. Commercial value is built on the business side.
            </p>
            <ul className="space-y-2">
              {[
                "Business partnerships — working with retailers, publishers and platforms whose public information is worth monitoring.",
                "Market monitoring — following public market and category movements relevant to a business.",
                "Product & price intelligence — structured awareness of public price and availability changes.",
                "Future advertising opportunities — clean, non-intrusive placements once RADAR reaches scale.",
                "Referral and affiliate partnerships — sending qualified, intent-driven traffic to partners.",
                "Other commercial collaborations — data, integration and co-marketing discussions.",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <Handshake className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p>
              For any of the above, write to{" "}
              <a dir="ltr" className="text-foreground underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>

        <section id="contact" className="mt-12 scroll-mt-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary-glow">
            <Mail className="h-3.5 w-3.5" />
            Contact
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Contact RADAR</h2>
          <div className="mt-4 grid gap-3">
            {[
              { title: "General inquiries", desc: "Questions about RADAR and how it works." },
              { title: "Business & Partnerships", desc: "Partnerships, referrals and commercial collaboration." },
              { title: "Feedback / Report a problem", desc: "Bugs, wrong results or suggestions." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <p className="text-sm font-medium">{c.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                <a
                  dir="ltr"
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(c.title)}`}
                  className="mt-2 inline-block break-all text-sm text-primary-glow underline underline-offset-4"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
