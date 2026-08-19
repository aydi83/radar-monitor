// Pure, deterministic helpers for the RADAR monitoring loop.
// No network, no secrets — safe to import anywhere on the server.

export interface UrlCheckResult {
  ok: boolean;
  url?: string;
  reason?: string;
}

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
  "metadata.google.internal",
]);

function isPrivateIPv4(host: string): boolean {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if ([a, b, Number(m[3]), Number(m[4])].some((n) => Number.isNaN(n) || n > 255)) return true;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true; // link-local / cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // multicast / reserved
  return false;
}

function isPrivateIPv6(host: string): boolean {
  const h = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (!h.includes(":")) return false;
  if (h === "::" || h === "::1") return true;
  if (h.startsWith("fe80") || h.startsWith("fc") || h.startsWith("fd")) return true;
  if (h.startsWith("::ffff:")) return isPrivateIPv4(h.slice(7));
  return false;
}

/** Validate a user-supplied monitoring URL (scheme + basic SSRF protection). */
export function validateMonitorUrl(input: string): UrlCheckResult {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: false, reason: "empty_url" };
  if (raw.length > 2048) return { ok: false, reason: "url_too_long" };

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: "unsupported_scheme" };
  }

  const host = url.hostname.toLowerCase();
  if (!host || BLOCKED_HOSTNAMES.has(host)) return { ok: false, reason: "blocked_host" };
  if (host.endsWith(".local") || host.endsWith(".internal") || !host.includes("."))
    return { ok: false, reason: "blocked_host" };
  if (isPrivateIPv4(host) || isPrivateIPv6(host)) return { ok: false, reason: "blocked_host" };
  if (url.username || url.password) return { ok: false, reason: "credentials_not_allowed" };

  url.hash = "";
  return { ok: true, url: url.toString() };
}

/**
 * Turn raw HTML into a normalized, comparable text snapshot.
 * Volatile content (scripts, styles, timestamps, ids, tokens, nonces) is
 * removed so trivial churn is not reported as a change.
 */
export function normalizeHtml(html: string): string {
  let text = html;
  text = text.replace(/<!--[\s\S]*?-->/g, " ");
  text = text.replace(/<(script|style|noscript|svg|iframe)[\s\S]*?<\/\1>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");

  // Drop volatile tokens.
  text = text
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, " ") // uuids
    .replace(/\b[0-9a-f]{16,}\b/gi, " ") // hashes / nonces
    .replace(/\b\d{1,2}:\d{2}(:\d{2})?\s*(am|pm)?\b/gi, " ") // clock times
    .replace(/\b\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?)?\b/g, " ") // ISO dates
    .replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, " ") // slashed dates
    .replace(/\b\d{10,}\b/g, " "); // epoch-ish / random ids

  return text.replace(/\s+/g, " ").trim();
}

/** Short, human-readable excerpt around the first difference. */
export function diffExcerpt(before: string, after: string, radius = 120) {
  let i = 0;
  const max = Math.min(before.length, after.length);
  while (i < max && before[i] === after[i]) i++;
  const start = Math.max(0, i - radius / 2);
  return {
    before: before.slice(start, start + radius).trim(),
    after: after.slice(start, start + radius).trim(),
  };
}

export interface ChangeVerdict {
  changed: boolean;
  score: number; // 0..1 fraction of content that differs
}

/** Deterministic "is this a meaningful change?" verdict. */
export function assessChange(before: string, after: string, minScore = 0.02): ChangeVerdict {
  if (before === after) return { changed: false, score: 0 };
  const a = new Set(tokenize(before));
  const b = new Set(tokenize(after));
  if (a.size === 0 && b.size === 0) return { changed: false, score: 0 };
  let shared = 0;
  for (const tok of b) if (a.has(tok)) shared++;
  const union = a.size + b.size - shared || 1;
  const score = 1 - shared / union;
  const lengthDelta = Math.abs(after.length - before.length);
  const meaningful = score >= minScore && (lengthDelta >= 20 || score >= 0.05);
  return { changed: meaningful, score: Number(score.toFixed(4)) };
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^\p{L}\p{N}%.,€$£]+/u).filter((w) => w.length > 1);
}

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
