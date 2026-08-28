export const GAME_IDS = {
  ACTION_OR_TRUTH: 'action-ou-verite',
  ICEBREAKER: 'icebreaker',
  DAMAGE_DEBATE: 'degat-debat',
  BALANCE_YOUR_FRIEND: 'balance-ton-pote',
} as const;

export const GAME_NAMES = {
  [GAME_IDS.ACTION_OR_TRUTH]: 'Action ou Vérité',
  [GAME_IDS.ICEBREAKER]: 'Icebreaker',
  [GAME_IDS.DAMAGE_DEBATE]: 'Dégât-Débat',
  [GAME_IDS.BALANCE_YOUR_FRIEND]: 'Balance Ton Pote',
} as const;

export const INTENSITY_LEVELS = [1, 2, 3, 4, 5] as const;

export const INTENSITY_MIN = 1;
export const INTENSITY_MAX = 5;
export const INTENSITY_DEFAULT = 3;

export const INTENSITY_LABELS: Record<number, string> = {
  1: 'Soft',
  2: 'Léger',
  3: 'Normal',
  4: 'Chaud',
  5: 'Trash',
};

/** Exposant de la pondération par distance dans le tirage (voir pickWeighted). */
export const INTENSITY_WEIGHT_EXPONENT = 1.5;

export const DEFAULT_COLORS = {
  [GAME_IDS.ACTION_OR_TRUTH]: { main: '#D4537E', secondary: '#ED93B1' },
  [GAME_IDS.ICEBREAKER]: { main: '#5B8DBE', secondary: '#7BA3D1' },
  [GAME_IDS.DAMAGE_DEBATE]: { main: '#D97706', secondary: '#F59E0B' },
  [GAME_IDS.BALANCE_YOUR_FRIEND]: { main: '#7C3AED', secondary: '#A78BFA' },
} as const;
