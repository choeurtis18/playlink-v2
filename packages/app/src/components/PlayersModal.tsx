'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil } from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';

interface PlayersModalProps {
  open: boolean;
  onClose: () => void;
}

export function PlayersModal({ open, onClose }: PlayersModalProps) {
  const router = useRouter();
  const { players, scores } = useSessionStore();

  const handleEdit = () => {
    onClose();
    router.push('/setup');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="w-full bg-indigo-950 border border-white/10 rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h2 className="text-white font-bold text-base">Joueurs de la session</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Modifier les joueurs"
                  >
                    <Pencil size={16} className="text-white/60" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Fermer"
                  >
                    <X size={18} className="text-white/60" />
                  </button>
                </div>
              </div>

              <div className="px-3 py-3 flex flex-col gap-1 max-h-72 overflow-y-auto">
                {players.map((player, i) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/5 transition-colors"
                  >
                    <span className="text-2xl">{player.avatar}</span>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{player.name}</p>
                      <p className="text-white/40 text-xs">Joueur {i + 1}</p>
                    </div>
                    <span className="text-pink-400 font-bold text-sm">
                      {scores[player.id] ?? 0} pt{(scores[player.id] ?? 0) > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
