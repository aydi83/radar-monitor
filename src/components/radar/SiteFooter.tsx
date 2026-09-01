import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-10 border-t border-border pt-5">
      <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <Link to="/about" className="min-h-9 underline-offset-4 hover:text-foreground hover:underline">
          {t("navAbout")}
        </Link>
        <Link to="/privacy" className="min-h-9 underline-offset-4 hover:text-foreground hover:underline">
          {t("navPrivacy")}
        </Link>
        <Link to="/terms" className="min-h-9 underline-offset-4 hover:text-foreground hover:underline">
          {t("navTerms")}
        </Link>
      </nav>
      <p className="mt-2 text-[11px] text-muted-foreground">{t("notFinancial")}</p>
    </footer>
  );
}
