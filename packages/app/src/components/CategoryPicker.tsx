'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { ExportGame, ExportCategory } from '@/store/gameStore';

interface CategoryPickerProps {
  game: ExportGame;
  onSelect: (categoryId: string) => void;
}

function useRandomCard(cat: ExportCategory): string | null {
  return useMemo(() => {
    if (!cat.cards.length) return null;
    return cat.cards[Math.floor(Math.random() * cat.cards.length)].text;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat.id]);
}

function CategoryCard({ cat, game, index, onSelect }: { cat: ExportCategory; game: ExportGame; index: number; onSelect: (id: string) => void }) {
  const preview = useRandomCard(cat);
  return (
    <motion.button
      key={cat.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(cat.id)}
      className="w-full text-left rounded-2xl overflow-hidden active:shadow-lg transition-shadow"
      style={{ background: `linear-gradient(135deg, ${game.colorMain}40, ${game.colorSecondary}40)` }}
    >
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          <span className="text-2xl flex-shrink-0">{cat.icon ?? '🎮'}</span>
          <div className="min-w-0">
            <p className="font-bold text-white leading-tight truncate">{cat.name}</p>
            {preview && (
              <p className="text-xs text-white/60 mt-1 line-clamp-2 italic">{preview}</p>
            )}
          </div>
        </div>
        <ChevronRight size={20} className="text-white/70 flex-shrink-0" />
      </div>
    </motion.button>
  );
}

export function CategoryPicker({ game, onSelect }: CategoryPickerProps) {
  return (
    <main className="flex-1 px-4 py-6 pb-8 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 text-[200px] opacity-5 pointer-events-none leading-none">
        {game.icon}
      </div>
      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-6"
        >
          Choisis ton mode
        </motion.p>

        <div className="flex flex-col gap-4">
          {game.categories.map((cat: ExportCategory, i: number) => (
            <CategoryCard key={cat.id} cat={cat} game={game} index={i} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </main>
  );
}
