'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSupabaseClient } from '@/lib/supabase-client';

export interface AppUser {
  id: string;
  email: string;
  supabaseId: string;
  firstName: string | null;
  lastName: string | null;
}

export interface DBPlayer {
  id: string;
  name: string;
  avatar: string | null;
  tagScores: Record<string, number>;
  appUserId: string;
}

interface AuthStore {
  appUser: AppUser | null;
  dbPlayers: DBPlayer[];
  token: string | null;
  isLoading: boolean;

  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (firstName: string, lastName: string) => Promise<void>;
  fetchPlayers: () => Promise<void>;
  createPlayer: (name: string, avatar: string) => Promise<DBPlayer>;
  updatePlayer: (id: string, name: string) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  reset: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      appUser: null,
      dbPlayers: [],
      token: null,
      isLoading: false,

      signUp: async (email, password, firstName, lastName) => {
        set({ isLoading: true });
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) { set({ isLoading: false }); throw new Error(error.message); }

        const token = data.session?.access_token ?? null;
        set({ token });

        if (token) {
          const res = await fetch(`${API_URL}/api/app-users`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName }),
          });
          const json = await res.json();
          set({ appUser: json.data, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      signIn: async (email, password) => {
        set({ isLoading: true });
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { set({ isLoading: false }); throw new Error(error.message); }

        const token = data.session.access_token;
        const res = await fetch(`${API_URL}/api/app-users`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        set({ appUser: json.data, token, isLoading: false });

        await get().fetchPlayers();
      },

      updateProfile: async (firstName, lastName) => {
        const { token, appUser } = get();
        if (!token || !appUser) throw new Error('Not authenticated');
        const res = await fetch(`${API_URL}/api/app-users`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName }),
        });
        if (!res.ok) throw new Error('Mise à jour échouée');
        set({ appUser: { ...appUser, firstName, lastName } });
      },

      signOut: async () => {
        const supabase = getSupabaseClient();
        await supabase.auth.signOut();
        set({ appUser: null, dbPlayers: [], token: null });
      },

      fetchPlayers: async () => {
        const { token } = get();
        if (!token) return;
        const res = await fetch(`${API_URL}/api/players`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = await res.json();
        set({ dbPlayers: json.data ?? [] });
      },

      createPlayer: async (name, avatar) => {
        const { token } = get();
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`${API_URL}/api/players`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, avatar }),
        });
        if (!res.ok) throw new Error('Failed to create player');
        const json = await res.json();
        set((s) => ({ dbPlayers: [...s.dbPlayers, json.data] }));
        return json.data;
      },

      updatePlayer: async (id, name) => {
        const { token } = get();
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`${API_URL}/api/players/${id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Failed to update player');
        set((s) => ({ dbPlayers: s.dbPlayers.map((p) => p.id === id ? { ...p, name } : p) }));
      },

      deletePlayer: async (id) => {
        const { token } = get();
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`${API_URL}/api/players/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete player');
        set((s) => ({ dbPlayers: s.dbPlayers.filter((p) => p.id !== id) }));
      },

      reset: () => set({ appUser: null, dbPlayers: [], token: null }),
    }),
    {
      name: 'playlink-auth',
      partialize: (s) => ({ appUser: s.appUser, token: s.token }),
    },
  ),
);
