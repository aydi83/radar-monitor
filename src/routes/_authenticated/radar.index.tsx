import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ChevronRight, Loader2, Plus, ShieldCheck, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { RadarMark } from "@/components/radar/RadarMark";
import { LanguageSelector } from "@/components/radar/LanguageSelector";
import { createMonitorTask, listMonitorTasks, type TaskSummary } from "@/lib/monitor.functions";
import { takePendingRequest } from "@/lib/pending-request";

export const Route = createFileRoute("/_authenticated/radar/")({
  head: () => ({
    meta: [
      { title: "My Radar — your active monitors" },
      { name: "description", content: "See every page RADAR is watching for you and what changed." },
      { property: "og:title", content: "My Radar" },
      { property: "og:description", content: "Your active RADAR monitors and their latest state." },
    ],
  }),
  component: () => (
    <I18nProvider>
      <MyRadar />
    </I18nProvider>
  ),
});

function MyRadar() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const list = useServerFn(listMonitorTasks);
  const create = useServerFn(createMonitorTask);
  const handled = useRef(false);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const tasks = useQuery({ queryKey: ["monitor-tasks"], queryFn: () => list({}) });

  // Finish a request the user started before signing in.
  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const pending = takePendingRequest();
    if (!pending) return;
    setCreating(true);
    create({ data: { requestText: pending.requestText, url: pending.url, condition: pending.condition } })
      .then((res) => {
        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: ["monitor-tasks"] });
          navigate({ to: "/radar/$id", params: { id: res.id } });
        } else {
          setPendingError(t("urlInvalid"));
        }
      })
      .catch((e: unknown) => setPendingError(e instanceof Error ? e.message : String(e)))
      .finally(() => setCreating(false));
  }, [create, navigate, queryClient, t]);

  const signOut = useMutation({
    mutationFn: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
    },
    onSuccess: () => navigate({ to: "/auth", replace: true }),
  });

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-x-clip px-4 pb-10 pt-5 sm:max-w-xl sm:px-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <RadarMark size={24} animated />
          <span className="truncate text-base font-semibold tracking-[0.2em]">RADAR</span>
        </Link>
        <div className="shrink-0">
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{t("myRadar")}</h1>
          <button
            onClick={() => signOut.mutate()}
            className="min-h-11 rounded-full border border-border px-4 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("signOut")}
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{t("manualOnly")}</p>

        {pendingError ? (
          <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {pendingError}
          </p>
        ) : null}

        {creating || tasks.isLoading ? (
          <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {creating ? t("creating") : t("loading")}
          </p>
        ) : tasks.data && tasks.data.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {tasks.data.map((task) => (
              <li key={task.id}>
                <TaskCard task={task} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">{t("noTasks")}</p>
        )}

        <Link
          to="/"
          className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-[1.0625rem] font-semibold text-primary-foreground shadow-lift transition-colors hover:bg-primary/92"
        >
          <Plus className="h-4 w-4" />
          {t("newRequest")}
        </Link>
      </main>
    </div>
  );
}

export function StateBadge({ state }: { state: TaskSummary["state"] }) {
  const { t } = useI18n();
  if (state === "changed")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-alert-soft px-2.5 py-1 text-[11px] font-medium text-alert">
        <TrendingDown className="h-3 w-3" />
        {t("changeTitle")}
      </span>
    );
  if (state === "error")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive">
        <AlertTriangle className="h-3 w-3" />
        {t("monitorError")}
      </span>
    );
  if (state === "paused")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
        {t("paused")}
      </span>
    );
  if (state === "pending")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
        {t("never")}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-medium text-success">
      <ShieldCheck className="h-3 w-3" />
      {t("noChange")}
    </span>
  );
}

function TaskCard({ task }: { task: TaskSummary }) {
  const { t } = useI18n();
  return (
    <Link
      to="/radar/$id"
      params={{ id: task.id }}
      className="block rounded-2xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-primary-glow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-sm font-medium">{task.target_name || task.request_text}</p>
          <p dir="ltr" className="mt-1 break-all text-xs text-muted-foreground">
            {task.target_url}
          </p>
        </div>
        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground rtl:rotate-180" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StateBadge state={task.state} />
        <span className="text-[11px] text-muted-foreground">
          {t("lastChecked")}:{" "}
          {task.last_checked_at ? new Date(task.last_checked_at).toLocaleString() : t("never")}
        </span>
        <span className="text-[11px] text-muted-foreground">
          · {t("intervalLabel")}: {Math.round(task.check_interval_minutes / 60)}
          {t("hoursShort")}
        </span>
      </div>
    </Link>
  );
}
