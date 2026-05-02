'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

export interface ExportCard {
  id: string;
  text: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  order: number;
}

export interface ExportCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  cards: ExportCard[];
}

export interface ExportGame {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  colorMain: string;
  colorSecondary: string;
  order: number;
  categories: ExportCategory[];
}

interface GameStore {
  games: ExportGame[];
  lastSyncAt: string | null;

  activeCategoryId: string | null;
  deck: ExportCard[];
  currentIndex: number;

  darkMode: boolean;
  isLoading: boolean;
  isOffline: boolean;

  fetchGames: () => Promise<void>;
  startDeck: (categoryId: string) => void;
  next: () => void;
  prev: () => void;
  resetDeck: () => void;
  toggleDark: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      games: [],
      lastSyncAt: null,
      activeCategoryId: null,
      deck: [],
      currentIndex: 0,
      darkMode: false,
      isLoading: false,
      isOffline: false,

      fetchGames: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_URL}/api/cards/export`, { cache: 'no-store' });
          if (!res.ok) throw new Error('API error');
          const json = await res.json() as { data: ExportGame[]; exportedAt: string };
          set({ games: json.data, lastSyncAt: json.exportedAt, isOffline: false, isLoading: false });
        } catch {
          const { games } = get();
          set({ isOffline: true, isLoading: false });
          if (games.length === 0) throw new Error('Pas de données disponibles hors ligne');
        }
      },

      startDeck: (categoryId) => {
        const { games } = get();
        for (const game of games) {
          const category = game.categories.find((c) => c.id === categoryId);
          if (category) {
            set({
              activeCategoryId: categoryId,
              deck: shuffle(category.cards),
              currentIndex: 0,
            });
            return;
          }
        }
      },

      next: () => {
        const { currentIndex, deck } = get();
        if (currentIndex < deck.length) {
          set({ currentIndex: currentIndex + 1 });
        }
      },

      prev: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
          set({ currentIndex: currentIndex - 1 });
        }
      },

      resetDeck: () => set({ activeCategoryId: null, deck: [], currentIndex: 0 }),

      toggleDark: () => {
        const next = !get().darkMode;
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next);
        }
        set({ darkMode: next });
      },
    }),
    {
      name: 'playlink-store',
      partialize: (state) => ({
        games: state.games,
        lastSyncAt: state.lastSyncAt,
        darkMode: state.darkMode,
      }),
    },
  ),
);
