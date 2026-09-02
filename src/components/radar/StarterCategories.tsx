import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { STARTER_CATEGORIES, type StarterItem } from "@/lib/starter-categories";

/**
 * Compact, collapsible starter list. Keeps the landing page uncluttered while
 * making every starter category genuinely reachable.
 */
export function StarterCategories({ onPick }: { onPick: (item: StarterItem) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(STARTER_CATEGORIES[0]?.id ?? null);

  return (
    <section className="mt-8">
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {t("startersTitle")}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">{t("startersHint")}</p>

      <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/70">
        {STARTER_CATEGORIES.map((cat) => {
          const isOpen = open === cat.id;
          return (
            <div key={cat.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : cat.id)}
                className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-start text-sm font-medium"
              >
                {t(cat.labelKey)}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen ? (
                <div className="flex flex-wrap gap-2 px-4 pb-4">
                  {cat.items.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => onPick(item)}
                      className="min-h-11 rounded-full border border-border bg-background px-3.5 text-xs font-medium transition-colors hover:border-primary-glow hover:text-primary-glow"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
