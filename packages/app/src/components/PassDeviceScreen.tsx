'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Smartphone } from 'lucide-react';

interface PassDeviceScreenProps {
  playerName: string;
  playerAvatar?: string;
  gameColors: { colorMain: string; colorSecondary: string };
  onReady: () => void;
}

/**
 * Écran plein bloquant entre deux tours : masque la carte suivante le temps
 * que le téléphone change de mains (indispensable pour Mime / Devine le mot).
 */
export function PassDeviceScreen({ playerName, playerAvatar, gameColors, onReady }: PassDeviceScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center px-6 text-center"
      style={{ background: `linear-gradient(160deg, ${gameColors.colorMain}, ${gameColors.colorSecondary})` }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.05 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full bg-white/15 border border-white/25 flex items-center justify-center"
        >
          {playerAvatar ? (
            <span className="text-4xl leading-none">{playerAvatar}</span>
          ) : (
            <Smartphone size={32} className="text-white" />
          )}
        </motion.div>

        <div>
          <p className="text-white/70 text-sm uppercase tracking-widest mb-2">
            Passe le téléphone à
          </p>
          <p className="text-white text-4xl leading-tight">{playerName}</p>
        </div>

        <p className="text-white/60 text-sm max-w-xs leading-relaxed">
          Ne regarde pas l&apos;écran tant que ce n&apos;est pas ton tour.
        </p>
      </motion.div>

      <motion.button
        onClick={onReady}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-12 flex items-center gap-2 rounded-full bg-white px-8 py-4 shadow-xl"
      >
        <span className="text-lg" style={{ color: gameColors.colorMain }}>
          C&apos;est moi, {playerName}
        </span>
        <ArrowRight size={20} style={{ color: gameColors.colorMain }} />
      </motion.button>
    </motion.div>
  );
}
