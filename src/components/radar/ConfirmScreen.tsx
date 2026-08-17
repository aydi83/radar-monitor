import { ArrowRight, Bell, Check, Globe, Pencil, Target } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { RadarPlan } from "@/lib/radar-parser";
import { RadarMark } from "./RadarMark";
import { LanguageSelector } from "./LanguageSelector";

export function ConfirmScreen({
  plan,
  onConfirm,
  onEdit,
}: {
  plan: RadarPlan;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pb-10 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RadarMark size={22} />
          <span className="text-sm font-semibold tracking-[0.18em]">RADAR</span>
        </div>
        <LanguageSelector />
      </header>

      <main className="flex-1 py-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-xs font-medium text-success">
          <Check className="h-3.5 w-3.5" />
          {t("understood")}
        </div>

        <p className="mt-4 rounded-2xl border border-border bg-secondary/60 p-4 text-sm italic text-muted-foreground">
          “{plan.raw}”
        </p>

        <div className="mt-6 space-y-3">
          <Block icon={<Target className="h-4 w-4" />} label={t("whatMonitor")}>
            <p className="text-base font-medium">{plan.target}</p>
          </Block>
          <Block icon={<Bell className="h-4 w-4" />} label={t("condition")}>
            <p className="text-sm leading-relaxed">{plan.condition}</p>
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

        <div className="mt-8 space-y-3">
          <button
            onClick={onConfirm}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground shadow-lift transition-colors hover:bg-primary/92"
          >
            {t("start")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </button>
          <button
            onClick={onEdit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Pencil className="h-4 w-4" />
            {t("edit")}
          </button>
        </div>
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
