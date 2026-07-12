'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Edit2 } from 'lucide-react';
import type { DBPlayer } from '@/store/authStore';

interface DuplicatePlayerModalProps {
  dbPlayer: DBPlayer;
  onImport: () => void;
  onRename: () => void;
  onClose: () => void;
}

export function DuplicatePlayerModal({ dbPlayer, onImport, onRename, onClose }: DuplicatePlayerModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="dup-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 backdrop-blur-sm bg-black/60"
      />
      <motion.div
        key="dup-sheet"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-50 max-w-md mx-auto"
      >
        <div className="bg-indigo-950 rounded-t-3xl border-t border-white/10 px-5 pt-5 pb-10 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 py-2">
            <span className="text-4xl">{dbPlayer.avatar ?? '👤'}</span>
            <p className="text-white font-black text-lg">{dbPlayer.name}</p>
            <p className="text-white/50 text-sm text-center">Ce joueur existe déjà dans ton compte.</p>
          </div>

          <motion.button
            onClick={onImport}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-pink-500 text-white font-bold"
          >
            <UserCheck size={18} />
            Importer le profil existant
          </motion.button>

          <motion.button
            onClick={onRename}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/10 text-white/80 font-bold"
          >
            <Edit2 size={18} />
            Changer de nom
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
