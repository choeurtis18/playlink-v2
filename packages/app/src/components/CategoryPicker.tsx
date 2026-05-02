'use client';

import { motion } from 'framer-motion';
import type { ExportGame, ExportCategory } from '@/store/gameStore';

interface CategoryPickerProps {
  game: ExportGame;
  onSelect: (categoryId: string) => void;
}

export function CategoryPicker({ game, onSelect }: CategoryPickerProps) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-8">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-center text-black/50 dark:text-white/50"
      >
        Choisissez une catégorie pour commencer
      </motion.p>

      <div className="flex flex-col gap-3">
        {game.categories.map((cat: ExportCategory, i: number) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(cat.id)}
            className="w-full text-left p-4 rounded-2xl bg-white dark:bg-white/5 border border-black/8 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm">{cat.name}</p>
                {cat.description && (
                  <p className="text-xs text-black/50 dark:text-white/50 mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                )}
              </div>
              <span
                className="shrink-0 text-xs font-medium text-white rounded-full px-2.5 py-1"
                style={{ background: game.colorMain }}
              >
                {cat.cards.length} cartes
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
