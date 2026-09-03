import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { DiscoveryPage, discoveryHead } from "@/components/radar/DiscoveryPage";

export const Route = createFileRoute("/monitor/gold-price")({
  head: discoveryHead({
    title: "Gold Price Monitoring \u2014 RADAR",
    description: "Watch a public gold price page and be told only when the quoted price meaningfully changes. Informational only, not financial advice.",
    path: "/monitor/gold-price",
  }),
  component: () => (
    <I18nProvider>
      <DiscoveryPage
        content={{
          h1: "Monitor the gold price",
          intro: "Gold quotes update constantly, but most of that movement is noise. RADAR keeps a snapshot of the public price page you pick and reports the before and after when the content genuinely changes.",
          what: ["The quoted spot price shown on the page", "Daily change figures published on the page", "Any other visible text on that public quote page"],
          how: "You give RADAR one public page. It stores a first snapshot immediately, then re-checks it and compares the meaningful content. When nothing important moved, RADAR stays green and quiet. When it really changed, you see the before, the after, the source and the time.",
          example: { request: "Monitor gold price", url: "https://www.kitco.com/price/precious-metals" },
        }}
      />
    </I18nProvider>
  ),
});
