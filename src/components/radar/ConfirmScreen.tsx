import { useState } from "react";
import { ArrowRight, Bell, Check, Globe, Link2, Loader2, Pencil, Target } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { RadarPlan } from "@/lib/radar-parser";
import { RadarMark } from "./RadarMark";
import { LanguageSelector } from "./LanguageSelector";
import { SiteFooter } from "./SiteFooter";

export function ConfirmScreen({
  plan,
  url,
  onUrlChange,
  onActivate,
  onDemo,
  onEdit,
  busy = false,
  error = null,
}: {
  plan: RadarPlan;
  url: string;
  onUrlChange: (v: string) => void;
  onActivate: () => void;
  onDemo: () => void;
  onEdit: () => void;
  busy?: boolean;
  error?: string | null;
}) {
  const { t } = useI18n();
  const [touched, setTouched] = useState(false);
  const missingUrl = url.trim().length === 0;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-10 pt-6 sm:max-w-xl sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <RadarMark size={22} />
          <span className="text-sm font-semibold tracking-[0.18em]">RADAR</span>
        </div>
        <LanguageSelector />
      </header>

      <main className="flex-1 py-10">
        <h1 className="sr-only">{t("understood")}</h1>
        <div className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-xs font-medium text-success">
          <Check className="h-3.5 w-3.5" />
          {t("understood")}
        </div>

        <p className="mt-4 line-clamp-5 overflow-hidden break-words rounded-2xl border border-border bg-secondary/60 p-4 text-sm italic text-muted-foreground">
          “{plan.raw}”
        </p>

        <div className="mt-6 space-y-3">
          <Block icon={<Target className="h-4 w-4" />} label={t("whatMonitor")}>
            <p className="break-words text-base font-medium">{plan.target}</p>
          </Block>
          <Block icon={<Bell className="h-4 w-4" />} label={t("condition")}>
            <p className="text-sm leading-relaxed">{plan.condition}</p>
          </Block>

          <Block icon={<Link2 className="h-4 w-4" />} label={t("urlLabel")}>
            <input
              type="url"
              inputMode="url"
              dir="ltr"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={t("urlPlaceholder")}
              className="min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
            />
            <p className="mt-2 text-xs text-muted-foreground">{t("urlHint")}</p>
            {touched && missingUrl ? (
              <p className="mt-1 text-xs text-muted-foreground">{t("sourceRequired")}</p>
            ) : null}
          </Block>

          <Block icon={<Globe className="h-4 w-4" />} label={t("sources")}>
            <ul className="space-y-1.5">
              {plan.sources.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
                  {s}
                </li>
              ))}
            </ul>
          </Block>
        </div>

        {error ? (
          <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mt-8 space-y-3">
          <button
            onClick={onActivate}
            disabled={busy || missingUrl}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lift transition-colors hover:bg-primary/92 disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {busy ? t("activating") : t("activate")}
            {!busy ? <ArrowRight className="h-4 w-4 rtl:rotate-180" /> : null}
          </button>
          <p className="text-center text-xs text-muted-foreground">{t("accountNeededSub")}</p>
          <button
            onClick={onDemo}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            {t("demoMode")}
          </button>
          <button
            onClick={onEdit}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Pencil className="h-4 w-4" />
            {t("edit")}
          </button>
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}

function Block({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="text-primary-glow">{icon}</span>
        {label}
      </div>
      {children}
    </section>
  );
}
