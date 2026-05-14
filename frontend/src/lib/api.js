export function getApiBase() {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base || typeof base !== "string") {
    throw new Error("VITE_API_BASE_URL is not set");
  }
  return base.replace(/\/$/, "");
}

export async function fetchJson(path, { signal } = {}) {
  const url = `${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, { signal });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body.message || body.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  if (body.success === false) {
    throw new Error(body.message || "Request failed");
  }
  return body;
}
