'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { ExportGame } from '@/store/gameStore';

interface PlayFooterProps {
  game: ExportGame;
  onReveal: () => void;
  disabled?: boolean;
}

export function PlayFooter({ game, onReveal, disabled }: PlayFooterProps) {
  return (
    <footer className="sticky bottom-0 px-6 py-6 bg-gradient-to-t from-black/20 via-transparent to-transparent">
      <div className="max-w-md mx-auto">
        <motion.button
          onClick={onReveal}
          disabled={disabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 px-6 rounded-2xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: game.colorSecondary }}
          aria-label="Révéler et voter"
        >
          <span>RÉVÉLER</span>
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </footer>
  );
}
