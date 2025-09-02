export const API_BASE = (import.meta as any).env?.VITE_API_URL?.replace(/\/$/,'') || '';

export async function withAuth(): Promise<HeadersInit> {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await withAuth();
  const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json', ...headers } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiJson<T>(path: string, method: 'POST'|'PUT'|'DELETE', body?: unknown): Promise<T> {
  const headers = await withAuth();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...headers },
  });
  if (!res.ok) throw new Error(await res.text());
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export async function apiUpload<T>(path: string, form: FormData): Promise<T> {
  const headers = await withAuth();
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', body: form, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function resolveBaseUrl(): string {
  const raw = (import.meta as any).env?.VITE_API_URL?.trim();
  if (!raw) {
    return `${window.location.origin.replace(/\/$/, '')}/api`;
  }
  // Already absolute http(s)
  if (/^https?:\/\//i.test(raw)) {
    return raw.replace(/\/$/, '');
  }
  // Starts with ":4000/..." → assume localhost
  if (raw.startsWith(':')) {
    return `http://localhost${raw}`.replace(/\/$/, '');
  }
  // Starts with "/api" → relative to current origin
  if (raw.startsWith('/')) {
    return `${window.location.origin}${raw}`.replace(/\/$/, '');
  }
  // Fallback: treat as host[:port]/path
  return `http://${raw}`.replace(/\/$/, '');
}

export const API_BASE_URL = resolveBaseUrl();

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    signal: controller.signal,
    ...init,
  });
  clearTimeout(timeout);
  if (!res.ok) {
    if (res.status === 404) {
      // Provide an empty typed fallback for common collections to avoid hard crashes on first load
      if (path.startsWith('/navigation')) return [] as unknown as T;
      if (path.startsWith('/collections')) return [] as unknown as T;
      if (path.startsWith('/stores')) return [] as unknown as T;
    }
    const text = await res.text();
    throw new Error(text || `GET ${path} failed with ${res.status}`);
  }
  return res.json();
}

export async function apiJson<T>(path: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: unknown, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: controller.signal,
    ...init,
  });
  clearTimeout(timeout);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${method} ${path} failed with ${res.status}`);
  }
  return res.status === 204 ? (undefined as unknown as T) : res.json();
}

export async function apiForm<T>(path: string, method: 'POST' | 'PUT', formData: FormData, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    body: formData,
    signal: controller.signal,
    ...init,
  });
  clearTimeout(timeout);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${method} ${path} failed with ${res.status}`);
  }
  return res.json();
}




