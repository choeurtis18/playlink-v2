'use client';

type TrackPayload = {
  gameId?: string;
  categoryId?: string;
  metadata?: Record<string, unknown>;
};

export function useTracking() {
  const track = (type: 'game_started' | 'card_viewed' | 'game_finished', payload?: TrackPayload) => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...payload }),
    }).catch(() => {});
  };

  return { track };
}
