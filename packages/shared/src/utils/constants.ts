export const GAME_IDS = {
  ACTION_OR_TRUTH: 'action-or-truth',
  ICEBREAKER: 'icebreaker',
  DAMAGE_DEBATE: 'damage-debate',
  BALANCE_YOUR_FRIEND: 'balance-your-friend',
} as const;

export const GAME_NAMES = {
  [GAME_IDS.ACTION_OR_TRUTH]: 'Action ou Vérité',
  [GAME_IDS.ICEBREAKER]: 'Icebreaker',
  [GAME_IDS.DAMAGE_DEBATE]: 'Dégât-Débat',
  [GAME_IDS.BALANCE_YOUR_FRIEND]: 'Balance Ton Pote',
} as const;

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const DEFAULT_COLORS = {
  [GAME_IDS.ACTION_OR_TRUTH]: { main: '#D4537E', secondary: '#ED93B1' },
  [GAME_IDS.ICEBREAKER]: { main: '#5B8DBE', secondary: '#7BA3D1' },
  [GAME_IDS.DAMAGE_DEBATE]: { main: '#D97706', secondary: '#F59E0B' },
  [GAME_IDS.BALANCE_YOUR_FRIEND]: { main: '#7C3AED', secondary: '#A78BFA' },
} as const;
