import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { parseRequest, type RadarPlan } from "@/lib/radar-parser";
import { LandingScreen } from "@/components/radar/LandingScreen";
import { ConfirmScreen } from "@/components/radar/ConfirmScreen";
import { MonitoringScreen } from "@/components/radar/MonitoringScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RADAR — Monitor anything, get told when it changes" },
      {
        name: "description",
        content:
          "Tell RADAR what you want to monitor — a product price, a company, a topic — and get alerted only when something important changes.",
      },
      { property: "og:title", content: "RADAR — Monitor anything, get told when it changes" },
      {
        property: "og:description",
        content: "Describe what to monitor in English, French or Arabic. RADAR watches it for you.",
      },
    ],
  }),
  component: RadarApp,
});

function RadarApp() {
  return (
    <I18nProvider>
      <RadarFlow />
    </I18nProvider>
  );
}

type Step = "landing" | "confirm" | "monitoring";

function RadarFlow() {
  const { lang } = useI18n();
  const [step, setStep] = useState<Step>("landing");
  const [raw, setRaw] = useState("");
  const [plan, setPlan] = useState<RadarPlan | null>(null);

  const start = (value: string) => {
    setRaw(value);
    setPlan(parseRequest(value, lang));
    setStep("confirm");
  };

  // Keep the plan copy aligned with the current UI language.
  const localizedPlan = plan ? parseRequest(plan.raw, lang) : null;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {step === "landing" || !localizedPlan ? (
        <LandingScreen initialValue={raw} onSubmit={start} />
      ) : step === "confirm" ? (
        <ConfirmScreen
          plan={localizedPlan}
          onConfirm={() => setStep("monitoring")}
          onEdit={() => setStep("landing")}
        />
      ) : (
        <MonitoringScreen
          plan={localizedPlan}
          onNew={() => {
            setRaw("");
            setPlan(null);
            setStep("landing");
          }}
        />
      )}
    </div>
  );
}
