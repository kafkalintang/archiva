// lib/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include', // ← penting agar cookie ikut terkirim
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message ?? 'Request failed');
  }
  return data as T;
}