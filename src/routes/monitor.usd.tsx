import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { DiscoveryPage, discoveryHead } from "@/components/radar/DiscoveryPage";

export const Route = createFileRoute("/monitor/usd")({
  head: discoveryHead({
    title: "US Dollar Rate Monitoring \u2014 RADAR",
    description: "Track a public USD exchange-rate table with RADAR and be told when the published rates change. Informational only.",
    path: "/monitor/usd",
  }),
  component: () => (
    <I18nProvider>
      <DiscoveryPage
        content={{
          h1: "Monitor the US dollar rate",
          intro: "Exchange-rate tables change quietly. RADAR keeps a snapshot of the public table you pick and shows exactly what shifted.",
          what: ["Published USD rates against other currencies", "Table update wording and timestamps", "Any other visible text on that public page"],
          how: "You give RADAR one public page. It stores a first snapshot immediately, then re-checks it and compares the meaningful content. When nothing important moved, RADAR stays green and quiet. When it really changed, you see the before, the after, the source and the time.",
          example: { request: "Monitor the US dollar rate", url: "https://www.x-rates.com/table/?from=USD" },
        }}
      />
    </I18nProvider>
  ),
});
