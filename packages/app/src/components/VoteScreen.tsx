'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface VoteScreenProps {
  playerName: string;
  onPoint: () => void;
  onSkip: () => void;
  gameColors: { colorMain: string; colorSecondary: string };
}

export function VoteScreen({ playerName, onPoint, onSkip, gameColors }: VoteScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="flex flex-col items-center gap-6 px-6 pb-8 pt-2"
    >
      <div className="text-center">
        <p className="text-white text-xl uppercase tracking-widest mb-1">Verdict du groupe</p>
        <p className="text-white font-black text-xl">
          <span style={{ color: gameColors.colorSecondary }}>{playerName}</span> mérite-t-il un point ?
        </p>
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        <motion.button
          onClick={onSkip}
          whileTap={{ scale: 0.93 }}
          className="flex-1 flex flex-col items-center gap-2 py-5 rounded-3xl border border-white/10 bg-white/10"
        >
          <ThumbsDown size={28} className="text-white" />
          <span className="text-white font-bold text-sm">Raté</span>
        </motion.button>

        <motion.button
          onClick={onPoint}
          whileTap={{ scale: 0.93 }}
          className="flex-1 flex flex-col items-center gap-2 py-5 rounded-3xl"
          style={{ background: gameColors.colorMain }}
        >
          <ThumbsUp size={28} className="text-white" />
          <span className="text-white font-black text-sm">Point !</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
