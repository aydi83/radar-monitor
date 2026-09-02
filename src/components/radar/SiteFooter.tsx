import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  const cls = "min-h-9 underline-offset-4 hover:text-foreground hover:underline";
  return (
    <footer className="mt-10 border-t border-border pt-5">
      <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <Link to="/about" hash="about" className={cls}>
          {t("navAbout")} RADAR
        </Link>
        <Link to="/about" hash="business" className={cls}>
          {t("navBusiness")}
        </Link>
        <Link to="/about" hash="contact" className={cls}>
          {t("navContact")}
        </Link>
        <Link to="/privacy" className={cls}>
          {t("navPrivacy")}
        </Link>
        <Link to="/terms" className={cls}>
          {t("navTerms")}
        </Link>
      </nav>
      <p className="mt-2 text-[11px] text-muted-foreground">{t("notFinancial")}</p>
    </footer>
  );
}
