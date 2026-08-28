'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { INTENSITY_MIN, INTENSITY_MAX, INTENSITY_LABELS } from '@playlink/shared';
import { useGameStore, type ExportGame, type ExportCategory } from '@/store/gameStore';

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

function IntensitySlider({ game }: { game: ExportGame }) {
  const intensity = useGameStore((s) => s.intensityByGame[game.id] ?? 3);
  const setIntensity = useGameStore((s) => s.setIntensity);
  const pct = ((intensity - INTENSITY_MIN) / (INTENSITY_MAX - INTENSITY_MIN)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-2xl bg-white/5 border border-white/10 px-4 py-4"
    >
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-xs font-semibold tracking-widest text-white/60 uppercase">
          Intensité
        </span>
        <span className="text-sm font-bold text-white">
          {INTENSITY_LABELS[intensity]}{' '}
          <span className="text-white/40 font-medium">{intensity}/{INTENSITY_MAX}</span>
        </span>
      </div>

      <input
        type="range"
        min={INTENSITY_MIN}
        max={INTENSITY_MAX}
        step={1}
        value={intensity}
        onChange={(e) => setIntensity(game.id, Number(e.target.value))}
        aria-label="Intensité des cartes"
        className="w-full h-2 appearance-none rounded-full cursor-pointer accent-white
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white"
        style={{
          background: `linear-gradient(to right, ${game.colorMain} 0%, ${game.colorSecondary} ${pct}%, rgba(255,255,255,0.15) ${pct}%, rgba(255,255,255,0.15) 100%)`,
        }}
      />

      <div className="flex justify-between mt-2">
        {Array.from({ length: INTENSITY_MAX - INTENSITY_MIN + 1 }, (_, i) => i + INTENSITY_MIN).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setIntensity(game.id, level)}
            className={`text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              level === intensity ? 'text-white' : 'text-white/35 hover:text-white/60'
            }`}
          >
            {INTENSITY_LABELS[level]}
          </button>
        ))}
      </div>
    </motion.div>
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

        <IntensitySlider game={game} />

        <div className="flex flex-col gap-4">
          {game.categories.map((cat: ExportCategory, i: number) => (
            <CategoryCard key={cat.id} cat={cat} game={game} index={i} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </main>
  );
}
