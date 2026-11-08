import { apiFetch, API_URL } from './api';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST' });
}

export async function getMe(): Promise<User> {
  return apiFetch<User>('/api/auth/me');
}

export async function forgotPassword(email: string): Promise<{ resetUrl?: string }> {
  return apiFetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await apiFetch(`/api/auth/reset-password/${token}`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}