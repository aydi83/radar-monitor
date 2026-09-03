import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Handshake, Info, Mail } from "lucide-react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { RadarMark } from "@/components/radar/RadarMark";
import { LanguageSelector } from "@/components/radar/LanguageSelector";
import { SiteFooter } from "@/components/radar/SiteFooter";
import { ABOUT_COPY } from "@/lib/about-content";

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
  const { t, lang } = useI18n();
  const c = ABOUT_COPY[lang];
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
            RADAR
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{c.aboutTitle}</h1>
          <p className="mt-1 text-sm font-medium text-primary-glow">See the Change. Spot the Chance.</p>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
            {c.aboutParas.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section id="business" className="mt-12 scroll-mt-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary-glow">
            <Building2 className="h-3.5 w-3.5" />
            {t("navBusiness")}
          </div>
          <h2 className="text-xl font-semibold tracking-tight">{c.businessTitle}</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>{c.businessIntro}</p>
            <ul className="space-y-2">
              {c.businessItems.map((line) => (
                <li key={line} className="flex gap-2">
                  <Handshake className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p>
              {c.businessContact}{" "}
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
            {t("navContact")}
          </div>
          <h2 className="text-xl font-semibold tracking-tight">{c.contactTitle}</h2>
          <div className="mt-4 grid gap-3">
            {c.contactItems.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                <a
                  dir="ltr"
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(item.title)}`}
                  className="mt-2 inline-block break-all text-sm text-primary-glow underline underline-offset-4"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            ))}
          </div>
        </section>

        <SiteFooter />

        <p className="mt-6 text-center text-xs text-muted-foreground">{c.founder}</p>
      </main>
    </div>
  );
}
