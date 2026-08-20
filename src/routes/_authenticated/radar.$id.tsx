import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { RadarMark } from "@/components/radar/RadarMark";
import { LanguageSelector } from "@/components/radar/LanguageSelector";
import {
  deleteMonitorTask,
  getMonitorTask,
  markChangeUseful,
  runTaskCheckNow,
  setTaskActive,
} from "@/lib/monitor.functions";

export const Route = createFileRoute("/_authenticated/radar/$id")({
  head: () => ({
    meta: [
      { title: "Monitor detail — RADAR" },
      { name: "description", content: "Checks, detected changes and controls for one RADAR monitor." },
      { property: "og:title", content: "Monitor detail — RADAR" },
      { property: "og:description", content: "Recent checks and detected changes for this monitored page." },
    ],
  }),
  component: () => (
    <I18nProvider>
      <TaskDetail />
    </I18nProvider>
  ),
});

function TaskDetail() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getTask = useServerFn(getMonitorTask);
  const checkNow = useServerFn(runTaskCheckNow);
  const toggleActive = useServerFn(setTaskActive);
  const removeTask = useServerFn(deleteMonitorTask);
  const rateChange = useServerFn(markChangeUseful);

  const [busy, setBusy] = useState<null | "check" | "toggle" | "delete">(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [rated, setRated] = useState<Record<string, boolean>>({});

  const q = useQuery({ queryKey: ["monitor-task", id], queryFn: () => getTask({ data: { id } }) });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["monitor-task", id] });
    queryClient.invalidateQueries({ queryKey: ["monitor-tasks"] });
  };

  if (q.isLoading) {
    return (
      <p className="flex min-h-dvh items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("loading")}
      </p>
    );
  }
  if (q.isError || !q.data) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="text-sm text-destructive">{q.error instanceof Error ? q.error.message : "Error"}</p>
        <Link to="/radar" className="text-sm underline underline-offset-4">
          {t("back")}
        </Link>
      </div>
    );
  }

  const { task, checks, changes } = q.data;
  const lastCheck = checks[0];
  const state = !task.active
    ? "paused"
    : lastCheck?.status === "error"
      ? "error"
      : changes.length > 0
        ? "changed"
        : lastCheck
          ? "stable"
          : "pending";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-x-clip px-4 pb-10 pt-5 sm:max-w-xl sm:px-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <Link to="/radar" className="flex min-w-0 items-center gap-2">
          <RadarMark size={22} />
          <span className="truncate text-sm font-semibold tracking-[0.18em]">RADAR</span>
        </Link>
        <div className="shrink-0">
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 py-7">
        <Link
          to="/radar"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t("myRadar")}
        </Link>

        <h1 className="mt-3 break-words text-xl font-semibold tracking-tight">
          {task.target_name || task.request_text}
        </h1>
        <p dir="ltr" className="mt-1 break-all text-xs text-muted-foreground">
          {task.target_url}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {t("lastChecked")}:{" "}
          {task.last_checked_at ? new Date(task.last_checked_at).toLocaleString() : t("never")} ·{" "}
          {t("intervalLabel")}: {Math.round(task.check_interval_minutes / 60)}
          {t("hoursShort")}
        </p>

        {/* Real state, from the database only. */}
        {state === "changed" ? (
          <section className="mt-5 rounded-2xl border border-alert/30 bg-alert-soft p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-alert">
              <TrendingDown className="h-4 w-4" />
              {t("changeTitle")}
            </div>
          </section>
        ) : state === "error" ? (
          <section className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {t("monitorError")}
            </div>
            <p className="mt-1 break-words text-xs text-destructive/90">{lastCheck?.error_message}</p>
          </section>
        ) : state === "paused" ? (
          <section className="mt-5 rounded-2xl border border-border bg-secondary/60 p-5 text-sm text-muted-foreground">
            {t("paused")}
          </section>
        ) : state === "pending" ? (
          <section className="mt-5 rounded-2xl border border-border bg-secondary/60 p-5 text-sm text-muted-foreground">
            {t("never")}
          </section>
        ) : (
          <section className="mt-5 rounded-2xl border border-success/25 bg-success-soft p-5 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-success/15 text-success">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-2 text-base font-semibold text-success">{t("noChange")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("noChangeSub")}</p>
          </section>
        )}

        {notice ? (
          <p role="status" className="mt-3 rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground">
            {notice}
          </p>
        ) : null}

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            disabled={busy !== null}
            onClick={async () => {
              setBusy("check");
              setNotice(null);
              try {
                const res = await checkNow({ data: { id } });
                if (res.status === "rate_limited") setNotice(t("tooSoon"));
                refresh();
              } catch (e) {
                setNotice(e instanceof Error ? e.message : String(e));
              } finally {
                setBusy(null);
              }
            }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lift transition-colors hover:bg-primary/92 disabled:opacity-50"
          >
            {busy === "check" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {busy === "check" ? t("checking") : t("checkNow")}
          </button>

          <button
            disabled={busy !== null}
            onClick={async () => {
              setBusy("toggle");
              try {
                await toggleActive({ data: { id, active: !task.active } });
                refresh();
              } finally {
                setBusy(null);
              }
            }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
          >
            {task.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 rtl:rotate-180" />}
            {task.active ? t("pause") : t("resume")}
          </button>

          <button
            disabled={busy !== null}
            onClick={async () => {
              if (!window.confirm(t("confirmDelete"))) return;
              setBusy("delete");
              try {
                await removeTask({ data: { id } });
                queryClient.invalidateQueries({ queryKey: ["monitor-tasks"] });
                navigate({ to: "/radar", replace: true });
              } finally {
                setBusy(null);
              }
            }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {t("remove")}
          </button>
        </div>

        <section className="mt-8">
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t("changesTitle")}
          </h2>
          {changes.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">{t("noChangesYet")}</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {changes.map((c) => (
                <li key={c.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <p className="break-words text-sm font-medium">{c.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {new Date(c.detected_at).toLocaleString()}
                  </p>
                  {c.summary ? <p className="mt-2 text-sm">{c.summary}</p> : null}
                  {c.before_text || c.after_text ? (
                    <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <Excerpt label={t("before")} value={c.before_text} muted />
                      <ArrowRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
                      <Excerpt label={t("after")} value={c.after_text} />
                    </div>
                  ) : null}
                  <div className="mt-3 border-t border-border pt-3">
                    {rated[c.id] || c.useful !== null ? (
                      <p className="text-xs text-success">{t("thanks")}</p>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">{t("useful")}</span>
                        <div className="flex gap-2">
                          {([true, false] as const).map((val) => (
                            <button
                              key={String(val)}
                              onClick={async () => {
                                setRated((r) => ({ ...r, [c.id]: true }));
                                await rateChange({ data: { id: c.id, useful: val } });
                              }}
                              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-3 text-xs transition-colors hover:border-primary-glow"
                            >
                              {val ? <ThumbsUp className="h-3.5 w-3.5" /> : <ThumbsDown className="h-3.5 w-3.5" />}
                              {val ? t("yes") : t("no")}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t("recentChecks")}
          </h2>
          <ul className="mt-3 space-y-2">
            {checks.length === 0 ? (
              <li className="text-sm text-muted-foreground">{t("never")}</li>
            ) : (
              checks.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs"
                >
                  <span className="text-muted-foreground">{new Date(c.checked_at).toLocaleString()}</span>
                  <span
                    className={
                      c.status === "error" ? "text-destructive" : c.changed ? "text-alert" : "text-success"
                    }
                  >
                    {c.status === "error"
                      ? `${t("failedCheck")}${c.error_message ? ` · ${c.error_message}` : ""}`
                      : c.changed
                        ? t("changeTitle")
                        : t("noChange")}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

function Excerpt({ label, value, muted }: { label: string; value: string | null; muted?: boolean }) {
  return (
    <div className={`rounded-xl border border-border p-2 ${muted ? "bg-secondary/60" : "bg-alert-soft"}`}>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <p className={`mt-1 line-clamp-4 break-words text-xs ${muted ? "text-muted-foreground" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}
