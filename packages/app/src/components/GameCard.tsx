'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { ExportGame } from '@/store/gameStore';

interface GameCardProps {
  game: ExportGame;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  const router = useRouter();
  const totalCards = game.categories.reduce((sum, c) => sum + c.cards.length, 0);

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
      whileTap={{ scale: 0.97 }}
      onClick={() => router.push(`/game/${game.slug}`)}
      className="relative w-full text-left rounded-2xl overflow-hidden shadow-md active:shadow-lg transition-shadow"
      style={{ background: `linear-gradient(135deg, ${game.colorMain}, ${game.colorSecondary})` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="text-4xl leading-none">{game.icon ?? '🎲'}</div>
          <span className="text-xs font-medium text-white/70 bg-white/20 rounded-full px-2.5 py-1 shrink-0">
            {totalCards} cartes
          </span>
        </div>

        <div className="mt-3">
          <h2 className="text-xl font-bold text-white leading-tight">{game.name}</h2>
          {game.description && (
            <p className="mt-1 text-sm text-white/75 line-clamp-2">{game.description}</p>
          )}
        </div>

        <div className="mt-4 flex gap-1.5 flex-wrap">
          {game.categories.map((cat) => (
            <span
              key={cat.id}
              className="text-xs text-white/80 bg-white/15 rounded-full px-2 py-0.5"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
