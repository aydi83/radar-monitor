import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { parseRequest, type RadarPlan } from "@/lib/radar-parser";
import { LandingScreen } from "@/components/radar/LandingScreen";
import { ConfirmScreen } from "@/components/radar/ConfirmScreen";
import { MonitoringScreen } from "@/components/radar/MonitoringScreen";
import { createMonitorTask } from "@/lib/monitor.functions";
import { savePendingRequest } from "@/lib/pending-request";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RADAR — See the Change. Spot the Chance." },
      {
        name: "description",
        content:
          "RADAR monitors a public page you choose — a product price, a market, a company or a topic — and tells you only when something meaningful changes. Free.",
      },
      { property: "og:title", content: "RADAR — See the Change. Spot the Chance." },
      {
        property: "og:description",
        content: "Monitor prices, markets, companies and topics. RADAR tells you when they change.",
      },
    ],
    links: [{ rel: "canonical", href: "https://radar.lovable.app/" }],
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
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const create = useServerFn(createMonitorTask);
  const [step, setStep] = useState<Step>("landing");
  const [raw, setRaw] = useState("");
  const [url, setUrl] = useState("");
  const [plan, setPlan] = useState<RadarPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = (value: string, sourceUrl: string) => {
    setRaw(value);
    // A suggested source URL belongs to the request that produced it: never let
    // a previous starter URL survive silently into a different request.
    setUrl(sourceUrl);
    setPlan(parseRequest(value, lang));
    setStep("confirm");
  };

  // Keep the plan copy aligned with the current UI language.
  const localizedPlan = plan ? parseRequest(plan.raw, lang) : null;

  const activate = async () => {
    if (!localizedPlan || !url.trim()) return;
    setError(null);
    setBusy(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Preserve the request through free signup, then continue automatically.
        savePendingRequest({
          requestText: localizedPlan.raw,
          url: url.trim(),
          condition: localizedPlan.condition,
        });
        navigate({ to: "/auth" });
        return;
      }
      const res = await create({
        data: {
          requestText: localizedPlan.raw,
          url: url.trim(),
          condition: localizedPlan.condition,
        },
      });
      if (res.ok) navigate({ to: "/radar/$id", params: { id: res.id } });
      else setError(t("urlInvalid"));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {step === "landing" || !localizedPlan ? (
        <LandingScreen initialValue={raw} initialUrl={url} onSubmit={start} />
      ) : step === "confirm" ? (
        <ConfirmScreen
          plan={localizedPlan}
          url={url}
          onUrlChange={setUrl}
          onActivate={activate}
          onDemo={() => setStep("monitoring")}
          onEdit={() => setStep("landing")}
          busy={busy}
          error={error}
        />
      ) : (
        <MonitoringScreen
          plan={localizedPlan}
          onBack={() => setStep("confirm")}
          onNew={() => {
            setRaw("");
            setUrl("");
            setPlan(null);
            setStep("landing");
          }}
        />
      )}
    </div>
  );
}
