'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { ExportGame } from '@/store/gameStore';

interface PlayFooterProps {
  game: ExportGame;
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  finished: boolean;
}

export function PlayFooter({ game, currentIndex, total, onNext, onPrev, finished }: PlayFooterProps) {
  if (finished) return null;

  return (
    <footer className="sticky bottom-0 px-6 py-6 bg-gradient-to-t from-black/20 via-transparent to-transparent">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <motion.button
          onClick={onPrev}
          disabled={currentIndex === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-2xl text-white font-bold disabled:opacity-20 transition-all shadow-lg flex-shrink-0"
          style={{ 
           background: `${game.colorMain}`,
           border: `1px solid ${game.colorSecondary}`,
          }}
          aria-label="Carte précédente"
        >
          <ChevronLeft size={24} />
        </motion.button>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 px-6 rounded-2xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          style={{ 
            background: `${game.colorSecondary}`,
          }}
          aria-label="Carte suivante"
        >
          <span>SUIVANT</span>
          <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
        </motion.button>
      </div>
    </footer>
  );
}
