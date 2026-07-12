'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ExportCard } from '@/store/gameStore';

interface CardGridModalProps {
  cards: ExportCard[];
  currentIndex: number;
  onSelectCard: (index: number) => void;
  onClose: () => void;
  gameColors: { colorMain: string; colorSecondary: string };
  readOnly?: boolean;
}

export function CardGridModal({
  cards,
  currentIndex,
  onSelectCard,
  onClose,
  gameColors,
  readOnly = false,
}: CardGridModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 backdrop-blur-sm bg-black/40"
        />

        {/* Modal content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{
              background: `linear-gradient(135deg, ${gameColors.colorMain}, ${gameColors.colorSecondary})`,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <div>
            <h2 className="text-lg font-bold text-white">Cartes du jeu</h2>
            {readOnly && <p className="text-white/50 text-xs">Lecture seule pendant la partie</p>}
          </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Grid container */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-3 pb-4">
              {cards.map((card, index) => (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => {
                    if (!readOnly) onSelectCard(index);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-lg text-left transition-all ${
                    index === currentIndex
                      ? 'bg-white/60'
                      : 'bg-white/20 hover:bg-white/10'
                  }`}
                  style={
                    index === currentIndex
                      ? {
                          border: `2px solid ${gameColors.colorMain}`,
                          boxShadow: `0 0 16px ${gameColors.colorMain}40`,
                        }
                      : {}
                  }
                >
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-bold text-white/60">
                      #{index + 1}
                    </div>
                    <div className="text-sm font-medium text-white line-clamp-2">
                      {card.text}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
