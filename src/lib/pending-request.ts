// Keeps a user's monitoring request across the sign-in redirect.
export interface PendingRequest {
  requestText: string;
  url: string;
  condition?: string;
}

const KEY = "radar.pending";

export function savePendingRequest(req: PendingRequest) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(req));
  } catch {
    /* ignore */
  }
}

export function takePendingRequest(): PendingRequest | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw) as PendingRequest;
    if (!parsed?.requestText || !parsed?.url) return null;
    return parsed;
  } catch {
    return null;
  }
}
