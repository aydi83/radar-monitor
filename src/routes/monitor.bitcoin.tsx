import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { DiscoveryPage, discoveryHead } from "@/components/radar/DiscoveryPage";

export const Route = createFileRoute("/monitor/bitcoin")({
  head: discoveryHead({
    title: "Bitcoin Price Monitoring \u2014 RADAR",
    description: "Follow a public Bitcoin price page with RADAR and get a clear before/after when it changes. Informational only, not financial advice.",
    path: "/monitor/bitcoin",
  }),
  component: () => (
    <I18nProvider>
      <DiscoveryPage
        content={{
          h1: "Monitor Bitcoin",
          intro: "You do not need another live chart. RADAR watches the public Bitcoin page you choose and shows you what it said before, what it says now, the source and the time.",
          what: ["The quoted BTC price on the page you choose", "Percentage change text published on that page", "Related figures shown alongside the quote"],
          how: "You give RADAR one public page. It stores a first snapshot immediately, then re-checks it and compares the meaningful content. When nothing important moved, RADAR stays green and quiet. When it really changed, you see the before, the after, the source and the time.",
          example: { request: "Monitor Bitcoin price", url: "https://www.coindesk.com/price/bitcoin" },
        }}
      />
    </I18nProvider>
  ),
});
