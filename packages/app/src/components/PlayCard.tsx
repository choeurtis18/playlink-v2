'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { ExportCard, ExportGame } from '@/store/gameStore';

const SWIPE_THRESHOLD = 80;

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
  medium: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
  hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
};

interface PlayCardProps {
  game: ExportGame;
  categoryName: string;
  card: ExportCard | undefined;
  currentIndex: number;
  total: number;
  direction: number;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  finished: boolean;
}

export function PlayCard({
  game,
  categoryName,
  card,
  currentIndex,
  total,
  direction,
  onNext,
  onPrev,
  onReset,
  finished,
}: PlayCardProps) {
  const progress = total > 0 ? currentIndex / total : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center justify-between text-xs text-black/40 dark:text-white/40 mb-2">
          <span>{categoryName}</span>
          <span>{finished ? total : currentIndex + 1} / {total}</span>
        </div>
        <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: game.colorMain }}
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      {/* Card area */}
      <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {finished ? (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-6 text-center p-8"
            >
              <div className="text-6xl">🎉</div>
              <div>
                <p className="text-2xl font-bold">Partie terminée !</p>
                <p className="text-sm text-black/50 dark:text-white/50 mt-2">
                  {total} cartes jouées
                </p>
              </div>
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold text-sm shadow-md"
                style={{ background: `linear-gradient(135deg, ${game.colorMain}, ${game.colorSecondary})` }}
              >
                <RotateCcw size={16} />
                Changer de catégorie
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={card?.id ?? 'empty'}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? '60%' : '-60%',
                  opacity: 0,
                  scale: 0.92,
                  rotate: dir > 0 ? 4 : -4,
                }),
                center: { x: 0, opacity: 1, scale: 1, rotate: 0 },
                exit: (dir: number) => ({
                  x: dir > 0 ? '-60%' : '60%',
                  opacity: 0,
                  scale: 0.92,
                  rotate: dir > 0 ? -4 : 4,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x > SWIPE_THRESHOLD) onPrev();
                else if (info.offset.x < -SWIPE_THRESHOLD) onNext();
              }}
              className="w-full max-w-sm cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'pan-y' }}
            >
              <div
                className="rounded-3xl p-8 shadow-xl min-h-[280px] flex flex-col justify-between"
                style={{
                  background: `linear-gradient(135deg, ${game.colorMain}18, ${game.colorSecondary}28)`,
                  border: `1px solid ${game.colorMain}30`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{game.icon ?? '🎲'}</div>
                  {card?.difficulty && (
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${DIFFICULTY_COLOR[card.difficulty] ?? ''}`}>
                      {DIFFICULTY_LABEL[card.difficulty]}
                    </span>
                  )}
                </div>

                <p className="text-xl font-semibold leading-relaxed text-center my-6">
                  {card?.text}
                </p>

                {card?.tags && card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/10 rounded-full px-2 py-0.5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {!finished && (
        <div className="px-8 pb-8 pt-4 flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="p-3 rounded-full bg-black/5 dark:bg-white/10 disabled:opacity-30 transition-opacity"
            aria-label="Carte précédente"
          >
            <ChevronLeft size={22} />
          </button>

          <p className="text-xs text-black/30 dark:text-white/30">
            Swipe ou utilise les flèches
          </p>

          <button
            onClick={onNext}
            className="p-3 rounded-full bg-black/5 dark:bg-white/10 transition-opacity"
            aria-label="Carte suivante"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
