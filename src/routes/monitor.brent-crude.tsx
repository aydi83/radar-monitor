import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { DiscoveryPage, discoveryHead } from "@/components/radar/DiscoveryPage";

export const Route = createFileRoute("/monitor/brent-crude")({
  head: discoveryHead({
    title: "Brent Crude Oil Price Monitoring \u2014 RADAR",
    description: "Monitor a public Brent crude price page and see a clear before/after when the quote changes. Informational only.",
    path: "/monitor/brent-crude",
  }),
  component: () => (
    <I18nProvider>
      <DiscoveryPage
        content={{
          h1: "Monitor Brent crude oil",
          intro: "Brent moves with the news cycle. Instead of reading it every hour, let RADAR watch the public price page you choose and report the change.",
          what: ["The Brent quote published on the page", "Daily change values on that page", "Other visible content on the same public page"],
          how: "You give RADAR one public page. It stores a first snapshot immediately, then re-checks it and compares the meaningful content. When nothing important moved, RADAR stays green and quiet. When it really changed, you see the before, the after, the source and the time.",
          example: { request: "Monitor Brent crude oil price", url: "https://oilprice.com/oil-price-charts" },
        }}
      />
    </I18nProvider>
  ),
});
