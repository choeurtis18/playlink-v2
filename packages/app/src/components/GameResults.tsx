'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Trophy } from 'lucide-react';
import type { SessionPlayer } from '@/store/sessionStore';

interface GameResultsProps {
  players: SessionPlayer[];
  scores: Record<string, number>;
  scoresBeforeSession: Record<string, number>;
  onReset: () => void;
  gameColors: { colorMain: string; colorSecondary: string };
}

const RANK_STYLE = [
  { emoji: '🥇', size: 'text-5xl', nameClass: 'text-xl font-black text-white', order: 0 },
  { emoji: '🥈', size: 'text-4xl', nameClass: 'text-lg font-bold text-white/80', order: 1 },
  { emoji: '🥉', size: 'text-3xl', nameClass: 'text-base font-semibold text-white/70', order: 2 },
];

export function GameResults({ players, scores, scoresBeforeSession, onReset, gameColors }: GameResultsProps) {
  const sessionScores = Object.fromEntries(
    players.map((p) => [p.id, (scores[p.id] ?? 0) - (scoresBeforeSession[p.id] ?? 0)])
  );
  const ranked = [...players].sort((a, b) => (sessionScores[b.id] ?? 0) - (sessionScores[a.id] ?? 0));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="flex flex-col items-center gap-6 px-6 py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
      >
        <Trophy size={52} style={{ color: gameColors.colorSecondary }} />
      </motion.div>

      <div>
        <p className="text-3xl font-black text-white">Partie terminée !</p>
        <p className="text-white/90 text-sm mt-1">Voici le classement de la session</p>
      </div>

      <div className="w-full flex flex-col gap-2">
        {ranked.map((player, i) => {
          const rank = RANK_STYLE[i] ?? { emoji: `${i + 1}.`, size: 'text-2xl', nameClass: 'text-sm font-medium text-white/60', order: i };
          const pts = sessionScores[player.id] ?? 0;
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="flex items-center gap-3 bg-white/30 rounded-2xl px-4 py-3"
            >
              <span className={rank.size}>{rank.emoji}</span>
              <span className="text-2xl">{player.avatar}</span>
              <span className={`flex-1 text-left ${rank.nameClass}`}>{player.name}</span>
              <span className="font-black text-white text-base">
                {pts} pt{pts > 1 ? 's' : ''}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        onClick={onReset}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold shadow-md mt-2"
        style={{ background: gameColors.colorMain }}
      >
        <RotateCcw size={16} />
        Changer de catégorie
      </motion.button>
    </motion.div>
  );
}
