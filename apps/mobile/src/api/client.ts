import { useAuth } from "../store/auth";

const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const token = useAuth.getState().token;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Accept: "application/json"
  };
  if (options.json) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    body: options.json ? JSON.stringify(options.json) : options.body
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = data?.error ? String(data.error) : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

