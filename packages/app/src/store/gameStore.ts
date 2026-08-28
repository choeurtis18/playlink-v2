'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INTENSITY_DEFAULT } from '@playlink/shared';
import { pickWeighted } from '@/lib/intensity-deck';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export interface ExportCard {
  id: string;
  text: string;
  intensity: number;
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
  cardsPerGame: number;

  /** Intensité choisie par jeu (clé = gameId), 1..5 */
  intensityByGame: Record<string, number>;

  darkMode: boolean;
  isLoading: boolean;
  isOffline: boolean;

  fetchGames: () => Promise<void>;
  getIntensity: (gameId: string) => number;
  setIntensity: (gameId: string, value: number) => void;
  startDeck: (categoryId: string) => void;
  next: () => void;
  prev: () => void;
  resetDeck: () => void;
  toggleDark: () => void;
  setCardsPerGame: (n: number) => void;
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
      cardsPerGame: 10,
      intensityByGame: {},
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

      getIntensity: (gameId) => get().intensityByGame[gameId] ?? INTENSITY_DEFAULT,

      setIntensity: (gameId, value) => {
        const clamped = Math.min(5, Math.max(1, Math.round(value)));
        set({ intensityByGame: { ...get().intensityByGame, [gameId]: clamped } });
      },

      startDeck: (categoryId) => {
        const { games, cardsPerGame, intensityByGame } = get();
        for (const game of games) {
          const category = game.categories.find((c) => c.id === categoryId);
          if (category) {
            const target = intensityByGame[game.id] ?? INTENSITY_DEFAULT;
            set({
              activeCategoryId: categoryId,
              deck: pickWeighted(shuffle(category.cards), target, cardsPerGame),
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

      setCardsPerGame: (n) => set({ cardsPerGame: n }),

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
        cardsPerGame: state.cardsPerGame,
        intensityByGame: state.intensityByGame,
        activeCategoryId: state.activeCategoryId,
        deck: state.deck,
        currentIndex: state.currentIndex,
      }),
    },
  ),
);
