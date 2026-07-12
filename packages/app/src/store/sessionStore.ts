'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SessionPlayer {
  id: string;
  name: string;
  avatar?: string;
}

export type SessionMode = 'guest' | 'auth';
export type SessionPhase = 'idle' | 'setup' | 'playing' | 'voting' | 'results';

interface CardResult {
  cardId: string;
  tags: string[];
  playerId: string;
  won: boolean;
}

interface SessionStore {
  mode: SessionMode;
  phase: SessionPhase;
  players: SessionPlayer[];
  currentPlayerIndex: number;
  scores: Record<string, number>;
  scoresBeforeSession: Record<string, number>;
  tagScoresGained: Record<string, Record<string, number>>;
  cardResults: CardResult[];
  _hasHydrated: boolean;

  setPlayers: (players: SessionPlayer[]) => void;
  setMode: (mode: SessionMode) => void;
  setHasHydrated: (v: boolean) => void;
  startSession: () => void;
  assignPoint: (playerId: string, tags: string[]) => void;
  skipCard: (playerId: string, tags: string[]) => void;
  nextPlayer: () => void;
  endSession: () => void;
  resetSession: () => void;
}

const initialState = {
  mode: 'guest' as SessionMode,
  phase: 'idle' as SessionPhase,
  players: [] as SessionPlayer[],
  currentPlayerIndex: 0,
  scores: {} as Record<string, number>,
  scoresBeforeSession: {} as Record<string, number>,
  tagScoresGained: {} as Record<string, Record<string, number>>,
  cardResults: [] as CardResult[],
  _hasHydrated: false,
};

function mergeTags(
  current: Record<string, number>,
  tags: string[],
): Record<string, number> {
  const next = { ...current };
  for (const tag of tags) {
    next[tag] = (next[tag] ?? 0) + 1;
  }
  return next;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPlayers: (players) => set({ players }),

      setMode: (mode) => set({ mode }),

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      startSession: () => {
        const { players, scores: existingScores, tagScoresGained: existingTags } = get();
        const scores: Record<string, number> = {};
        const tagScoresGained: Record<string, Record<string, number>> = {};
        for (const p of players) {
          scores[p.id] = existingScores[p.id] ?? 0;
          tagScoresGained[p.id] = existingTags[p.id] ?? {};
        }
        set({
          phase: 'playing',
          currentPlayerIndex: 0,
          scores,
          scoresBeforeSession: { ...scores },
          tagScoresGained,
          cardResults: [],
        });
      },

      assignPoint: (playerId, tags) => {
        const { scores, tagScoresGained, cardResults } = get();
        const cardId = `card-${cardResults.length}`;
        set({
          scores: { ...scores, [playerId]: (scores[playerId] ?? 0) + 1 },
          tagScoresGained: {
            ...tagScoresGained,
            [playerId]: mergeTags(tagScoresGained[playerId] ?? {}, tags),
          },
          cardResults: [...cardResults, { cardId, tags, playerId, won: true }],
          phase: 'voting',
        });
      },

      skipCard: (playerId, tags) => {
        const { cardResults } = get();
        const cardId = `card-${cardResults.length}`;
        set({
          cardResults: [...cardResults, { cardId, tags, playerId, won: false }],
          phase: 'voting',
        });
      },

      nextPlayer: () => {
        const { players, currentPlayerIndex } = get();
        const next = (currentPlayerIndex + 1) % players.length;
        set({ currentPlayerIndex: next, phase: 'playing' });
      },

      endSession: () => set({ phase: 'results' }),

      resetSession: () => {
        const { players, scores, tagScoresGained, _hasHydrated } = get();
        set({ ...initialState, players, scores, tagScoresGained, _hasHydrated });
      },
    }),
    {
      name: 'playlink-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        mode: state.mode,
        phase: state.phase,
        players: state.players,
        currentPlayerIndex: state.currentPlayerIndex,
        scores: state.scores,
        tagScoresGained: state.tagScoresGained,
        cardResults: state.cardResults,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        } else {
          useSessionStore.setState({ _hasHydrated: true });
        }
      },
    },
  ),
);
