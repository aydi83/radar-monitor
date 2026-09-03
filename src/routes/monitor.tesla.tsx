import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { DiscoveryPage, discoveryHead } from "@/components/radar/DiscoveryPage";

export const Route = createFileRoute("/monitor/tesla")({
  head: discoveryHead({
    title: "Tesla Price & Model Monitoring \u2014 RADAR",
    description: "Watch Tesla's public configurator or model page and get notified when pricing or model wording changes.",
    path: "/monitor/tesla",
  }),
  component: () => (
    <I18nProvider>
      <DiscoveryPage
        content={{
          h1: "Monitor Tesla",
          intro: "Tesla adjusts prices, trims and delivery wording without announcements. RADAR snapshots the public page you choose and tells you when it moves.",
          what: ["Listed model prices on the page you choose", "Trim, range and option wording", "Delivery and incentive text shown publicly"],
          how: "You give RADAR one public page. It stores a first snapshot immediately, then re-checks it and compares the meaningful content. When nothing important moved, RADAR stays green and quiet. When it really changed, you see the before, the after, the source and the time.",
          example: { request: "Monitor Tesla prices", url: "https://www.tesla.com/models/design" },
        }}
      />
    </I18nProvider>
  ),
});
