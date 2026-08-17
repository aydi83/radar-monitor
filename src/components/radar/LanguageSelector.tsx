import { LANGS, useI18n } from "@/lib/i18n";

export function LanguageSelector() {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5 shadow-soft"
      role="group"
      aria-label={t("language")}
    >
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            lang === l.code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
