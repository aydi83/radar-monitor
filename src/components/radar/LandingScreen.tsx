import { useState } from "react";
import { ArrowRight, Radar } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { RadarMark } from "./RadarMark";
import { LanguageSelector } from "./LanguageSelector";

export function LandingScreen({
  initialValue = "",
  onSubmit,
}: {
  initialValue?: string;
  onSubmit: (value: string) => void;
}) {
  const { t } = useI18n();
  const [value, setValue] = useState(initialValue);

  const examples = [t("ex1"), t("ex2"), t("ex3")];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8 pt-5 sm:max-w-xl sm:px-6 sm:pt-8">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <RadarMark size={26} animated />
          <span className="truncate text-base font-semibold tracking-[0.2em] sm:text-lg">RADAR</span>
        </div>
        <div className="shrink-0">
          <LanguageSelector />
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-center py-10 sm:py-14">
        <div className="relative">
          <div className="radar-glow pointer-events-none absolute -inset-x-16 -top-28 h-72 opacity-70" />
          <h1 className="relative text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-tight sm:text-4xl">
            {t("tagline")}
          </h1>
        </div>

        <form
          className="mt-7"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim().length > 1) onSubmit(value.trim());
          }}
        >
          <label htmlFor="radar-input" className="sr-only">
            {t("placeholder")}
          </label>

          {/* Primary action: the monitoring input, framed with a subtle radar cue. */}
          <div className="relative rounded-3xl bg-gradient-to-b from-primary-glow/25 to-primary/10 p-[1.5px] shadow-lift transition-shadow focus-within:ring-4 focus-within:ring-ring/20">
            <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -end-10 -top-10 h-28 w-28 rounded-full border border-primary/15"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -end-4 -top-4 h-16 w-16 rounded-full border border-primary/10"
              />
              <div className="relative flex items-center gap-2 px-4 pt-3.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-primary-glow">
                <Radar className="h-3.5 w-3.5" />
                RADAR
              </div>
              <textarea
                id="radar-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={3}
                maxLength={280}
                placeholder={t("placeholder")}
                className="relative w-full resize-none break-words bg-transparent px-4 pb-4 pt-2 text-[1.0625rem] leading-relaxed outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={value.trim().length < 2}
            className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-[1.0625rem] font-semibold tracking-tight text-primary-foreground shadow-lift transition-all hover:bg-primary/92 active:scale-[0.99] disabled:opacity-40 disabled:shadow-none"
          >
            {t("start")}
            <ArrowRight className="h-4.5 w-4.5 rtl:rotate-180" />
          </button>

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {t("examples")}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setValue(ex)}
                  className="group inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card/70 px-4 py-2.5 text-start text-sm text-foreground transition-colors hover:border-primary-glow hover:bg-card"
                >
                  <span className="min-w-0 break-words">{ex}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary-glow rtl:rotate-180" />
                </button>
              ))}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
