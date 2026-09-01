import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface TaskSummary {
  id: string;
  request_text: string;
  target_url: string | null;
  target_name: string | null;
  monitor_type: string;
  alert_condition: string | null;
  active: boolean;
  check_interval_minutes: number;
  last_checked_at: string | null;
  created_at: string;
  /** Derived UI state from the real check/change history. */
  state?: "pending" | "stable" | "changed" | "error" | "paused";
  last_error?: string | null;
  last_change_at?: string | null;
}

const TASK_COLUMNS =
  "id, request_text, target_url, target_name, monitor_type, alert_condition, active, check_interval_minutes, last_checked_at, created_at";

export const listMonitorTasks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("monitor_tasks")
      .select(TASK_COLUMNS)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const tasks = (data ?? []) as TaskSummary[];
    if (tasks.length === 0) return tasks;

    const ids = tasks.map((t) => t.id);
    const [{ data: checks }, { data: changes }] = await Promise.all([
      context.supabase
        .from("monitor_checks")
        .select("task_id, checked_at, status, changed, error_message")
        .in("task_id", ids)
        .order("checked_at", { ascending: false })
        .limit(200),
      context.supabase
        .from("monitor_changes")
        .select("task_id, detected_at")
        .in("task_id", ids)
        .order("detected_at", { ascending: false })
        .limit(200),
    ]);

    const latestCheck = new Map<
      string,
      { status: string; changed: boolean; error_message: string | null }
    >();
    for (const c of checks ?? []) {
      if (!latestCheck.has(c.task_id)) {
        latestCheck.set(c.task_id, {
          status: c.status,
          changed: !!c.changed,
          error_message: c.error_message,
        });
      }
    }
    const latestChange = new Map<string, string>();
    for (const c of changes ?? []) {
      if (!latestChange.has(c.task_id)) latestChange.set(c.task_id, c.detected_at);
    }

    return tasks.map((task) => {
      const check = latestCheck.get(task.id);
      const changedAt = latestChange.get(task.id) ?? null;
      let state: TaskSummary["state"] = "pending";
      if (!task.active) state = "paused";
      else if (check?.status === "error") state = "error";
      // Status must reflect the LATEST check, not the mere existence of an old change.
      else if (check?.changed) state = "changed";
      else if (check) state = "stable";
      return { ...task, state, last_error: check?.error_message ?? null, last_change_at: changedAt };
    });
  });


export const getMonitorTask = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id || typeof data.id !== "string") throw new Error("Invalid task id");
    return { id: data.id };
  })
  .handler(async ({ data, context }) => {
    const { data: task, error } = await context.supabase
      .from("monitor_tasks")
      .select(
        "id, request_text, target_url, target_name, monitor_type, alert_condition, active, check_interval_minutes, last_checked_at, created_at",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!task) throw new Error("Task not found");

    const [{ data: checks }, { data: changes }] = await Promise.all([
      context.supabase
        .from("monitor_checks")
        .select("id, checked_at, status, changed, error_message")
        .eq("task_id", data.id)
        .order("checked_at", { ascending: false })
        .limit(10),
      context.supabase
        .from("monitor_changes")
        .select("id, detected_at, title, summary, before_text, after_text, source_url, importance, useful")
        .eq("task_id", data.id)
        .order("detected_at", { ascending: false })
        .limit(20),
    ]);

    return { task: task as TaskSummary, checks: checks ?? [], changes: changes ?? [] };
  });

export const createMonitorTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { requestText: string; url: string; condition?: string | undefined; intervalMinutes?: number | undefined }) => {
    const requestText = (data?.requestText ?? "").trim().slice(0, 500);
    const url = (data?.url ?? "").trim();
    if (requestText.length < 2) throw new Error("Request text is required");
    return {
      requestText,
      url,
      condition: (data?.condition ?? "").trim().slice(0, 500) || null,
      intervalMinutes: Math.min(Math.max(Number(data?.intervalMinutes ?? 360), 30), 10080),
    };
  })
  .handler(async ({ data, context }) => {
    const { validateMonitorUrl } = await import("./monitor-core");
    const checked = validateMonitorUrl(data.url);
    if (!checked.ok || !checked.url) {
      return { ok: false as const, reason: checked.reason ?? "invalid_url" };
    }

    const { data: task, error } = await context.supabase
      .from("monitor_tasks")
      .insert({
        user_id: context.userId,
        request_text: data.requestText,
        target_url: checked.url,
        monitor_type: "webpage",
        alert_condition: data.condition,
        check_interval_minutes: data.intervalMinutes,
      })
      .select("id, target_url, target_name, last_snapshot_hash, last_snapshot_text")
      .single();
    if (error || !task) throw new Error(error?.message ?? "Could not create task");

    // First snapshot, server-side (CORS-free).
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { runCheckForTask } = await import("./monitor.server");
    const result = await runCheckForTask(supabaseAdmin as never, task as never);

    return { ok: true as const, id: task.id as string, first: result };
  });

export const setTaskActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; active: boolean }) => ({ id: String(data.id), active: !!data.active }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("monitor_tasks")
      .update({ active: data.active, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMonitorTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => ({ id: String(data.id) }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("monitor_tasks").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const runTaskCheckNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => ({ id: String(data.id) }))
  .handler(async ({ data, context }) => {
    // Ownership enforced by RLS on this read.
    const { data: task, error } = await context.supabase
      .from("monitor_tasks")
      .select("id, target_url, target_name, last_snapshot_hash, last_snapshot_text, last_checked_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!task) throw new Error("Task not found");

    // Basic rate limit: one manual check per task per 2 minutes.
    if (task.last_checked_at && Date.now() - new Date(task.last_checked_at).getTime() < 120_000) {
      return { status: "rate_limited" as const, changed: false };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { runCheckForTask } = await import("./monitor.server");
    const result = await runCheckForTask(supabaseAdmin as never, task as never);
    return { ...result, status: result.status as "ok" | "error" | "rate_limited" };
  });

export const markChangeUseful = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; useful: boolean }) => ({ id: String(data.id), useful: !!data.useful }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("monitor_changes")
      .update({ useful: data.useful })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });


/** Permanently delete the signed-in user's account and all monitoring data. */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase.from("monitor_tasks").delete().eq("user_id", context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
