'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { ExportGame } from '@/store/gameStore';

interface GameCardProps {
  game: ExportGame;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  const router = useRouter();

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/game/${game.slug}`)}
      className="relative text-left rounded-2xl overflow-hidden active:shadow-lg transition-shadow w-full h-24"
      style={{ background: `linear-gradient(135deg, ${game.colorMain}, ${game.colorSecondary})` }}
    >
      <div className="p-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="text-4xl leading-none flex-shrink-0">{game.icon ?? '🎲'}</div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white leading-tight truncate">{game.name}</h2>
            <p className="text-xs text-white/70 mt-1">{game.categories.length} CATÉGORIES</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-white/70 flex-shrink-0" />
      </div>
    </motion.button>
  );
}
