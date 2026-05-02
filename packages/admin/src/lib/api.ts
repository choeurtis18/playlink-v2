import axios from 'axios';
import { supabase } from '@/lib/supabase';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

export const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function apiError(err: unknown): string {
  const e = err as { response?: { data?: { error?: { message?: string } } } };
  return e.response?.data?.error?.message ?? 'Une erreur est survenue';
}

export async function downloadCSV(url: string, filename: string): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch(`${apiUrl}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Export échoué');
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}
