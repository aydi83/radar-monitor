// Server-only monitoring engine: safe fetching, snapshotting and change detection.
import {
  assessChange,
  diffExcerpt,
  hostOf,
  normalizeHtml,
  sha256,
  validateMonitorUrl,
} from "./monitor-core";

const MAX_BYTES = 1_500_000;
const TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 3;

export type FetchOutcome =
  | { ok: true; url: string; text: string; hash: string; title: string | null }
  | { ok: false; status: "error"; reason: string };

/** Fetch a public page with SSRF protection, timeout, size cap and manual redirects. */
export async function fetchSnapshot(inputUrl: string): Promise<FetchOutcome> {
  let current = inputUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const check = validateMonitorUrl(current);
    if (!check.ok || !check.url) return { ok: false, status: "error", reason: check.reason ?? "invalid_url" };
    current = check.url;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "RadarMonitor/1.0 (+https://radar.app)",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en",
        },
      });
    } catch (err) {
      clearTimeout(timer);
      const aborted = err instanceof Error && err.name === "AbortError";
      return { ok: false, status: "error", reason: aborted ? "timeout" : "unreachable" };
    }
    clearTimeout(timer);

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { ok: false, status: "error", reason: "bad_redirect" };
      try {
        current = new URL(loc, current).toString();
      } catch {
        return { ok: false, status: "error", reason: "bad_redirect" };
      }
      continue;
    }

    if (!res.ok) return { ok: false, status: "error", reason: `http_${res.status}` };

    const ctype = (res.headers.get("content-type") ?? "").toLowerCase();
    if (ctype && !/text\/html|text\/plain|application\/xhtml/.test(ctype)) {
      return { ok: false, status: "error", reason: "not_html" };
    }
    const declared = Number(res.headers.get("content-length") ?? "0");
    if (declared > MAX_BYTES) return { ok: false, status: "error", reason: "too_large" };

    const raw = await res.text();
    if (raw.length > MAX_BYTES) return { ok: false, status: "error", reason: "too_large" };

    const titleMatch = raw.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i);
    const text = normalizeHtml(raw);
    if (!text) return { ok: false, status: "error", reason: "empty_content" };

    return {
      ok: true,
      url: current,
      text,
      hash: await sha256(text),
      title: titleMatch?.[1]?.replace(/\s+/g, " ").trim() ?? null,
    };
  }

  return { ok: false, status: "error", reason: "too_many_redirects" };
}

export interface MonitorTaskRow {
  id: string;
  target_url: string | null;
  target_name: string | null;
  last_snapshot_hash: string | null;
  last_snapshot_text: string | null;
}

type AdminClient = {
  from: (table: string) => any;
};

/** Run one check for a task: fetch, compare, persist check + change rows. */
export async function runCheckForTask(admin: AdminClient, task: MonitorTaskRow) {
  const url = task.target_url;
  if (!url) return { status: "error" as const, reason: "no_url", changed: false };

  const outcome = await fetchSnapshot(url);
  const now = new Date().toISOString();

  if (!outcome.ok) {
    const { data: check } = await admin
      .from("monitor_checks")
      .insert({ task_id: task.id, status: "error", changed: false, error_message: outcome.reason })
      .select("id")
      .single();
    await admin.from("monitor_tasks").update({ last_checked_at: now, updated_at: now }).eq("id", task.id);
    return { status: "error" as const, reason: outcome.reason, changed: false, checkId: check?.id };
  }

  const previousText = task.last_snapshot_text ?? "";
  const first = !task.last_snapshot_hash;
  const verdict = first ? { changed: false, score: 0 } : assessChange(previousText, outcome.text);

  const { data: check } = await admin
    .from("monitor_checks")
    .insert({
      task_id: task.id,
      status: "ok",
      content_hash: outcome.hash,
      changed: verdict.changed,
    })
    .select("id")
    .single();

  if (verdict.changed) {
    const excerpt = diffExcerpt(previousText, outcome.text);
    const { error: changeError } = await admin.from("monitor_changes").insert({
      task_id: task.id,
      check_id: check?.id ?? null,
      title: outcome.title ?? task.target_name ?? hostOf(url),
      summary: `About ${Math.round(verdict.score * 100)}% of the tracked content changed.`,
      before_text: excerpt.before.slice(0, 600),
      after_text: excerpt.after.slice(0, 600),
      source_url: outcome.url,
      // Allowed values are exactly "normal" | "important".
      importance: verdict.score >= 0.15 ? "important" : "normal",
    });
    // A silently dropped change row would make the history look empty; surface it.
    if (changeError) console.error("monitor_changes insert failed", changeError);
  }

  await admin
    .from("monitor_tasks")
    .update({
      last_snapshot_hash: outcome.hash,
      last_snapshot_text: outcome.text.slice(0, 200_000),
      last_checked_at: now,
      updated_at: now,
      ...(task.target_name ? {} : { target_name: outcome.title }),
    })
    .eq("id", task.id);

  return { status: "ok" as const, changed: verdict.changed, score: verdict.score, checkId: check?.id };
}
