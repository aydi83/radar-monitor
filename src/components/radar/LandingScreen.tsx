import { useState } from "react";
import { ArrowRight } from "lucide-react";
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
  const { t, lang } = useI18n();
  const [value, setValue] = useState(initialValue);

  const examples =
    lang === "fr"
      ? ["Prix du iPhone 16 chez les revendeurs", "Entreprise Tesla", "Sujet : voitures électriques"]
      : lang === "ar"
        ? ["سعر آيفون 16", "شركة تسلا", "موضوع: السيارات الكهربائية"]
        : ["iPhone 16 price", "Tesla the company", "Topic: electric cars"];

  const chips = [t("exProduct"), t("exCompany"), t("exTopic")];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pb-10 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RadarMark size={26} animated />
          <span className="text-lg font-semibold tracking-[0.18em]">RADAR</span>
        </div>
        <LanguageSelector />
      </header>

      <main className="flex flex-1 flex-col justify-center py-12">
        <div className="relative">
          <div className="radar-glow pointer-events-none absolute -inset-x-16 -top-24 h-64 opacity-70" />
          <h1 className="relative text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t("tagline")}
          </h1>
        </div>

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim().length > 1) onSubmit(value.trim());
          }}
        >
          <label htmlFor="radar-input" className="sr-only">
            {t("placeholder")}
          </label>
          <textarea
            id="radar-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            placeholder={t("placeholder")}
            className="w-full resize-none rounded-2xl border border-border bg-card p-4 text-base leading-relaxed shadow-soft outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary-glow focus:ring-4 focus:ring-ring/15"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => setValue(examples[i])}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary-glow hover:text-foreground"
              >
                {c}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={value.trim().length < 2}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground shadow-lift transition-all hover:bg-primary/92 disabled:opacity-40 disabled:shadow-none"
          >
            {t("start")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </form>
      </main>
    </div>
  );
}
