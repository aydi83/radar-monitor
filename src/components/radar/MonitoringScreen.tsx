import { useState } from "react";
import { ArrowRight, Check, Globe, Plus, ShieldCheck, ThumbsDown, ThumbsUp, TrendingDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { RadarPlan } from "@/lib/radar-parser";
import { RadarMark } from "./RadarMark";
import { LanguageSelector } from "./LanguageSelector";

type DemoState = "stable" | "change";

export function MonitoringScreen({ plan, onNew }: { plan: RadarPlan; onNew: () => void }) {
  const { t } = useI18n();
  const [state, setState] = useState<DemoState>("stable");
  const [feedback, setFeedback] = useState<null | "yes" | "no">(null);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pb-10 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RadarMark size={22} animated />
          <span className="text-sm font-semibold tracking-[0.18em]">RADAR</span>
        </div>
        <LanguageSelector />
      </header>

      <main className="flex-1 py-8">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-medium text-success">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-radar-ping rounded-full bg-success" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {t("active")}
          </div>
          <p className="mt-3 text-base font-medium leading-snug">{plan.target}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("checkedAgo")}</p>
        </div>

        <div className="mt-4 inline-flex w-full rounded-full border border-border bg-card p-1 shadow-soft">
          {(["stable", "change"] as DemoState[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setState(s);
                setFeedback(null);
              }}
              aria-pressed={state === s}
              className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                state === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {s === "stable" ? t("demoStable") : t("demoChange")}
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] uppercase tracking-wide text-muted-foreground">
          {t("demo")}
        </p>

        {state === "stable" ? (
          <section className="mt-6 rounded-2xl border border-success/25 bg-success-soft p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-success">{t("noChange")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("noChangeSub")}</p>
          </section>
        ) : (
          <section className="mt-6 overflow-hidden rounded-2xl border border-alert/30 bg-card shadow-lift">
            <div className="flex items-center gap-2 bg-alert-soft px-5 py-3 text-sm font-semibold text-alert">
              <TrendingDown className="h-4 w-4" />
              {t("changeTitle")}
            </div>
            <div className="p-5">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <Cell label={t("before")} value="1 199 €" muted />
                <ArrowRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
                <Cell label={t("after")} value="1 019 €" />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-alert" />
                  <span>
                    <span className="text-muted-foreground">{t("whatChanged")}: </span>
                    {t("priceDrop")}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Globe className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>
                    <span className="text-muted-foreground">{t("source")}: </span>
                    {plan.sources[0]}
                  </span>
                </p>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                {feedback ? (
                  <p className="text-sm text-success">{t("thanks")}</p>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">{t("useful")}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFeedback("yes")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-success hover:text-success"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {t("yes")}
                      </button>
                      <button
                        onClick={() => setFeedback("no")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-destructive hover:text-destructive"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        {t("no")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <button
          onClick={onNew}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <Plus className="h-4 w-4" />
          {t("newRequest")}
        </button>
      </main>
    </div>
  );
}

function Cell({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`rounded-xl border border-border p-3 text-center ${muted ? "bg-secondary/60" : "bg-alert-soft"}`}>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        dir="ltr"
        className={`mt-1 text-xl font-semibold ${muted ? "text-muted-foreground line-through" : "text-alert"}`}
      >
        {value}
      </div>
    </div>
  );
}
