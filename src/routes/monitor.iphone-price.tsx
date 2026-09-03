import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { DiscoveryPage, discoveryHead } from "@/components/radar/DiscoveryPage";

export const Route = createFileRoute("/monitor/iphone-price")({
  head: discoveryHead({
    title: "iPhone Price Monitoring \u2014 RADAR",
    description: "Track the official iPhone store page and get told only when the price or availability actually changes. Free, no noise.",
    path: "/monitor/iphone-price",
  }),
  component: () => (
    <I18nProvider>
      <DiscoveryPage
        content={{
          h1: "Monitor iPhone price changes",
          intro: "iPhone prices move quietly: a new model lands, an older one is repriced, a configuration goes out of stock. RADAR watches the exact Apple store page you choose and stays silent until something on it really changes.",
          what: ["The listed price of the iPhone models on the page you choose", "Availability and configuration wording", "Offer or trade-in text shown on that page"],
          how: "You give RADAR one public page. It stores a first snapshot immediately, then re-checks it and compares the meaningful content. When nothing important moved, RADAR stays green and quiet. When it really changed, you see the before, the after, the source and the time.",
          example: { request: "Monitor iPhone price", url: "https://www.apple.com/shop/buy-iphone" },
        }}
      />
    </I18nProvider>
  ),
});
