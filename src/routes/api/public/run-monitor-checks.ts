import { createFileRoute } from "@tanstack/react-router";

/**
 * Scheduled monitoring runner. Called by the database cron job with the
 * project's publishable/anon key in the `apikey` header.
 */
export const Route = createFileRoute("/api/public/run-monitor-checks")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected =
          process.env["SUPABASE_ANON_KEY"] ?? process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "";
        const provided = request.headers.get("apikey") ?? "";
        if (!expected || provided !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { runCheckForTask } = await import("@/lib/monitor.server");

        const nowIso = new Date().toISOString();
        const { data: tasks, error } = await supabaseAdmin
          .from("monitor_tasks")
          .select(
            "id, target_url, target_name, last_snapshot_hash, last_snapshot_text, last_checked_at, check_interval_minutes",
          )
          .eq("active", true)
          .not("target_url", "is", null)
          .order("last_checked_at", { ascending: true, nullsFirst: true })
          .limit(25);

        if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

        let checked = 0;
        let changed = 0;
        for (const task of tasks ?? []) {
          const due =
            !task.last_checked_at ||
            Date.now() - new Date(task.last_checked_at).getTime() >=
              (task.check_interval_minutes ?? 360) * 60_000;
          if (!due) continue;
          const result = await runCheckForTask(supabaseAdmin as never, task as never);
          checked++;
          if (result.changed) changed++;
        }

        return Response.json({ ok: true, at: nowIso, checked, changed });
      },
    },
  },
});
