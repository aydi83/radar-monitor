import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { deleteMyAccount } from "@/lib/monitor.functions";

/**
 * Permanently deletes the signed-in user's own account and their monitoring
 * data (server side, ownership enforced). Kept visually separated from the
 * normal actions because it is irreversible.
 */
export function DangerZone() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const remove = useServerFn(deleteMyAccount);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      await remove({});
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      navigate({ to: "/", replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  };

  return (
    <section className="mt-12 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-destructive">
        <AlertTriangle className="h-3.5 w-3.5" />
        {t("deleteAccount")}
      </div>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-3 min-h-11 rounded-full border border-destructive/40 px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          {t("deleteAccount")}
        </button>
      ) : (
        <div className="mt-3">
          <p className="text-sm text-foreground">{t("deleteAccountConfirm")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={run}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-destructive px-4 text-sm font-semibold text-destructive-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("deleteAccount")}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirming(false)}
              className="min-h-11 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground"
            >
              {t("back")}
            </button>
          </div>
        </div>
      )}

      {error ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  );
}
